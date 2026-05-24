import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../.env") });

const app = express();

const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";

app.use(helmet());
app.use(
  cors({
    origin: allowedOrigin.split(",").map((origin) => origin.trim()),
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 120,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "dheeras-bakery-api" });
});

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
