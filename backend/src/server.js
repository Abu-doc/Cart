import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import { Product } from "./product.model.js";
import { CartItem } from "./cart.model.js";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ CONNECT DB
connectDB();

// ✅ SEED PRODUCTS IF EMPTY
Product.countDocuments().then(async (count) => {
  if (count === 0) {
    await Product.insertMany([
      { name: "Vibe Tee", price: 599, image: "https://via.placeholder.com/200?text=Tee" },
      { name: "Hoodie", price: 1999, image: "https://via.placeholder.com/200?text=Hoodie" },
      { name: "Cap", price: 399, image: "https://via.placeholder.com/200?text=Cap" },
      { name: "Sneakers", price: 4999, image: "https://via.placeholder.com/200?text=Sneakers" },
      { name: "Sticker Pack", price: 199, image: "https://via.placeholder.com/200?text=Stickers" }
    ]);
    console.log("✅ Products seeded");
  }
});

// ✅ GET PRODUCTS
app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// ✅ ADD / UPDATE CART
app.post("/api/cart", async (req, res) => {
  const { productId, qty } = req.body;

  if (!productId || typeof qty !== "number") {
    return res.status(400).json({ error: "Invalid data" });
  }

  let existing = await CartItem.findOne({ productId });

  if (existing) {
    existing.qty += qty;

    // ✅ REMOVE IF QTY <= 0
    if (existing.qty <= 0) {
      await CartItem.findByIdAndDelete(existing._id);
      return res.json({ ok: true, removed: true });
    }

    await existing.save();
    return res.json({ ok: true, item: existing });
  }

  // ✅ CREATE NEW ITEM IF QTY > 0
  if (qty > 0) {
    const newItem = await CartItem.create({ productId, qty });
    return res.json({ ok: true, item: newItem });
  }

  return res.status(400).json({ error: "Qty must be > 0" });
});

// ✅ GET CART ITEMS (WITH IMAGES)
app.get("/api/cart", async (req, res) => {
  const items = await CartItem.find().populate("productId");

  const detailed = items.map((i) => ({
    id: i._id,
    productId: i.productId._id,
    name: i.productId.name,
    price: i.productId.price,
    image: i.productId.image,
    qty: i.qty,
    lineTotal: i.productId.price * i.qty,
  }));

  const total = detailed.reduce((sum, i) => sum + i.lineTotal, 0);

  res.json({ items: detailed, total });
});

// ✅ REMOVE FROM CART
app.delete("/api/cart/:id", async (req, res) => {
  await CartItem.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// ✅ CHECKOUT
app.post("/api/checkout", async (req, res) => {
  const { name, email, cartItems } = req.body;

  if (!name || !email || !Array.isArray(cartItems))
    return res.status(400).json({ error: "Invalid checkout data" });

  let total = 0;

  for (const item of cartItems) {
    const product = await Product.findById(item.productId);
    if (product) total += product.price * item.qty;
  }

  const receipt = {
    receiptId: "RCT-" + Date.now(),
    total,
    timestamp: new Date().toISOString(),
  };

  await CartItem.deleteMany();
  res.json(receipt);
});

// ✅ START SERVER
app.listen(4000, () => {
  console.log("✅ Backend running at http://localhost:4000");
});
