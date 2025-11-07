🛍️ VibeCart — Full Stack Mock E-Commerce Cart

A simple and clean full-stack shopping cart built as a part of the Vibe Commerce Internship Assignment.
Features product listing, cart management, checkout, MongoDB integration, and a modern UI with React + TailwindCSS.

✅ Tech Stack
Frontend

React (Vite)

TailwindCSS

Responsive UI

Slide-in Cart Drawer (like Amazon/Myntra)

Toast notifications

Checkout modal

Backend

Node.js

Express.js

MongoDB + Mongoose

REST APIs

Auto-seeding products

✅ Features Implemented
🔹 Products

✔ Fetch products from MongoDB
✔ Display grid with images, prices, add-to-cart button
✔ Fixed image sizes for consistency

🔹 Cart

✔ Add to cart
✔ Remove item
✔ Increase/Decrease quantity
✔ View total price
✔ Cart stored in MongoDB
✔ Small product preview in the cart

🔹 Checkout

✔ Name + Email form
✔ Generates receipt with:

receipt ID

total

timestamp
✔ Clears cart after checkout
✔ Modal confirmation

🔹 UI/UX

✔ Modern animated slide-in cart drawer
✔ Toast notification on adding items
✔ Responsive design
✔ Smooth transitions
✔ Fixed checkout section
✔ Product card hover effects

✅ API Endpoints
GET /api/products

Fetch list of products.

POST /api/cart

Add or update cart item.
Body:

{ "productId": "...", "qty": 1 }

GET /api/cart

Returns cart items + total.

DELETE /api/cart/:id

Delete an item from the cart.

POST /api/checkout

Process mock checkout.
Body:

{
  "name": "Abu",
  "email": "abu@example.com",
  "cartItems": [...]
}

✅ How to Run Locally
Backend
cd backend
npm install
node server.js


Runs on:
👉 http://localhost:4000

Frontend
cd frontend
npm install
npm run dev


Runs on:
👉 http://localhost:5173

✅ Folder Structure
vibe-cart/
│
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── product.model.js
│   ├── cart.model.js
│   └── node_modules/
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── index.css
│   ├── package.json
│   └── node_modules/
│
└── README.md

<img width="1898" height="906" alt="image" src="https://github.com/user-attachments/assets/9987c25c-b1c9-494f-80b0-7675c07f4f7f" />

<img width="525" height="908" alt="image" src="https://github.com/user-attachments/assets/eb050ffe-2dc3-4bb2-9e07-457b77a9b05f" />

<img width="394" height="258" alt="image" src="https://github.com/user-attachments/assets/130a5ff1-811b-4e19-9e6f-072710e18ab7" />


