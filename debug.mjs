console.log("✅ Reached debug.mjs");

try {
  const mod = await import("./dist/index.js");
  console.log("✅ Successfully imported index.js");
} catch (err) {
  console.error("❌ Failed to import index.js:", err);
  process.exit(1);
}
