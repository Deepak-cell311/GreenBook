import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url"; // ESM __dirname fix
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

// --- ESM __dirname Fix ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const viteLogger = createLogger();

// ----- LOG FUNCTION -----
export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

// ----- VITE DEV MIDDLEWARE SETUP -----
export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    // DEV: use /client/index.html, PROD: use /dist/public/index.html
    const devTemplate = path.resolve(__dirname, "..", "client", "index.html");
    const prodTemplate = path.join(process.cwd(), "dist", "public", "index.html");
    const templatePath = fs.existsSync(devTemplate) ? devTemplate : prodTemplate;

    console.log("[VITE] Using templatePath:", templatePath, "exists:", fs.existsSync(templatePath));

    try {
      if (!fs.existsSync(templatePath)) {
        throw new Error(`index.html not found at ${templatePath}`);
      }
      let template = await fs.promises.readFile(templatePath, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

// ----- STATIC SERVE FOR PRODUCTION -----
export function serveStatic(app: Express) {
  const staticPath = path.join(process.cwd(), "dist", "public");
  const indexPath = path.join(staticPath, "index.html");
  console.log("[STATIC SERVE] Serving static from:", staticPath, "exists:", fs.existsSync(staticPath));
  app.use(express.static(staticPath));
  app.get("*", (req, res) => {
    console.log("[STATIC SERVE] index.html path:", indexPath, "exists:", fs.existsSync(indexPath));
    res.sendFile(indexPath);
  });
}
