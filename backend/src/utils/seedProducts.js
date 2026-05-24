import dotenv from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import connectDB from "../config/db.js";
import Product from "../models/Product.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../../.env") });

export const seedProducts = [
  {
    name: "Choco Fudge Brownie",
    slug: "choco-fudge-brownie",
    category: "brownies",
    price: 120,
    image: "/assets/choco-fudge-brownie.svg",
    description: "Dense cocoa brownie with a glossy fudge top and melty chocolate pockets.",
    featured: true
  },
  {
    name: "Walnut Brownie",
    slug: "walnut-brownie",
    category: "brownies",
    price: 140,
    image: "/assets/walnut-brownie.svg",
    description: "Classic dark chocolate brownie finished with toasted walnut crunch.",
    featured: true
  },
  {
    name: "Triple Chocolate Cookie",
    slug: "triple-chocolate-cookie",
    category: "cookies",
    price: 95,
    image: "/assets/triple-chocolate-cookie.svg",
    description: "A soft cookie loaded with dark, milk, and white chocolate chunks.",
    featured: true
  },
  {
    name: "Red Velvet Cookie",
    slug: "red-velvet-cookie",
    category: "cookies",
    price: 110,
    image: "/assets/red-velvet-cookie.svg",
    description: "Velvety cocoa cookie with creamy white chocolate chips.",
    featured: false
  },
  {
    name: "Nutella Brownie",
    slug: "nutella-brownie",
    category: "brownies",
    price: 160,
    image: "/assets/nutella-brownie.svg",
    description: "Rich brownie swirled with hazelnut spread and a silky center.",
    featured: true
  },
  {
    name: "Almond Cookie",
    slug: "almond-cookie",
    category: "cookies",
    price: 90,
    image: "/assets/almond-cookie.svg",
    description: "Buttery cookie with roasted almond slices and a crisp edge.",
    featured: false
  }
];

export async function seedProductsIfNeeded() {
  const count = await Product.countDocuments();
  if (count > 0) return;
  await Product.insertMany(seedProducts);
  console.log("Seeded bakery products");
}

if (process.argv[1]?.endsWith("seedProducts.js")) {
  connectDB()
    .then(async () => {
      await Product.deleteMany({});
      await Product.insertMany(seedProducts);
      console.log("Products seeded successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
