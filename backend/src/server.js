import dotenv from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import app from "./app.js";
import connectDB from "./config/db.js";
import { seedProductsIfNeeded } from "./utils/seedProducts.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../.env") });

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();

  if (process.env.AUTO_SEED === "true") {
    await seedProductsIfNeeded();
  }

  app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
