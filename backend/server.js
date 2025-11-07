import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import { Product } from "./product.model.js";
import { CartItem } from "./cart.model.js";

const app = express();

// ✅ ALLOW VERCEL FRONTEND
app.use(
  cors({
    origin: [
      "https://cart-abu-doc.vercel.app",
      "http://localhost:5173"
    ],
    methods: ["GET", "POST", "DELETE"],
  })
);

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
      { name: "Sneakers", price: 4999, image: "https://via.placeholder.com/200?text=Shoes" },
      { name: "Sticker Pack", price: 199, image: "https://via.placeholder.com/200?text=Stickers" }
    ]);
  }
});

// ✅ GET PRODUCTS
app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// ✅ ADD TO CART
app.post("/api/cart", async (req, res) => {
  const { productId, qty } = req.body;

  if (!productId || !qty)
    return res.status(400).json({ error: "Invalid data" });

  let item = await CartItem.findOne({ productId });

  if (item) {
    item.qty += qty;
    if (item.qty <= 0) {
      await CartItem.findByIdAndDelete(item._id);
      return res.json({ ok: true });
    }
    await item.save();
    return res.json({ ok: true, item });
  }

  const newItem = await CartItem.create({ productId, qty });
  res.json({ ok: true, item: newItem });
});

// ✅ GET CART ITEMS
app.get("/api/cart", async (req, res) => {
  const items = await CartItem.find().populate("productId");

  const detailed = items.map((i) => ({
    id: i._id,
    productId: i.productId._id,
    name: i.productId.name,
    price: i.productId.price,
    image: i.productId.image,
    qty: i.qty,
    lineTotal: i.productId.price * i.qty
  }));

  const total = detailed.reduce((sum, i) => sum + i.lineTotal, 0);
  res.json({ items: detailed, total });
});

// ✅ REMOVE ITEM
app.delete("/api/cart/:id", async (req, res) => {
  await CartItem.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// ✅ CHECKOUT
app.post("/api/checkout", async (req, res) => {
  const { name, email, cartItems } = req.body;

  if (!name || !email)
    return res.status(400).json({ error: "Missing data" });

  let total = 0;

  for (const item of cartItems) {
    const p = await Product.findById(item.productId);
    if (p) total += p.price * item.qty;
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
