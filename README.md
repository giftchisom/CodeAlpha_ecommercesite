# ShopHub E-Commerce Platform

A fully functional e-commerce platform built with Express.js backend and vanilla JavaScript frontend featuring user authentication, product catalog, shopping cart, and order processing.

## Features

### Core Features
- ✓ User Authentication (Registration & Login)
- ✓ Product Catalog with 8 pre-loaded products
- ✓ Product Search and Category Filtering
- ✓ Shopping Cart with persistent storage
- ✓ Product Details Modal
- ✓ Order Processing and Checkout
- ✓ Order History
- ✓ Responsive Design

### Technical Features
- ✓ SQLite Database (in-memory)
- ✓ JWT Token Authentication
- ✓ Password Encryption with bcryptjs
- ✓ RESTful API Endpoints
- ✓ CORS enabled
- ✓ Clean, Modern UI with Icons
- ✓ Real-time Cart Updates
- ✓ Stock Management

---

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Step 1: Install Dependencies
```bash
npm install
```

This will install:
- **express** - Web framework
- **sqlite3** - Database
- **bcryptjs** - Password encryption
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-Origin Resource Sharing

### Step 2: Start the Server
```bash
npm start
```

The server will run on `http://localhost:3000`

You should see:
```
Connected to SQLite database
Server running on http://localhost:3000
```

### Step 3: Open in Browser
Navigate to `http://localhost:3000` in your web browser

---

## Usage Guide

### Initial Access
1. When you first load the site, you'll see the login modal
2. Click "Register" to create a new account
3. Enter your name, email, and password
4. After registering/logging in, you'll access the store

### Shopping
1. **Browse Products**: View all products on the home page
2. **Search**: Use the search bar to find specific products
3. **Filter by Category**: Click category buttons to filter products
4. **View Details**: Click the eye icon on any product to see full details
5. **Add to Cart**: Click the plus icon or "Add to Cart" button

### Cart Management
1. Click the shopping cart icon in the header to view your cart
2. Use +/- buttons to adjust quantities
3. Click the trash icon to remove items
4. View subtotal, tax, and total price
5. Click "Checkout" to proceed

### Checkout
1. Enter your delivery information
2. Review order summary
3. Click "Complete Purchase"
4. Order will be processed and added to your order history

### Orders
1. Click "Orders" in the navigation menu
2. View all your past orders with dates and amounts
3. Track order status (Completed/Pending)

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/products/category/:category` - Get products by category
- `GET /api/categories` - Get all categories

### Orders
- `POST /api/orders` - Create new order (requires auth)
- `GET /api/orders` - Get user's orders (requires auth)
- `GET /api/orders/:orderId` - Get order details (requires auth)

---

## Sample Test Credentials

Use these to test the application without creating an account:

**Note**: The database resets each time the server restarts. Create fresh accounts for testing.

---

## Pre-loaded Products

The database comes with 8 sample products:

1. **Premium Wireless Headphones** - $199.99
   - Category: Electronics
   - Stock: 15 units

2. **Stainless Steel Water Bottle** - $34.99
   - Category: Accessories
   - Stock: 45 units

3. **Portable Phone Charger** - $49.99
   - Category: Electronics
   - Stock: 30 units

4. **Organic Cotton T-Shirt** - $29.99
   - Category: Clothing
   - Stock: 60 units

5. **Smart Watch Series 5** - $299.99
   - Category: Electronics
   - Stock: 20 units

6. **Yoga Mat Pro** - $39.99
   - Category: Fitness
   - Stock: 35 units

7. **USB-C Charging Cable 3M** - $14.99
   - Category: Accessories
   - Stock: 100 units

8. **Wireless Keyboard and Mouse** - $59.99
   - Category: Electronics
   - Stock: 25 units

---

## Database Schema

### Users Table
```sql
- id (PRIMARY KEY)
- email (UNIQUE)
- password (hashed)
- name
- created_at
```

### Products Table
```sql
- id (PRIMARY KEY)
- name
- description
- price
- category
- image_url
- stock
- created_at
```

### Orders Table
```sql
- id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- total_amount
- status
- created_at
```

### Order Items Table
```sql
- id (PRIMARY KEY)
- order_id (FOREIGN KEY)
- product_id (FOREIGN KEY)
- quantity
- price
```

---

## Project Structure

```
shophub/
├── server.js           # Express backend server
├── index.html          # Frontend (HTML, CSS, JS)
├── package.json        # Dependencies
└── README.md          # This file
```

---

## Features Breakdown

### 1. Shopping Cart
- Uses browser localStorage for persistence
- Updates in real-time
- Shows item count in header
- Automatic tax calculation (10%)

### 2. Product Details Modal
- High-resolution product images
- Full description
- Stock information
- Add to cart functionality

### 3. Order Processing
- Validates stock availability
- Reduces product inventory after order
- Stores complete order history
- Displays order summary

### 4. Authentication
- JWT token-based authentication
- Password hashing with bcryptjs
- Token stored in localStorage
- 24-hour token expiration

### 5. Responsive Design
- Mobile-friendly layout
- Collapsible navigation
- Touch-optimized buttons
- Flexible grid layouts

---

## Security Notes

### Current Implementation
- Passwords are hashed using bcryptjs
- JWT tokens secure API endpoints
- CORS enabled for cross-origin requests
- Token expiration: 24 hours

### Production Recommendations
1. Change `SECRET_KEY` in server.js to a strong, unique value
2. Use a persistent database (PostgreSQL, MySQL) instead of in-memory SQLite
3. Add environment variables for sensitive data
4. Implement HTTPS/SSL
5. Add rate limiting
6. Implement refresh tokens
7. Add input validation and sanitization
8. Use secure headers (helmet.js)

---

## Troubleshooting

### Issue: "Cannot GET /" 
**Solution**: Make sure server is running on port 3000

### Issue: Database Errors
**Solution**: The in-memory database resets on server restart. This is normal for development.

### Issue: CORS Errors
**Solution**: Ensure both frontend and backend are running. Check API_URL in index.html

### Issue: Images not loading
**Solution**: This is normal - images are fetched from Unsplash. Check internet connection.

### Issue: "Token required" Error
**Solution**: Make sure you're logged in. Clear localStorage and refresh if needed.

---

## Development Tips

### To add more products:
Edit the `seedProducts()` function in server.js with additional product objects.

### To modify prices or inventory:
Update the product data in the `seedProducts()` function.

### To change styling:
Edit the CSS variables in the `<style>` section of index.html:
```css
:root {
    --primary: #2563eb;      /* Main color */
    --accent: #f59e0b;       /* Accent color */
    --danger: #ef4444;       /* Error color */
    /* ... more variables */
}
```

### To add new categories:
They're automatically generated from products in the database.

---

## Performance Notes

- In-memory SQLite is fast for development but not suitable for production
- Cart is stored in localStorage (max ~5MB)
- No pagination implemented (suitable for catalogs < 1000 products)
- Consider adding pagination for larger product catalogs

---

## License

MIT License - Feel free to use this project for personal and commercial purposes.

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the API endpoints documentation
3. Check browser console for JavaScript errors
4. Check server console for backend errors

---

## Future Enhancement Ideas

- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Product variants (sizes, colors)
- [ ] Discount codes/coupons
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Advanced search filters
- [ ] Product recommendations
- [ ] Order tracking
- [ ] Returns/refunds system
- [ ] Multi-language support

---

Happy Shopping! 🛍️
