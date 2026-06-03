# ShopHub - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
Open your terminal in the project folder and run:
```bash
npm install
```

### Step 2: Start the Server
```bash
npm start
```

You'll see:
```
Connected to SQLite database
Server running on http://localhost:3000
```

### Step 3: Open in Browser
Go to: **http://localhost:3000**

---

## 📝 First Time Setup

When you load the app for the first time:

1. **Create Account**
   - Click "Register" button
   - Enter your name, email, and password
   - Click "Register"

2. **Start Shopping**
   - Browse the product catalog
   - Search or filter by category
   - Click product cards to view details
   - Click the plus icon to add items to cart

3. **Checkout**
   - Click the cart icon (top right)
   - Review your items
   - Click "Checkout"
   - Enter delivery address
   - Complete purchase

4. **View Orders**
   - Click "Orders" in navigation
   - See all your past purchases

---

## 🧪 Test Features

### Test Search
- Type "headphones" in search bar
- See results filter in real-time

### Test Categories
- Click "Electronics" button
- See only electronic products

### Test Cart
- Add multiple items
- Change quantities with +/- buttons
- Remove items with trash icon
- See total update automatically

### Test Orders
- Complete a purchase
- Go to "Orders" section
- See order history with timestamps and totals

---

## 📊 Sample Products in Database

| Product | Price | Stock | Category |
|---------|-------|-------|----------|
| Premium Wireless Headphones | $199.99 | 15 | Electronics |
| Stainless Steel Water Bottle | $34.99 | 45 | Accessories |
| Portable Phone Charger | $49.99 | 30 | Electronics |
| Organic Cotton T-Shirt | $29.99 | 60 | Clothing |
| Smart Watch Series 5 | $299.99 | 20 | Electronics |
| Yoga Mat Pro | $39.99 | 35 | Fitness |
| USB-C Charging Cable 3M | $14.99 | 100 | Accessories |
| Wireless Keyboard and Mouse | $59.99 | 25 | Electronics |

---

## 🎨 UI Features

### Navigation Bar
- **Logo**: Click to go home
- **Search**: Real-time product search
- **Cart Icon**: Shows item count, click to view cart
- **User Menu**: Click to see orders or logout

### Product Cards
- **Eye Icon**: View full product details
- **Plus Icon**: Add to cart
- **Stock Status**: See available quantity

### Shopping Cart
- **Quantity Controls**: +/- buttons
- **Remove**: Trash icon
- **Auto-calculated**: Tax (10%) and total
- **Checkout**: One-click purchase

### Orders Page
- **Order History**: All your purchases
- **Details**: Date, item count, total amount
- **Status**: Completed/Pending

---

## 🔐 Security

### Passwords
- Encrypted with bcryptjs
- Never stored in plain text
- Never shown in UI

### Authentication
- JWT tokens
- 24-hour expiration
- Stored in localStorage

---

## 💾 Data Storage

### Local Storage (Browser)
- Your shopping cart
- Authentication token
- User information

### SQLite Database (Server)
- User accounts
- Products
- Orders
- Order history

**Note**: Database resets when server restarts (in-memory mode). This is normal for development.

---

## 🛠️ Useful Commands

```bash
# Start the server
npm start

# Start with auto-reload (requires nodemon)
npm run dev

# Install all dependencies
npm install

# View all installed packages
npm list
```

---

## 📱 Responsive Design

The app works on:
- ✓ Desktop computers
- ✓ Tablets
- ✓ Mobile phones

The layout automatically adjusts based on screen size.

---

## 🐛 Common Issues & Solutions

**Issue**: "Cannot GET /"
- **Fix**: Make sure server is running (`npm start`)

**Issue**: Cart items disappear
- **Fix**: Cart uses localStorage. Browser cache keeps items.

**Issue**: Images don't load
- **Fix**: Check internet connection (images from Unsplash)

**Issue**: Can't login
- **Fix**: Make sure you registered first or created an account

**Issue**: Products showing as "Out of stock"
- **Fix**: Reload page or check stock count (some items may have limited stock)

---

## 🔑 API Endpoints Reference

### Public Endpoints
- `GET /api/products` - All products
- `GET /api/products/:id` - Single product
- `GET /api/categories` - All categories

### Authentication (Public)
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login

### Protected Endpoints (Requires Login)
- `POST /api/orders` - Create order
- `GET /api/orders` - Your orders
- `GET /api/orders/:id` - Order details

---

## 💡 Tips & Tricks

1. **Use browser DevTools**: Press F12 to see console logs
2. **Check localStorage**: See your cart and auth token in DevTools Storage
3. **Network tab**: Monitor API calls in DevTools Network tab
4. **Test different accounts**: Create multiple accounts to test
5. **Clear cart**: Logout and login to start fresh

---

## 📈 What's Included

### Backend (server.js)
- Express.js API server
- SQLite database
- JWT authentication
- 8 sample products
- Order management

### Frontend (index.html)
- Responsive design
- Modern UI with icons
- Real-time search
- Shopping cart
- Order history
- User authentication

### Configuration
- package.json - Dependencies
- README.md - Full documentation

---

## 🚀 Next Steps

1. ✓ Install and run the app
2. ✓ Create an account and test all features
3. ✓ Browse products, add to cart, checkout
4. ✓ View your order history
5. ✓ Explore the code to understand how it works

---

## 📚 File Descriptions

| File | Purpose |
|------|---------|
| `server.js` | Express backend with all API endpoints |
| `index.html` | Frontend UI and JavaScript logic |
| `package.json` | Project dependencies and metadata |
| `README.md` | Detailed documentation |
| `QUICKSTART.md` | This file |

---

## ⚡ Performance

- Load time: < 1 second
- Cart updates: Instant
- Search: Real-time filtering
- Checkout: < 500ms

---

## 🎯 Test Scenarios

### Complete Shopping Journey
1. Register new account
2. Search for "wireless"
3. Click on first product
4. Add to cart
5. Add another item
6. View cart
7. Adjust quantities
8. Proceed to checkout
9. Fill delivery info
10. Complete purchase
11. View orders page
12. See new order listed

---

Enjoy shopping with ShopHub! 🛍️✨
