# ShopHub Architecture & Implementation Guide

## 📋 System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  HTML/CSS/JavaScript (index.html)                    │   │
│  │  ├── User Interface                                  │   │
│  │  ├── Shopping Cart (localStorage)                    │   │
│  │  ├── Product Search & Filter                         │   │
│  │  └── Authentication State Management                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
                       HTTP/REST API
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   SERVER (Node.js/Express)                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Express.js (server.js)                              │   │
│  │  ├── Route Handlers                                  │   │
│  │  ├── JWT Authentication Middleware                   │   │
│  │  ├── Business Logic                                  │   │
│  │  └── Error Handling                                  │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  SQLite Database (In-Memory)                         │   │
│  │  ├── Users Table                                     │   │
│  │  ├── Products Table                                  │   │
│  │  ├── Orders Table                                    │   │
│  │  └── Order Items Table                               │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Design

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose**: Store user accounts and credentials

**Fields**:
- `id` - Unique user identifier
- `email` - Login email (unique)
- `password` - Hashed password (bcryptjs)
- `name` - User's full name
- `created_at` - Account creation timestamp

---

### Products Table
```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  category TEXT,
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose**: Store product catalog

**Fields**:
- `id` - Product identifier
- `name` - Product name
- `description` - Detailed description
- `price` - Product price in dollars
- `category` - Product category for filtering
- `image_url` - URL to product image
- `stock` - Available quantity
- `created_at` - Product creation date

---

### Orders Table
```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  total_amount REAL NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);
```

**Purpose**: Store customer orders

**Fields**:
- `id` - Order identifier
- `user_id` - Reference to user who placed order
- `total_amount` - Total order amount (including tax)
- `status` - Order status (pending/completed/cancelled)
- `created_at` - Order timestamp

---

### Order Items Table
```sql
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  price REAL NOT NULL,
  FOREIGN KEY(order_id) REFERENCES orders(id),
  FOREIGN KEY(product_id) REFERENCES products(id)
);
```

**Purpose**: Store individual items in each order

**Fields**:
- `id` - Item identifier
- `order_id` - Reference to order
- `product_id` - Reference to product
- `quantity` - Number of units
- `price` - Price at time of purchase

---

## 🔌 API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (201):
{
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (200):
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

---

### Product Endpoints

#### Get All Products
```http
GET /api/products

Response (200):
[
  {
    "id": 1,
    "name": "Premium Wireless Headphones",
    "description": "High-quality wireless headphones...",
    "price": 199.99,
    "category": "Electronics",
    "image_url": "https://...",
    "stock": 15
  },
  ...
]
```

#### Get Single Product
```http
GET /api/products/1

Response (200):
{
  "id": 1,
  "name": "Premium Wireless Headphones",
  "description": "High-quality wireless headphones...",
  "price": 199.99,
  "category": "Electronics",
  "image_url": "https://...",
  "stock": 15
}
```

#### Get Products by Category
```http
GET /api/products/category/Electronics

Response (200):
[
  { product data },
  ...
]
```

#### Get All Categories
```http
GET /api/categories

Response (200):
["Electronics", "Accessories", "Clothing", "Fitness"]
```

---

### Order Endpoints

#### Create Order
```http
POST /api/orders
Content-Type: application/json
Authorization: Bearer {token}

{
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 199.99
    },
    {
      "productId": 3,
      "quantity": 1,
      "price": 49.99
    }
  ]
}

Response (201):
{
  "message": "Order created successfully",
  "orderId": 1,
  "totalAmount": 449.97
}
```

#### Get User's Orders
```http
GET /api/orders
Authorization: Bearer {token}

Response (200):
[
  {
    "id": 1,
    "user_id": 1,
    "total_amount": 449.97,
    "status": "completed",
    "item_count": 2,
    "created_at": "2024-01-15T10:30:00.000Z"
  },
  ...
]
```

#### Get Order Details
```http
GET /api/orders/1
Authorization: Bearer {token}

Response (200):
{
  "id": 1,
  "user_id": 1,
  "total_amount": 449.97,
  "status": "completed",
  "created_at": "2024-01-15T10:30:00.000Z",
  "items": [
    {
      "id": 1,
      "order_id": 1,
      "product_id": 1,
      "quantity": 2,
      "price": 199.99,
      "name": "Premium Wireless Headphones",
      "image_url": "https://..."
    },
    ...
  ]
}
```

---

## 🔐 Authentication Flow

### JWT Token Structure
```
Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "id": 1,
  "email": "user@example.com",
  "iat": 1642000000,
  "exp": 1642086400  // 24 hours
}

Signature: HMACSHA256(header.payload, SECRET_KEY)
```

### Authentication Middleware
```javascript
const authenticateToken = (req, res, next) => {
  // Extract token from Authorization header
  const token = req.headers['authorization'].split(' ')[1];
  
  // Verify token using SECRET_KEY
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;  // Attach user info to request
    next();
  });
};
```

### Secure Endpoints
All endpoints with this middleware require:
```http
Authorization: Bearer {jwt_token}
```

---

## 💻 Frontend Architecture

### State Management
```javascript
// Global state variables
let currentUser = null;        // Current logged-in user
let allProducts = [];          // All products from database
let cart = [];                 // Shopping cart items
let filteredProducts = [];     // Current filtered products
```

### Local Storage Keys
```javascript
localStorage.getItem('token');     // JWT authentication token
localStorage.getItem('user');      // User object JSON
localStorage.getItem('cart');      // Cart items JSON
```

### Component Structure

```
index.html
├── Header (Navigation)
│   ├── Logo
│   ├── Navigation Links
│   ├── Search Bar
│   ├── Cart Icon
│   └── User Menu
├── Main Content
│   ├── Home Section
│   │   ├── Hero Banner
│   │   ├── Filter Section
│   │   │   ├── Search Input
│   │   │   └── Category Buttons
│   │   └── Products Grid
│   └── Orders Section
│       └── Order List
├── Cart Sidebar
│   ├── Cart Header
│   ├── Cart Items
│   │   └── Cart Item Cards
│   └── Cart Footer
│       ├── Summary
│       └── Checkout Button
└── Modals
    ├── Login Modal
    ├── Register Modal
    ├── Product Details Modal
    └── Checkout Modal
```

### Key Functions

#### Authentication Functions
```javascript
checkAuth()           // Check if user is logged in
register(event)       // Create new account
login(event)          // Login with credentials
logout()              // Logout and clear data
updateAuthUI()        // Update UI based on auth state
```

#### Product Functions
```javascript
loadProducts()        // Fetch all products from API
loadCategories()      // Fetch available categories
filterByCategory()    // Filter products by category
filterProducts()      // Search/filter products
viewProduct(id)       // Show product details modal
renderProducts()      // Render product grid
```

#### Cart Functions
```javascript
addToCart(...)        // Add item to cart
removeFromCart(id)    // Remove item from cart
updateQuantity(...)   // Change item quantity
updateCartUI()        // Update cart display
toggleCart()          // Show/hide cart sidebar
checkout()            // Start checkout process
processCheckout()     // Process order
```

#### UI Functions
```javascript
showModal(id)         // Open modal
closeModal(id)        // Close modal
switchModal(...)      // Switch between modals
showAlert(...)        // Show alert message
toggleUserMenu()      // Toggle user dropdown
showOrders()          // Display orders page
showHome()            // Display home page
```

---

## 🔄 Request/Response Flow

### User Registration Flow
```
User Input (Form)
    ↓
JavaScript: register(event)
    ↓
API: POST /api/auth/register
    ↓
Backend: Hash password, Create user
    ↓
Generate JWT token
    ↓
Response: { token, user }
    ↓
Frontend: Store in localStorage
    ↓
Update UI & Close Modal
    ↓
Success Alert
```

### Product Purchase Flow
```
User Adds Item
    ↓
addToCart() updates JavaScript array
    ↓
Save to localStorage
    ↓
Update cart count badge
    ↓
User Clicks Checkout
    ↓
Open checkout modal
    ↓
User Fills Address
    ↓
processCheckout() sends POST /api/orders
    ↓
Backend validates stock
    ↓
Creates order in database
    ↓
Updates product stock
    ↓
Response: { orderId, totalAmount }
    ↓
Clear cart from localStorage
    ↓
Close modals & Show success
    ↓
User can view in Orders
```

---

## 🛡️ Security Implementation

### Password Security
```javascript
// Registration - Hash password
const hashedPassword = bcrypt.hashSync(password, 10);

// Login - Compare passwords
const isMatch = bcrypt.compareSync(password, user.password);
```

**Bcryptjs Details**:
- Cost factor: 10 rounds of hashing
- One-way encryption
- Salting included
- No way to decrypt

### Token Security
```javascript
// Create token
const token = jwt.sign(
  { id: user.id, email: user.email },
  SECRET_KEY,
  { expiresIn: '24h' }
);

// Verify token
jwt.verify(token, SECRET_KEY, (err, user) => {
  if (err) throw new Error('Invalid token');
});
```

### Protected Routes
```javascript
// Only authenticated users can:
app.post('/api/orders', authenticateToken, (req, res) => {
  // Create order
});

app.get('/api/orders', authenticateToken, (req, res) => {
  // Get user's orders
});
```

---

## 📊 Data Relationships

```
Users (1) ──┐
            │
            │ (Many)
            ├──→ Orders
            │
Orders (1) ──┐
             │
             │ (Many)
             └──→ Order Items
                      ↓
                   (References)
                      ↓
                  Products (1)
```

**One-to-Many Relationships**:
- One User can have Many Orders
- One Order can have Many Order Items
- One Product can be in Many Order Items

---

## 🔄 State Updates

### Cart State Flow
```
addToCart() 
  ↓
Update cart array in memory
  ↓
Save to localStorage
  ↓
updateCartUI()
  ↓
Calculate subtotal & tax
  ↓
Update cart count badge
  ↓
Update cart sidebar display
```

### Product State Flow
```
loadProducts()
  ↓
Fetch from API
  ↓
Store in allProducts array
  ↓
Set filteredProducts = allProducts
  ↓
renderProducts()
  ↓
Create product cards
  ↓
Display in grid
```

---

## ⚡ Performance Considerations

### Frontend Optimization
- Product cards use CSS animations
- Search filters in-memory (no API calls)
- LocalStorage for instant cart access
- Minimal DOM manipulation

### Backend Optimization
- Direct SQLite queries
- No ORM overhead
- Efficient joins in complex queries
- Token-based auth (stateless)

### Network Optimization
- Minimal API calls
- Batch order item processing
- Compressed JSON responses
- CORS for cross-origin requests

---

## 🐛 Error Handling

### Frontend Error Handling
```javascript
try {
  const response = await fetch(API_URL);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  // Process data
} catch (error) {
  showAlert(error.message, 'error');
}
```

### Backend Error Handling
```javascript
app.post('/api/orders', authenticateToken, (req, res) => {
  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }
  // Process order
});
```

### Common Error Scenarios
- Missing required fields → 400 Bad Request
- Invalid credentials → 401 Unauthorized
- Token expired → 403 Forbidden
- Resource not found → 404 Not Found
- Server error → 500 Internal Server Error

---

## 🚀 Scaling Considerations

### Current Limitations
- In-memory database resets on server restart
- No pagination on products
- No caching layer
- Single server instance

### Production Improvements
1. Use PostgreSQL or MySQL
2. Add Redis for caching
3. Implement pagination
4. Load balancing with multiple servers
5. CDN for static files/images
6. Database connection pooling
7. Rate limiting
8. Request logging
9. Monitoring and alerts
10. Backup and recovery

---

## 📚 Code Quality

### Naming Conventions
- Functions: camelCase (addToCart, fetchProducts)
- Variables: camelCase (currentUser, cart)
- Constants: UPPER_CASE (API_URL, SECRET_KEY)
- Classes: PascalCase (if used)

### Code Organization
- Separation of concerns (frontend/backend)
- Modular functions with single responsibility
- Clear comments for complex logic
- Consistent error handling

### Best Practices
- No hardcoded values
- Environment-ready configuration
- Input validation
- Secure password handling
- Token expiration

---

This architecture provides a solid foundation for a modern e-commerce platform with room for growth and scaling.
