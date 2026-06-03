const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database initialization
const db = new sqlite3.Database(':memory:', (err) => {
  if (err) console.error('Database error:', err);
  else console.log('Connected to SQLite database');
  initializeDatabase();
});

// Initialize database tables
function initializeDatabase() {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Products table
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category TEXT,
      image_url TEXT,
      stock INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, () => {
    // Seed sample products
    seedProducts();
  });

  // Orders table
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      total_amount REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  // Order items table
  db.run(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY(order_id) REFERENCES orders(id),
      FOREIGN KEY(product_id) REFERENCES products(id)
    )
  `);
}

// Seed sample products
function seedProducts() {
  const products = [
    {
      name: 'Premium Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life',
      price: 199.99,
      category: 'Electronics',
      image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
      stock: 15
    },
    {
      name: 'Stainless Steel Water Bottle',
      description: 'Eco-friendly water bottle keeps drinks cold for 24 hours or hot for 12 hours',
      price: 34.99,
      category: 'Accessories',
      image_url: 'https://images.unsplash.com/photo-1602143407151-7e4dc670acfd?w=500&h=500&fit=crop',
      stock: 45
    },
    {
      name: 'Portable Phone Charger',
      description: 'Fast charging power bank with 20000mAh capacity and dual USB outputs',
      price: 49.99,
      category: 'Electronics',
      image_url: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop',
      stock: 30
    },
    {
      name: 'Organic Cotton T-Shirt',
      description: 'Comfortable and sustainable 100% organic cotton t-shirt available in multiple colors',
      price: 29.99,
      category: 'Clothing',
      image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
      stock: 60
    },
    {
      name: 'Smart Watch Series 5',
      description: 'Advanced fitness tracking, heart rate monitoring, and smartphone notifications',
      price: 299.99,
      category: 'Electronics',
      image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
      stock: 20
    },
    {
      name: 'Yoga Mat Pro',
      description: 'Non-slip yoga mat with carrying strap, 6mm thickness for comfort and stability',
      price: 39.99,
      category: 'Fitness',
      image_url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop',
      stock: 35
    },
    {
      name: 'USB-C Charging Cable 3M',
      description: 'Durable braided charging cable with fast charging capability',
      price: 14.99,
      category: 'Accessories',
      image_url: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&h=500&fit=crop',
      stock: 100
    },
    {
      name: 'Wireless Keyboard and Mouse',
      description: 'Compact ergonomic keyboard and mouse combo with 2.4GHz wireless connection',
      price: 59.99,
      category: 'Electronics',
      image_url: 'https://images.unsplash.com/photo-1559163499-641b25f18dc3?w=500&h=500&fit=crop',
      stock: 25
    }
  ];

  products.forEach(product => {
    db.get('SELECT id FROM products WHERE name = ?', [product.name], (err, row) => {
      if (!row) {
        db.run(
          'INSERT INTO products (name, description, price, category, image_url, stock) VALUES (?, ?, ?, ?, ?, ?)',
          [product.name, product.description, product.price, product.category, product.image_url, product.stock]
        );
      }
    });
  });
}

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token required' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// ============ AUTHENTICATION ROUTES ============

// Register
app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
    [email, hashedPassword, name],
    function(err) {
      if (err) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const token = jwt.sign({ id: this.lastID, email }, SECRET_KEY, { expiresIn: '24h' });
      res.json({ 
        message: 'User registered successfully',
        token,
        user: { id: this.lastID, email, name }
      });
    }
  );
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '24h' });
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  });
});

// ============ PRODUCT ROUTES ============

// Get all products
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Product not found' });
    res.json(row);
  });
});

// Get products by category
app.get('/api/products/category/:category', (req, res) => {
  const { category } = req.params;

  db.all('SELECT * FROM products WHERE category = ?', [category], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ============ CART ROUTES (handled on frontend with localStorage) ============

// ============ ORDER ROUTES ============

// Create order
app.post('/api/orders', authenticateToken, (req, res) => {
  const { items } = req.body;
  const userId = req.user.id;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  let totalAmount = 0;
  let processedItems = 0;

  // Calculate total and verify stock
  items.forEach(item => {
    db.get('SELECT * FROM products WHERE id = ?', [item.productId], (err, product) => {
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product?.name || 'product'}` });
      }
      totalAmount += product.price * item.quantity;
      processedItems++;

      if (processedItems === items.length) {
        // Create order
        db.run(
          'INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)',
          [userId, totalAmount, 'completed'],
          function(err) {
            if (err) return res.status(500).json({ error: err.message });

            const orderId = this.lastID;
            let itemsAdded = 0;

            // Add order items and update stock
            items.forEach(item => {
              db.run(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.productId, item.quantity, item.price],
                (err) => {
                  if (err) return res.status(500).json({ error: err.message });

                  // Update product stock
                  db.run(
                    'UPDATE products SET stock = stock - ? WHERE id = ?',
                    [item.quantity, item.productId]
                  );

                  itemsAdded++;
                  if (itemsAdded === items.length) {
                    res.status(201).json({
                      message: 'Order created successfully',
                      orderId,
                      totalAmount
                    });
                  }
                }
              );
            });
          }
        );
      }
    });
  });
});

// Get user orders
app.get('/api/orders', authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.all(
    `SELECT o.*, COUNT(oi.id) as item_count 
     FROM orders o 
     LEFT JOIN order_items oi ON o.id = oi.order_id 
     WHERE o.user_id = ? 
     GROUP BY o.id 
     ORDER BY o.created_at DESC`,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Get order details
app.get('/api/orders/:orderId', authenticateToken, (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.id;

  db.get('SELECT * FROM orders WHERE id = ? AND user_id = ?', [orderId, userId], (err, order) => {
    if (!order) return res.status(404).json({ error: 'Order not found' });

    db.all(
      `SELECT oi.*, p.name, p.image_url 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [orderId],
      (err, items) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ ...order, items });
      }
    );
  });
});

// Get product categories
app.get('/api/categories', (req, res) => {
  db.all('SELECT DISTINCT category FROM products WHERE category IS NOT NULL', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const categories = rows.map(row => row.category);
    res.json(categories);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
