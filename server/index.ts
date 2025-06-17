console.log("✅ Starting GreenBook server...");
console.log("📦 DATABASE_URL:", process.env.DATABASE_URL || "⚠️ NOT SET");

import path from "path";
import { fileURLToPath } from "url";
import 'dotenv/config';
import fs from "fs";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, log } from "./vite";

// --- ESM __dirname fix, but prefer process.cwd() for prod static assets ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ----- Logging Middleware -----
app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJsonResponse: any = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
});

(async () => {
  try {

    // ======== Serve Frontend First ========
    if (app.get("env") === "development") {
      const server = await registerRoutes(app);
      await setupVite(app, server); // If you're using Vite dev middleware
    } else {
      const staticPath = path.join(__dirname, "..", "dist", "public");
      console.log("[STATIC SERVE] Using static path:", staticPath);

      if (!fs.existsSync(staticPath)) {
        console.error("❌ No static directory found for serving frontend!", staticPath);
      } else {
        // Serve static files
        app.use(express.static(staticPath));

        // Catch-all route for React Router
        app.get("*", (req, res, next) => {
          if (req.path.startsWith("/api")) return next(); // Let API handler deal with it
          res.sendFile(path.join(staticPath, "index.html"));
        });
      }
    }

    // ======== Register API Routes ========
    console.log("🛠 Registering routes...");
    const server = await registerRoutes(app); // Likely wraps app in http.createServer
    console.log("✅ Routes registered");

    // ======== Global Error Handler ========
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      if (!res.headersSent) {
        res.status(status).json({ message });
      } else {
        log(`Error after headers sent: ${message}`);
      }
    });

    // ======== Start Server ========
    const port = process.env.PORT || 5000;
    server.listen(port, () => {
      log(`✅ Server running on port ${port} in ${app.get("env")} mode`);
    });
  } catch (err: any) {
    console.error("❌ Fatal startup error:", err.message || err);
    process.exit(1);
  }
})();
