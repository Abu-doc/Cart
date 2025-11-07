import { useEffect, useState, useCallback } from "react";

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [checkoutData, setCheckoutData] = useState({ name: "", email: "" });
  const [receipt, setReceipt] = useState(null);

  // Load products + cart
  useEffect(() => {
    fetch("http://localhost:4000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
    loadCart();
  }, []);

  const loadCart = useCallback(() => {
    fetch("http://localhost:4000/api/cart")
      .then((res) => res.json())
      .then((data) => setCart(data));
  }, []);

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1400);
  };

  const addToCart = async (productId) => {
    await fetch("http://localhost:4000/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, qty: 1 }),
    });
    loadCart();
    triggerToast();
  };

  const increaseQty = async (item) => {
    await fetch("http://localhost:4000/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: item.productId, qty: 1 }),
    });
    loadCart();
  };

  const decreaseQty = async (item) => {
    await fetch("http://localhost:4000/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: item.productId, qty: -1 }),
    });
    loadCart();
  };

  const removeFromCart = async (id) => {
    await fetch(`http://localhost:4000/api/cart/${id}`, { method: "DELETE" });
    loadCart();
  };

  const handleCheckout = async () => {
    if (!checkoutData.name || !checkoutData.email) {
      alert("Please enter name & email");
      return;
    }

    const res = await fetch("http://localhost:4000/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: checkoutData.name,
        email: checkoutData.email,
        cartItems: cart.items,
      }),
    });

    const data = await res.json();
    setReceipt(data);
    setIsCartOpen(false);
    loadCart();
  };

  const cartCount = cart.items.reduce((n, item) => n + item.qty, 0);

  // Close drawer on ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setIsCartOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="font-sans bg-gradient-to-b from-indigo-100 to-purple-100 min-h-screen">

      {/* NAVBAR */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-3xl font-extrabold text-purple-700">VibeCart 🛍️</h1>

        <button
          onClick={() => setIsCartOpen(true)}
          className="flex items-center gap-3 active:scale-95 transition"
        >
          <span className="text-lg font-semibold text-gray-700">Cart</span>
          <div className="relative">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white text-xl">
              🛒
            </div>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-sm px-2 py-0.5 rounded-full shadow">
                {cartCount}
              </span>
            )}
          </div>
        </button>
      </nav>

      {/* Toast */}
      {showToast && (
        <div className="fixed top-20 right-5 bg-purple-600 text-white px-4 py-2 rounded-xl shadow-lg animate-bounce z-40">
          ✅ Added to Cart!
        </div>
      )}

      {/* Products List */}
      <div className="p-6">
        <h2 className="text-2xl font-semibold mt-2 mb-3 text-purple-800">Products</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p._id}
              className="border rounded-xl bg-white shadow-md p-4 hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-48 object-cover rounded-lg mb-3"
              />

              <h3 className="text-lg font-bold text-gray-800">{p.name}</h3>
              <p className="text-gray-700">₹{p.price}</p>

              <button
                onClick={() => addToCart(p._id)}
                className="mt-3 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* OVERLAY */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity ${
          isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* ✅ FINAL FIXED CART DRAWER */}
      <aside
        className={`fixed top-0 right-0 w-full sm:w-[420px] h-screen bg-white z-50 shadow-2xl 
        transform transition-transform duration-300 
        ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
      >

        {/* Header */}
        <div className="px-5 py-4 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold text-purple-700">Your Cart</h3>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg"
          >
            Close
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex flex-col h-full">

          {/* ✅ SCROLLABLE ITEMS */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">

            {cart.items.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <div className="text-5xl mb-3">🛒</div>
                <p>Your cart is empty.</p>
              </div>
            ) : (
              cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 bg-white rounded-xl shadow border border-purple-200"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg border"
                  />

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-semibold">{item.name}</h4>
                      <span className="font-semibold text-purple-700">₹{item.price}</span>
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => decreaseQty(item)}
                        className="w-8 h-8 bg-purple-200 rounded-lg font-bold"
                      >
                        -
                      </button>

                      <span>{item.qty}</span>

                      <button
                        onClick={() => increaseQty(item)}
                        className="w-8 h-8 bg-purple-200 rounded-lg font-bold"
                      >
                        +
                      </button>
                    </div>

                    <p className="text-sm mt-1">
                      Line total:{" "}
                      <span className="text-purple-700 font-semibold">
                        ₹{item.lineTotal}
                      </span>
                    </p>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-600 text-white px-3 py-1.5 rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}

          </div>

          {/* ✅ REAL FIX — STICKY BOTTOM CHECKOUT */}
          <div className="border-t p-5 bg-white sticky bottom-0">
            <div className="flex justify-between mb-3">
              <span className="text-gray-700">Subtotal</span>
              <span className="text-xl font-extrabold text-purple-700">₹{cart.total}</span>
            </div>

            <div className="grid gap-2">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full border p-2 rounded"
                value={checkoutData.name}
                onChange={(e) =>
                  setCheckoutData({ ...checkoutData, name: e.target.value })
                }
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full border p-2 rounded"
                value={checkoutData.email}
                onChange={(e) =>
                  setCheckoutData({ ...checkoutData, email: e.target.value })
                }
              />

              <button
                onClick={handleCheckout}
                disabled={cart.items.length === 0}
                className="bg-green-600 text-white py-2 rounded-lg w-full"
              >
                Checkout ✅
              </button>
            </div>
          </div>

        </div>
      </aside>

      {/* Receipt Modal */}
      {receipt && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80 text-center">
            <h2 className="text-xl font-bold text-purple-700">
              ✅ Checkout Successful!
            </h2>
            <p className="mt-2">Receipt ID: {receipt.receiptId}</p>
            <p>Total Paid: ₹{receipt.total}</p>
            <p className="text-gray-600 text-sm mt-2">
              {new Date(receipt.timestamp).toLocaleString()}
            </p>
            <button
              onClick={() => setReceipt(null)}
              className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
