require('dotenv').config({ path: '.env.local' });
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'maytinh',
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'API server is running', timestamp: new Date() });
});

// Auto-initialize extra tables if not existing
async function initTables() {
  try {
    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS wishlist (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        productId VARCHAR(50) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_wishlist (userId, productId)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        productId VARCHAR(50) NOT NULL,
        userId INT,
        userName VARCHAR(100) NOT NULL,
        userAvatar LONGTEXT,
        rating DECIMAL(2,1) NOT NULL DEFAULT 5.0,
        comment TEXT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS vouchers (
        code VARCHAR(50) PRIMARY KEY,
        discount BIGINT NOT NULL,
        minOrder BIGINT DEFAULT 0,
        label VARCHAR(255) NOT NULL,
        expiryDate VARCHAR(50)
      )
    `);

    // Ensure products table has isHidden column
    try {
      await connection.query(`ALTER TABLE products ADD COLUMN isHidden BOOLEAN DEFAULT FALSE`);
      console.log('✅ Added isHidden column to products table');
    } catch (err) {
      if (err.code !== 'ER_DUP_FIELDNAME') {
        console.warn('⚠️ Could not add isHidden column:', err.message);
      }
    }

    // Seed default vouchers
    await connection.query(`
      INSERT INTO vouchers (code, discount, minOrder, label, expiryDate) VALUES
      ('DPC50K', 50000, 2000000, 'Giảm 50.000₫ đơn từ 2tr', '2026-12-31'),
      ('FREESHIP', 30000, 0, 'Miễn phí giao hàng toàn quốc', '2026-12-31'),
      ('VIP200K', 200000, 20000000, 'Giảm 200.000₫ đơn từ 20tr', '2026-12-31')
      ON DUPLICATE KEY UPDATE discount=VALUES(discount), minOrder=VALUES(minOrder), label=VALUES(label)
    `);

    connection.release();
    console.log('✅ Database tables initialized (wishlist, reviews, vouchers)');
  } catch (err) {
    console.warn('⚠️  Could not auto-initialize tables (MySQL may not be connected yet):', err.message);
  }
}
initTables();


// ==================== CATEGORIES ====================
app.get('/categories', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM categories');
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/categories/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM categories WHERE id = ?', [req.params.id]);
    connection.release();
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/categories', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const { id, name, count = 0, icon = '💻' } = req.body;
    await connection.query(
      'INSERT INTO categories (id, name, count, icon) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), count = VALUES(count), icon = VALUES(icon)',
      [id, name, count, icon]
    );
    connection.release();
    res.status(201).json({ message: 'Category saved successfully', category: { id, name, count, icon } });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/categories/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const { name, count, icon } = req.body;
    const [result] = await connection.query(
      'UPDATE categories SET name = COALESCE(?, name), count = COALESCE(?, count), icon = COALESCE(?, icon) WHERE id = ?',
      [name ?? null, count ?? null, icon ?? null, req.params.id]
    );
    connection.release();
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category updated successfully' });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/categories/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
    connection.release();
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== PRODUCTS ====================
app.get('/products', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const { category, featured, new: isNew, sale, hot, q, minPrice, maxPrice, sortBy, limit = 500, offset = 0, admin } = req.query;
    
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (admin !== 'true') {
      query += ' AND (isHidden IS NULL OR isHidden = FALSE)';
    }

    if (category) {
      query += ' AND (category_id = ? OR category_id LIKE ?)';
      params.push(category, `%${category}%`);
    }
    if (featured === 'true') {
      query += ' AND isFeatured = true';
    }
    if (isNew === 'true') {
      query += ' AND isNew = true';
    }
    if (sale === 'true') {
      query += ' AND (isSale = true OR discount > 0)';
    }
    if (hot === 'true') {
      query += ' AND isHot = true';
    }
    if (q) {
      query += ' AND (name LIKE ? OR description LIKE ? OR category_id LIKE ?)';
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }
    if (minPrice) {
      query += ' AND price >= ?';
      params.push(parseInt(minPrice));
    }
    if (maxPrice) {
      query += ' AND price <= ?';
      params.push(parseInt(maxPrice));
    }

    if (sortBy === 'low') {
      query += ' ORDER BY price ASC';
    } else if (sortBy === 'high') {
      query += ' ORDER BY price DESC';
    } else if (sortBy === 'rating') {
      query += ' ORDER BY rating DESC';
    } else if (sortBy === 'newest') {
      query += ' ORDER BY isNew DESC, createdAt DESC';
    }

    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await connection.query(query, params);
    connection.release();

    // Parse JSON fields
    const products = rows.map(product => ({
      ...product,
      specifications: product.specifications ? (typeof product.specifications === 'string' ? JSON.parse(product.specifications) : product.specifications) : {},
      features: product.features ? (typeof product.features === 'string' ? JSON.parse(product.features) : product.features) : [],
    }));

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    connection.release();
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = {
      ...rows[0],
      specifications: rows[0].specifications ? JSON.parse(rows[0].specifications) : {},
      features: rows[0].features ? JSON.parse(rows[0].features) : [],
    };

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/products', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const p = req.body;
    
    await connection.query(`
      INSERT INTO products (
        id, name, category_id, price, oldPrice, discount, rating, reviewCount, stock,
        isFeatured, isNew, isSale, isHot, isHidden, image, description, specifications, features
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      p.id, p.name, p.category_id, p.price, p.oldPrice || null, p.discount || 0,
      p.rating || 5.0, p.reviewCount || 0, p.stock || 0,
      p.isFeatured || false, p.isNew || false, p.isSale || false, p.isHot || false, p.isHidden || false,
      p.image || '', p.description || '',
      JSON.stringify(p.specifications || {}), JSON.stringify(p.features || [])
    ]);

    connection.release();
    res.status(201).json({ message: 'Product created successfully' });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/products/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const {
      name,
      category_id,
      price,
      oldPrice,
      discount,
      rating,
      stock,
      image,
      description,
      specifications,
      features,
      isFeatured,
      isNew,
      isSale,
      isHot,
      isHidden,
    } = req.body;

    const query = `
      UPDATE products SET
        name = COALESCE(?, name),
        category_id = COALESCE(?, category_id),
        price = COALESCE(?, price),
        oldPrice = COALESCE(?, oldPrice),
        discount = COALESCE(?, discount),
        rating = COALESCE(?, rating),
        stock = COALESCE(?, stock),
        image = COALESCE(?, image),
        description = COALESCE(?, description),
        specifications = COALESCE(?, specifications),
        features = COALESCE(?, features),
        isFeatured = COALESCE(?, isFeatured),
        isNew = COALESCE(?, isNew),
        isSale = COALESCE(?, isSale),
        isHot = COALESCE(?, isHot),
        isHidden = COALESCE(?, isHidden)
      WHERE id = ?
    `;

    const [result] = await connection.query(query, [
      name ?? null,
      category_id ?? null,
      price !== undefined ? price : null,
      oldPrice !== undefined ? oldPrice : null,
      discount !== undefined ? discount : null,
      rating !== undefined ? rating : null,
      stock !== undefined ? stock : null,
      image ?? null,
      description ?? null,
      specifications ? JSON.stringify(specifications) : null,
      features ? JSON.stringify(features) : null,
      isFeatured !== undefined ? isFeatured : null,
      isNew !== undefined ? isNew : null,
      isSale !== undefined ? isSale : null,
      isHot !== undefined ? isHot : null,
      isHidden !== undefined ? isHidden : null,
      req.params.id,
    ]);

    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/products/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== USERS ====================
app.post('/users/register', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const { email, password, name, phone, role } = req.body;
    const userRole = (role === 'admin' || email === 'admin@promart.vn') ? 'admin' : 'customer';

    const query = `INSERT INTO users (email, password, name, phone, role) VALUES (?, ?, ?, ?, ?)`;
    await connection.query(query, [email, password, name, phone, userRole]);

    connection.release();
    res.status(201).json({ message: 'User registered successfully', role: userRole });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/users/login', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const { email, password } = req.body;

    const [rows] = await connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
    connection.release();

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const { name, phone, address, city, avatar } = req.body;

    const query = `
      UPDATE users SET
        name = COALESCE(?, name),
        phone = COALESCE(?, phone),
        address = COALESCE(?, address),
        city = COALESCE(?, city),
        avatar = COALESCE(?, avatar)
      WHERE id = ?
    `;

    const [result] = await connection.query(query, [
      name ?? null,
      phone ?? null,
      address ?? null,
      city ?? null,
      avatar ?? null,
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      connection.release();
      return res.status(404).json({ error: 'User not found' });
    }

    const [rows] = await connection.query('SELECT id, email, name, phone, address, city, avatar FROM users WHERE id = ?', [req.params.id]);
    connection.release();
    res.json({ message: 'User updated successfully', user: rows[0] });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/users/:id/password', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const { oldPassword, newPassword } = req.body;

    const [rows] = await connection.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'User not found' });
    }

    if (oldPassword && rows[0].password !== oldPassword) {
      connection.release();
      return res.status(400).json({ error: 'Mật khẩu cũ không chính xác' });
    }

    await connection.query('UPDATE users SET password = ? WHERE id = ?', [newPassword, req.params.id]);
    connection.release();
    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/users', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT id, email, name, phone, address, city, role, createdAt FROM users');
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== ORDERS ====================
app.get('/orders', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const { userId } = req.query;

    let query = 'SELECT * FROM orders WHERE 1=1';
    const params = [];

    if (userId) {
      query += ' AND userId = ?';
      params.push(userId);
    }

    const [rows] = await connection.query(query, params);
    connection.release();

    const orders = rows.map(order => ({
      ...order,
      items: order.items ? JSON.parse(order.items) : [],
    }));

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/orders/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = {
      ...rows[0],
      items: rows[0].items ? JSON.parse(rows[0].items) : [],
    };

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/orders', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const { userId, items, totalAmount, shippingAddress, shippingMethod, paymentMethod } = req.body;

    const query = `
      INSERT INTO orders (userId, orderNumber, items, totalAmount, shippingAddress, shippingMethod, paymentMethod, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
    `;

    const orderNumber = `ORD-${Date.now()}`;

    await connection.query(query, [
      userId,
      orderNumber,
      JSON.stringify(items),
      totalAmount,
      shippingAddress,
      shippingMethod,
      paymentMethod,
    ]);

    connection.release();
    res.status(201).json({ message: 'Order created successfully', orderNumber });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/orders/:id/status', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const { status } = req.body;
    const [result] = await connection.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order status updated successfully', status });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/orders/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query('DELETE FROM orders WHERE id = ?', [req.params.id]);
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== CART ====================
app.get('/cart/:userId', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM cart WHERE userId = ?', [req.params.userId]);
    connection.release();

    if (rows.length === 0) {
      return res.json({ userId: req.params.userId, items: [], totalItems: 0, totalPrice: 0 });
    }

    const cart = {
      ...rows[0],
      items: rows[0].items ? JSON.parse(rows[0].items) : [],
    };

    res.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/cart/:userId', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const { userId } = req.params;
    const { items, totalItems, totalPrice } = req.body;

    const query = `
      INSERT INTO cart (userId, items, totalItems, totalPrice)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE items = ?, totalItems = ?, totalPrice = ?
    `;

    await connection.query(query, [
      userId,
      JSON.stringify(items),
      totalItems,
      totalPrice,
      JSON.stringify(items),
      totalItems,
      totalPrice,
    ]);

    connection.release();
    res.json({ message: 'Giỏ hàng đã được cập nhật thành công' });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/orders/:id/cancel', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT status FROM orders WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Order not found' });
    }

    if (rows[0].status !== 'pending') {
      connection.release();
      return res.status(400).json({ error: 'Chỉ có thể hủy đơn hàng đang chờ xác nhận' });
    }

    await connection.query("UPDATE orders SET status = 'cancelled' WHERE id = ?", [req.params.id]);
    connection.release();
    res.json({ message: 'Đơn hàng đã được hủy thành công', status: 'cancelled' });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/cart/:userId', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('UPDATE cart SET items = "[]", totalItems = 0, totalPrice = 0 WHERE userId = ?', [req.params.userId]);
    connection.release();
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== WISHLIST ====================
app.get('/wishlist/:userId', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(`
      SELECT p.*, w.createdAt as addedAt
      FROM wishlist w
      JOIN products p ON w.productId = p.id
      WHERE w.userId = ?
      ORDER BY w.createdAt DESC
    `, [req.params.userId]);
    connection.release();

    const wishlist = rows.map(product => ({
      ...product,
      specifications: product.specifications ? (typeof product.specifications === 'string' ? JSON.parse(product.specifications) : product.specifications) : {},
      features: product.features ? (typeof product.features === 'string' ? JSON.parse(product.features) : product.features) : [],
    }));

    res.json(wishlist);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/wishlist/:userId', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const { productId } = req.body;
    await connection.query(
      'INSERT INTO wishlist (userId, productId) VALUES (?, ?) ON DUPLICATE KEY UPDATE productId = VALUES(productId)',
      [req.params.userId, productId]
    );
    connection.release();
    res.status(201).json({ message: 'Đã thêm vào danh sách yêu thích', productId });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/wishlist/:userId/:productId', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM wishlist WHERE userId = ? AND productId = ?', [
      req.params.userId,
      req.params.productId,
    ]);
    connection.release();
    res.json({ message: 'Đã xóa khỏi danh sách yêu thích' });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== REVIEWS ====================
app.get('/products/:id/reviews', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT * FROM reviews WHERE productId = ? ORDER BY createdAt DESC',
      [req.params.id]
    );
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/products/:id/reviews', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const { userId, userName, userAvatar, rating, comment } = req.body;

    await connection.query(
      'INSERT INTO reviews (productId, userId, userName, userAvatar, rating, comment) VALUES (?, ?, ?, ?, ?, ?)',
      [req.params.id, userId || null, userName || 'Khách hàng', userAvatar || null, rating || 5, comment]
    );

    // Update product rating and review count
    const [[stats]] = await connection.query(
      'SELECT COUNT(*) as count, AVG(rating) as avgRating FROM reviews WHERE productId = ?',
      [req.params.id]
    );

    await connection.query(
      'UPDATE products SET reviewCount = ?, rating = ? WHERE id = ?',
      [stats.count, Math.round(stats.avgRating * 10) / 10, req.params.id]
    );

    connection.release();
    res.status(201).json({ message: 'Đánh giá đã được gửi thành công' });
  } catch (error) {
    console.error('Error posting review:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== VOUCHERS ====================
app.get('/vouchers', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM vouchers');
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching vouchers:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/vouchers/validate', async (req, res) => {
  try {
    const { code, totalAmount } = req.body;
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM vouchers WHERE code = ?', [code]);
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ valid: false, error: 'Mã giảm giá không tồn tại' });
    }

    const voucher = rows[0];
    if (totalAmount < voucher.minOrder) {
      return res.status(400).json({
        valid: false,
        error: `Đơn hàng tối thiểu ${voucher.minOrder.toLocaleString('vi-VN')}₫ để áp dụng mã này`,
      });
    }

    res.json({
      valid: true,
      voucher,
      discount: voucher.discount,
      message: 'Áp dụng mã giảm giá thành công',
    });
  } catch (error) {
    console.error('Error validating voucher:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== ADMIN STATS ====================
app.get('/admin/stats', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [[productsCount]] = await connection.query('SELECT COUNT(*) as total FROM products');
    const [[ordersCount]] = await connection.query('SELECT COUNT(*) as total FROM orders');
    const [[usersCount]] = await connection.query('SELECT COUNT(*) as total FROM users');
    const [[categoriesCount]] = await connection.query('SELECT COUNT(*) as total FROM categories');
    const [[revenueResult]] = await connection.query("SELECT COALESCE(SUM(totalAmount), 0) as totalRevenue FROM orders WHERE status != 'cancelled'");
    const [recentOrders] = await connection.query('SELECT * FROM orders ORDER BY createdAt DESC LIMIT 5');
    connection.release();

    res.json({
      totalProducts: productsCount.total,
      totalOrders: ordersCount.total,
      totalUsers: usersCount.total,
      totalCategories: categoriesCount.total,
      totalRevenue: revenueResult.totalRevenue,
      recentOrders: recentOrders.map(o => ({ ...o, items: o.items ? JSON.parse(o.items) : [] })),
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`📊 Database: ${process.env.DB_NAME || 'maytinh'}`);
  console.log(`👤 DB User: ${process.env.DB_USER || 'root'}`);
});
