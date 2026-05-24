import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import { seedProductsIfNeeded } from "./utils/seedProducts.js";

dotenv.config();

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
