import Product from "../models/Product.js";

export async function getProducts(req, res, next) {
  try {
    const { category, search } = req.query;
    const query = { inStock: true };

    if (category && category !== "all") {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const products = await Product.find(query).sort({ featured: -1, createdAt: -1 });
    res.json({ products });
  } catch (error) {
    next(error);
  }
}
