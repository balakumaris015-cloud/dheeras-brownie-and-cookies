import Order from "../models/Order.js";

export async function createOrder(req, res, next) {
  try {
    const { customer, items, payment } = req.body;

    if (!customer?.customerName || !customer?.phone || !customer?.address) {
      res.status(400);
      throw new Error("Customer name, phone number, and delivery address are required.");
    }

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400);
      throw new Error("Cart cannot be empty.");
    }

    const subtotal = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);

    const order = await Order.create({
      customer,
      items,
      subtotal,
      total: subtotal,
      payment: {
        method: "UPI",
        upiId: payment?.upiId || "dheera@upi",
        status: payment?.status || "paid_by_customer_confirmation"
      }
    });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    next(error);
  }
}

export async function getOrders(_req, res, next) {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    next(error);
  }
}
