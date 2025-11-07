import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },
  qty: Number
});

export const CartItem = mongoose.model("CartItem", cartItemSchema);
