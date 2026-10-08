require('dotenv').config({ path: '.env.local' });
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

    await connection.query(`
      CREATE TABLE IF NOT EXISTS user_vouchers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        voucherCode VARCHAR(50) NOT NULL,
        orderId INT NULL,
        usedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_voucher (userId, voucherCode)
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);

    // Hỗ trợ khách hàng: hội thoại chuyển từ chatbot sang admin
    await connection.query(`
      CREATE TABLE IF NOT EXISTS support_tickets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sessionId VARCHAR(100) NOT NULL,
        userId INT NULL,
        customerName VARCHAR(150),
        customerContact VARCHAR(150),
        status VARCHAR(20) NOT NULL DEFAULT 'open',
        unreadByAdmin INT NOT NULL DEFAULT 0,
        unreadByCustomer INT NOT NULL DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_support_session (sessionId)
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS support_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ticketId INT NOT NULL,
        sender VARCHAR(20) NOT NULL,
        text TEXT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_support_ticket (ticketId)
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
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

    // Seed tài khoản Admin vào MySQL
    await connection.query(`
      INSERT INTO users (email, password, name, phone, address, city, role, avatar)
      VALUES
        ('admin@promart.vn', '1', 'Quản Trị Viên DANGVINHPC', '0900 000 000', '191 Nguyễn Thị Duệ, Phường Thanh Bình', 'TP. Hải Dương', 'admin', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'),
        ('admin@dangvinhpc.vn', '1', 'Quản Trị Viên DANGVINHPC', '0900 000 001', '191 Nguyễn Thị Duệ, Phường Thanh Bình', 'TP. Hải Dương', 'admin', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80')
      ON DUPLICATE KEY UPDATE password=VALUES(password), name=VALUES(name), phone=VALUES(phone), role='admin', avatar=VALUES(avatar), address=VALUES(address), city=VALUES(city)
    `);

    // Seed tài khoản Nhân viên (Staff) vào MySQL
    await connection.query(`
      INSERT INTO users (email, password, name, phone, address, city, role, avatar)
      VALUES
        ('staff@dangvinhpc.vn', '1', 'Nhân Viên Kinh Doanh DANGVINHPC', '0900 111 222', '191 Nguyễn Thị Duệ, Phường Thanh Bình', 'TP. Hải Dương', 'staff', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'),
        ('kho@dangvinhpc.vn', '1', 'Nhân Viên Quản Lý Kho DANGVINHPC', '0900 111 333', '191 Nguyễn Thị Duệ, Phường Thanh Bình', 'TP. Hải Dương', 'staff', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80')
      ON DUPLICATE KEY UPDATE password=VALUES(password), name=VALUES(name), phone=VALUES(phone), role='staff', avatar=VALUES(avatar), address=VALUES(address), city=VALUES(city)
    `);

    // Seed tài khoản khách hàng mẫu
    await connection.query(`
      INSERT INTO users (email, password, name, phone, address, city, role, avatar)
      VALUES
        ('nguyenvana@gmail.com', 'password123', 'Nguyễn Văn A', '0909123456', '123 Đường Lê Lợi, Phường Bến Nghé, Quận 1', 'TP. Hồ Chí Minh', 'customer', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80')
      ON DUPLICATE KEY UPDATE name=VALUES(name), phone=VALUES(phone)
    `);

    // Kiểm tra số lượng admin & staff đã seed
    const [adminCheck] = await connection.query("SELECT COUNT(*) as cnt FROM users WHERE role='admin'");
    const [staffCheck] = await connection.query("SELECT COUNT(*) as cnt FROM users WHERE role='staff'");
    console.log(`👤 Seeded: ${adminCheck[0].cnt} admin(s), ${staffCheck[0].cnt} staff(s) in database`);

    // Clean up any blocked hotlink URLs from MySQL database
    try {
      await connection.query(`
        UPDATE products
        SET image = 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1200&q=80'
        WHERE id = 'lap-004' OR image LIKE '%cdn.tgdd.vn%' OR image LIKE '%photo-1563013544-824ae1b704d3%'
      `);
      console.log('✅ Cleaned up broken/blocked image URLs in MySQL database');
    } catch (e) {
      // Ignore if table/column does not exist
    }

    connection.release();
    console.log('✅ Database tables initialized (wishlist, reviews, vouchers, users)');
    console.log('🔑 Admin login: admin@promart.vn / mật khẩu: 1');
  } catch (err) {
    console.warn('⚠️  Could not auto-initialize tables (MySQL may not be connected yet):', err.message);
    console.warn('💡 Hãy chắc chắn XAMPP MySQL đang chạy và database "maytinh" đã được tạo');
  }
}
initTables();


// Auth Middleware: kiểm tra quyền Quản trị viên (Admin)
async function requireAdmin(req, res, next) {
  let userId = req.headers['x-user-id'];
  const userEmail = req.headers['x-user-email'];

  // Hỗ trợ map ID 100/99 từ bản mock fallback sang ID admin thật
  if (userId === '100') userId = '1';
  if (userId === '99') userId = '2';

  if (!userId && !userEmail) {
    return res.status(401).json({ error: 'Yêu cầu xác thực tài khoản quản trị (Thiếu thông tin xác thực)' });
  }
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT id, role, email FROM users 
       WHERE (id = ? AND role = 'admin') 
          OR (email = ? AND role = 'admin') 
          OR (email IN ('admin@promart.vn', 'admin@dangvinhpc.vn') AND (? IN ('100', '99', '1', '2')))`,
      [userId || null, userEmail || userId, String(userId)]
    );
    if (rows.length === 0 || rows[0].role !== 'admin') {
      return res.status(403).json({ error: 'Truy cập bị từ chối: Chỉ tài khoản Quản trị viên (Admin) mới có quyền thực hiện thao tác này' });
    }
    req.adminUser = rows[0];
    next();
  } catch (err) {
    console.error('requireAdmin error:', err);
    res.status(500).json({ error: 'Lỗi kiểm tra quyền quản trị: ' + err.message });
  } finally {
    if (connection) connection.release();
  }
}

// Middleware: cho phép cả Quản trị viên (Admin) và Nhân viên (Staff)
async function requireStaffOrAdmin(req, res, next) {
  let userId = req.headers['x-user-id'];
  const userEmail = req.headers['x-user-email'];

  if (userId === '100') userId = '1';
  if (userId === '99') userId = '2';

  if (!userId && !userEmail) {
    return res.status(401).json({ error: 'Yêu cầu xác thực tài khoản (Thiếu thông tin xác thực)' });
  }
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT id, role, email FROM users 
       WHERE (id = ? AND role IN ('admin', 'staff')) 
          OR (email = ? AND role IN ('admin', 'staff')) 
          OR (email IN ('admin@promart.vn', 'admin@dangvinhpc.vn') AND (? IN ('100', '99', '1', '2')))`,
      [userId || null, userEmail || userId, String(userId)]
    );
    if (rows.length === 0 || !['admin', 'staff'].includes(rows[0].role)) {
      return res.status(403).json({ error: 'Truy cập bị từ chối: Chỉ Quản trị viên hoặc Nhân viên mới có quyền thực hiện thao tác này' });
    }
    req.staffUser = rows[0];
    req.adminUser = rows[0].role === 'admin' ? rows[0] : null;
    next();
  } catch (err) {
    console.error('requireStaffOrAdmin error:', err);
    res.status(500).json({ error: 'Lỗi kiểm tra quyền: ' + err.message });
  } finally {
    if (connection) connection.release();
  }
}

// ==================== CATEGORIES ====================
app.get(['/categories', '/api/categories'], async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(`
      SELECT c.*,
        (SELECT COUNT(*) FROM products p
         WHERE (p.category_id = c.id OR p.category_id LIKE CONCAT('%', c.id, '%'))
           AND (p.isHidden IS NULL OR p.isHidden = FALSE)
        ) AS count
      FROM categories c
    `);
    connection.release();

    // Hỗ trợ cả format mảng trực tiếp và format wrapper theo yêu cầu của thầy { success, message, data }
    if (req.path.startsWith('/api') || req.query.format === 'wrapper') {
      return res.json({
        success: true,
        message: 'Lấy danh mục thành công',
        data: rows,
      });
    }

    res.json(rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    if (req.path.startsWith('/api')) {
      return res.status(500).json({ success: false, message: error.message, data: [] });
    }
    res.status(500).json({ error: error.message });
  }
});

app.get('/categories/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(`
      SELECT c.*,
        (SELECT COUNT(*) FROM products p 
         WHERE (p.category_id = c.id OR p.category_id LIKE CONCAT('%', c.id, '%')) 
           AND (p.isHidden IS NULL OR p.isHidden = FALSE)
        ) AS count
      FROM categories c WHERE c.id = ?
    `, [req.params.id]);
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

app.post('/categories', requireAdmin, async (req, res) => {
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

app.put('/categories/:id', requireAdmin, async (req, res) => {
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

app.delete('/categories/:id', requireAdmin, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    // Chặn xóa nếu còn sản phẩm thuộc danh mục này
    const [prodCheck] = await connection.query(
      'SELECT id FROM products WHERE category_id = ? OR category_id LIKE ? LIMIT 1',
      [req.params.id, `%${req.params.id}%`]
    );
    if (prodCheck.length > 0) {
      connection.release();
      return res.status(400).json({ error: 'Không thể xóa danh mục đang có sản phẩm thuộc về nó. Hãy chuyển hoặc xóa sản phẩm trước!' });
    }

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

    // Chỉ cho phép xem sản phẩm ẩn nếu có cờ admin VÀ người gọi thực sự là admin
    let showHidden = false;
    if (admin === 'true') {
      const userId = req.headers['x-user-id'];
      if (userId) {
        const [u] = await connection.query('SELECT role FROM users WHERE id = ?', [userId]);
        if (u.length > 0 && u[0].role === 'admin') {
          showHidden = true;
        }
      }
    }

    if (!showHidden) {
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

    // Parse JSON fields and sanitize images
    const products = rows.map(product => {
      let image = product.image;
      if (image && (
        image.includes('cdn.tgdd.vn') ||
        image.includes('laptop360.net') ||
        image.includes('photo-1563013544-824ae1b704d3')
      )) {
        image = 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1200&q=80';
      }
      return {
        ...product,
        image,
        specifications: product.specifications ? (typeof product.specifications === 'string' ? JSON.parse(product.specifications) : product.specifications) : {},
        features: product.features ? (typeof product.features === 'string' ? JSON.parse(product.features) : product.features) : [],
        configurations: product.configurations ? (typeof product.configurations === 'string' ? JSON.parse(product.configurations) : product.configurations) : undefined,
      };
    });

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
    
    if (rows.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Product not found' });
    }

    let isRequestAdmin = false;
    if (req.query.admin === 'true') {
      const userId = req.headers['x-user-id'];
      if (userId) {
        const [u] = await connection.query('SELECT role FROM users WHERE id = ?', [userId]);
        if (u.length > 0 && u[0].role === 'admin') {
          isRequestAdmin = true;
        }
      }
    }
    connection.release();

    if (rows[0].isHidden && !isRequestAdmin) {
      return res.status(404).json({ error: 'Sản phẩm hiện không khả dụng hoặc đã tạm ngừng kinh doanh' });
    }

    let image = rows[0].image;
    if (image && (
      image.includes('cdn.tgdd.vn') ||
      image.includes('laptop360.net') ||
      image.includes('photo-1563013544-824ae1b704d3')
    )) {
      image = 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1200&q=80';
    }

    const product = {
      ...rows[0],
      image,
      specifications: rows[0].specifications ? JSON.parse(rows[0].specifications) : {},
      features: rows[0].features ? JSON.parse(rows[0].features) : [],
      configurations: rows[0].configurations ? (typeof rows[0].configurations === 'string' ? JSON.parse(rows[0].configurations) : rows[0].configurations) : undefined,
    };

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/products', requireAdmin, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const p = req.body;
    const catId = p.category_id || p.category || 'accessories';

    // Đảm bảo category tồn tại để không dính lỗi foreign key constraint
    await connection.query(
      'INSERT IGNORE INTO categories (id, name, count, icon) VALUES (?, ?, 0, ?)',
      [catId, catId.toUpperCase(), '📦']
    );
    
    await connection.query(`
      INSERT INTO products (
        id, name, category_id, price, oldPrice, discount, rating, reviewCount, stock,
        isFeatured, isNew, isSale, isHot, isHidden, image, description, specifications, features
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        category_id = VALUES(category_id),
        price = VALUES(price),
        oldPrice = VALUES(oldPrice),
        discount = VALUES(discount),
        rating = VALUES(rating),
        reviewCount = VALUES(reviewCount),
        stock = VALUES(stock),
        isFeatured = VALUES(isFeatured),
        isNew = VALUES(isNew),
        isSale = VALUES(isSale),
        isHot = VALUES(isHot),
        isHidden = VALUES(isHidden),
        image = VALUES(image),
        description = VALUES(description),
        specifications = VALUES(specifications),
        features = VALUES(features)
    `, [
      p.id, p.name, p.category_id || p.category || '', p.price, p.oldPrice || null, p.discount || 0,
      p.rating || 5.0, p.reviewCount || 0, p.stock || 0,
      p.isFeatured || false, p.isNew || false, p.isSale || false, p.isHot || false, p.isHidden || false,
      p.image || '', p.description || '',
      typeof p.specifications === 'string' ? p.specifications : JSON.stringify(p.specifications || {}),
      typeof p.features === 'string' ? p.features : JSON.stringify(p.features || [])
    ]);

    connection.release();
    res.status(201).json({ message: 'Product created successfully' });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/products/:id', requireStaffOrAdmin, async (req, res) => {
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

    const finalCategoryId = category_id || req.body.category || null;

    const query = `
      UPDATE products SET
        name = COALESCE(?, name),
        category_id = COALESCE(?, category_id),
        price = COALESCE(?, price),
        oldPrice = IF(?, ?, oldPrice),
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
      finalCategoryId,
      price !== undefined ? price : null,
      Object.prototype.hasOwnProperty.call(req.body, 'oldPrice') ? 1 : 0,
      oldPrice ?? null,
      discount !== undefined ? discount : null,
      rating !== undefined ? rating : null,
      stock !== undefined ? stock : null,
      image ?? null,
      description ?? null,
      specifications ? (typeof specifications === 'string' ? specifications : JSON.stringify(specifications)) : null,
      features ? (typeof features === 'string' ? features : JSON.stringify(features)) : null,
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

app.delete('/products/:id', requireAdmin, async (req, res) => {
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
    const { email, password, name, phone } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPhone = (phone || '').replace(/\D/g, '');

    if (!cleanEmail) {
      connection.release();
      return res.status(400).json({ error: 'Vui lòng nhập địa chỉ email hợp lệ' });
    }

    // 1. Kiểm tra trùng địa chỉ email
    const [existingEmail] = await connection.query('SELECT id FROM users WHERE LOWER(email) = ?', [cleanEmail]);
    if (existingEmail.length > 0) {
      connection.release();
      return res.status(400).json({ error: 'Địa chỉ email này đã được sử dụng cho tài khoản khác' });
    }

    // 2. Kiểm tra trùng số điện thoại
    if (cleanPhone) {
      const [existingPhone] = await connection.query(
        'SELECT id FROM users WHERE REPLACE(REPLACE(REPLACE(phone, " ", ""), "-", ""), ".", "") = ?',
        [cleanPhone]
      );
      if (existingPhone.length > 0) {
        connection.release();
        return res.status(400).json({ error: 'Số điện thoại này đã được đăng ký cho tài khoản khác' });
      }
    }

    // Chỉ tài khoản quản trị mặc định của hệ thống mới có role admin
    const userRole = (cleanEmail === 'admin@promart.vn' || cleanEmail === 'admin@dangvinhpc.vn') ? 'admin' : 'customer';

    const query = `INSERT INTO users (email, password, name, phone, role) VALUES (?, ?, ?, ?, ?)`;
    await connection.query(query, [cleanEmail, password, name, cleanPhone, userRole]);

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
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail || !password) {
      connection.release();
      return res.status(400).json({ error: 'Vui lòng nhập đầy đủ email và mật khẩu' });
    }

    const [rows] = await connection.query(
      'SELECT * FROM users WHERE LOWER(email) = ? AND password = ?',
      [cleanEmail, password]
    );
    connection.release();

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
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

app.get('/users', requireAdmin, async (req, res) => {
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

app.delete('/users/:id', requireAdmin, async (req, res) => {
  try {
    if (Number(req.params.id) === Number(req.adminUser.id)) {
      return res.status(400).json({ error: 'Không thể tự xóa tài khoản của chính mình' });
    }
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

app.patch('/users/:id/role', requireAdmin, async (req, res) => {
  try {
    if (Number(req.params.id) === Number(req.adminUser.id)) {
      return res.status(400).json({ error: 'Không thể tự thay đổi vai trò tài khoản của chính mình' });
    }
    const { role } = req.body;
    if (!role || !['admin', 'staff', 'customer'].includes(role)) {
      return res.status(400).json({ error: 'Vai trò không hợp lệ (admin, staff hoặc customer)' });
    }
    const connection = await pool.getConnection();

    // Bảo vệ tài khoản admin gốc
    const [targetRows] = await connection.query('SELECT email FROM users WHERE id = ?', [req.params.id]);
    if (targetRows.length > 0 && targetRows[0].email === 'admin@promart.vn') {
      connection.release();
      return res.status(400).json({ error: 'Không thể thay đổi quyền của tài khoản Quản trị viên gốc' });
    }

    const [result] = await connection.query('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const roleName = role === 'admin' ? 'Quản trị viên (Admin)' : role === 'staff' ? 'Nhân viên cửa hàng (Staff)' : 'Khách hàng (Customer)';
    res.json({ message: `Đã đổi vai trò người dùng thành ${roleName}` });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: error.message });
  }
});

// Cho phép Admin tạo nhanh tài khoản nhân viên / quản trị mới
app.post('/users/create-user', requireAdmin, async (req, res) => {
  let connection;
  try {
    const { name, email, phone, password, role = 'staff', address = '', city = '' } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ họ tên, email và mật khẩu' });
    }
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanRole = ['admin', 'staff', 'customer'].includes(role) ? role : 'staff';
    connection = await pool.getConnection();

    const [existing] = await connection.query('SELECT id FROM users WHERE email = ?', [cleanEmail]);
    if (existing.length > 0) {
      connection.release();
      return res.status(400).json({ error: 'Email này đã tồn tại trong hệ thống' });
    }

    const [insertResult] = await connection.query(
      'INSERT INTO users (name, email, phone, password, role, address, city) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name.trim(), cleanEmail, phone ? String(phone).trim() : '', password, cleanRole, address, city]
    );
    connection.release();

    const roleName = cleanRole === 'admin' ? 'Quản trị viên' : cleanRole === 'staff' ? 'Nhân viên' : 'Khách hàng';
    res.status(201).json({
      message: `Đã tạo tài khoản ${roleName} thành công`,
      user: {
        id: insertResult.insertId,
        name: name.trim(),
        email: cleanEmail,
        phone: phone || '',
        role: cleanRole,
        address,
        city,
      },
    });
  } catch (error) {
    if (connection) connection.release();
    console.error('Error creating user:', error);
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
      items: order.items
        ? (typeof order.items === 'string' ? JSON.parse(order.items) : order.items)
        : [],
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
      items: rows[0].items
        ? (typeof rows[0].items === 'string' ? JSON.parse(rows[0].items) : rows[0].items)
        : [],
    };

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/orders', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { userId, items, totalAmount, shippingAddress, shippingMethod, paymentMethod, voucherCode } = req.body;

    const parsedItems = Array.isArray(items)
      ? items
      : (typeof items === 'string' ? JSON.parse(items) : []);

    if (!parsedItems || parsedItems.length === 0) {
      connection.release();
      return res.status(400).json({ error: 'Đơn hàng không có sản phẩm nào' });
    }

    // Bắt đầu Transaction để kiểm tra tồn kho và trừ kho an toàn
    await connection.beginTransaction();

    for (const it of parsedItems) {
      const [prodRows] = await connection.query(
        'SELECT id, name, stock, isHidden FROM products WHERE id = ? FOR UPDATE',
        [it.productId]
      );
      if (prodRows.length === 0) {
        await connection.rollback();
        connection.release();
        return res.status(400).json({ error: `Sản phẩm "${it.name || it.productId}" không tồn tại trong hệ thống` });
      }

      const prod = prodRows[0];
      if (prod.isHidden) {
        await connection.rollback();
        connection.release();
        return res.status(400).json({ error: `Sản phẩm "${prod.name}" hiện đã ngừng kinh doanh` });
      }

      const reqQty = Number(it.quantity) || 1;
      const currentStock = prod.stock ?? 0;
      if (currentStock < reqQty) {
        await connection.rollback();
        connection.release();
        return res.status(400).json({
          error: `Sản phẩm "${prod.name}" trong kho chỉ còn ${currentStock} cái, không đủ số lượng bạn đặt (${reqQty})`
        });
      }
    }

    // Trừ kho từng sản phẩm
    for (const it of parsedItems) {
      const reqQty = Number(it.quantity) || 1;
      await connection.query('UPDATE products SET stock = stock - ? WHERE id = ?', [reqQty, it.productId]);
    }

    const orderNumber = `ORD-${Date.now()}`;
    const query = `
      INSERT INTO orders (userId, orderNumber, items, totalAmount, shippingAddress, shippingMethod, paymentMethod, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
    `;

    const [result] = await connection.query(query, [
      userId,
      orderNumber,
      JSON.stringify(parsedItems),
      totalAmount,
      shippingAddress,
      shippingMethod,
      paymentMethod,
    ]);

    // Nếu đơn hàng có dùng voucher, lưu vào user_vouchers để đánh dấu đã sử dụng
    if (voucherCode && userId) {
      const cleanVoucher = String(voucherCode).trim().toUpperCase();
      try {
        await connection.query(
          'INSERT INTO user_vouchers (userId, voucherCode, orderId) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE orderId = VALUES(orderId)',
          [userId, cleanVoucher, result.insertId]
        );
      } catch (vErr) {
        console.warn('Could not record voucher usage:', vErr);
      }
    }

    await connection.commit();
    connection.release();

    res.status(201).json({
      message: 'Order created successfully',
      orderNumber,
      orderId: result.insertId,
    });
  } catch (error) {
    if (connection) {
      try { await connection.rollback(); } catch {}
      connection.release();
    }
    console.error('Error creating order:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/orders/:id/status', requireStaffOrAdmin, async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { status } = req.body;

    // Kiểm tra trạng thái hiện tại của đơn hàng
    const [rows] = await connection.query('SELECT status, items FROM orders WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Order not found' });
    }

    const currentStatus = rows[0].status;
    if (currentStatus === 'completed' || currentStatus === 'cancelled') {
      connection.release();
      return res.status(400).json({
        error: `Đơn hàng đã ${currentStatus === 'completed' ? 'giao thành công' : 'bị hủy'}, không thể thay đổi trạng thái nữa!`
      });
    }

    // Quy trình trạng thái 1 chiều hợp lệ - không cho phép lùi quy trình
    const ALLOWED_TRANSITIONS = {
      pending: ['confirmed', 'shipping', 'cancelled'],
      confirmed: ['shipping', 'completed', 'cancelled'],
      shipping: ['completed', 'cancelled'],
      completed: [],
      cancelled: [],
    };

    if (!ALLOWED_TRANSITIONS[currentStatus] || !ALLOWED_TRANSITIONS[currentStatus].includes(status)) {
      connection.release();
      return res.status(400).json({
        error: `Không thể chuyển trạng thái từ "${currentStatus}" sang "${status}"!`
      });
    }

    await connection.beginTransaction();

    // Nếu đơn hàng bị hủy: hoàn lại số lượng tồn kho cho các sản phẩm
    if (status === 'cancelled') {
      const orderItems = rows[0].items
        ? (typeof rows[0].items === 'string' ? JSON.parse(rows[0].items) : rows[0].items)
        : [];
      for (const it of orderItems) {
        if (it.productId && it.quantity) {
          await connection.query('UPDATE products SET stock = stock + ? WHERE id = ?', [Number(it.quantity) || 1, it.productId]);
        }
      }
    }

    await connection.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    await connection.commit();
    connection.release();

    res.json({ message: 'Order status updated successfully', status });
  } catch (error) {
    if (connection) {
      try { await connection.rollback(); } catch {}
      connection.release();
    }
    console.error('Error updating order status:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/orders/:id', requireAdmin, async (req, res) => {
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
    let cartUserId = req.params.userId;
    if (cartUserId === '100' || cartUserId === 100) cartUserId = 1;
    if (cartUserId === '99' || cartUserId === 99) cartUserId = 2;

    const [rows] = await connection.query('SELECT * FROM cart WHERE userId = ?', [cartUserId]);
    connection.release();

    if (rows.length === 0) {
      return res.json({ userId: cartUserId, items: [], totalItems: 0, totalPrice: 0 });
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
    let cartUserId = req.params.userId;
    if (cartUserId === '100' || cartUserId === 100) cartUserId = 1;
    if (cartUserId === '99' || cartUserId === 99) cartUserId = 2;
    const { items, totalItems, totalPrice } = req.body;

    const query = `
      INSERT INTO cart (userId, items, totalItems, totalPrice)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE items = ?, totalItems = ?, totalPrice = ?
    `;

    await connection.query(query, [
      cartUserId,
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
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT status, items FROM orders WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Order not found' });
    }

    if (rows[0].status !== 'pending') {
      connection.release();
      return res.status(400).json({ error: 'Chỉ có thể hủy đơn hàng đang chờ xác nhận (pending)' });
    }

    await connection.beginTransaction();

    // Hoàn lại tồn kho khi khách hàng hủy đơn pending
    const orderItems = rows[0].items
      ? (typeof rows[0].items === 'string' ? JSON.parse(rows[0].items) : rows[0].items)
      : [];
    for (const it of orderItems) {
      if (it.productId && it.quantity) {
        await connection.query('UPDATE products SET stock = stock + ? WHERE id = ?', [Number(it.quantity) || 1, it.productId]);
      }
    }

    await connection.query("UPDATE orders SET status = 'cancelled' WHERE id = ?", [req.params.id]);
    await connection.commit();
    connection.release();

    res.json({ message: 'Đơn hàng đã được hủy thành công', status: 'cancelled' });
  } catch (error) {
    if (connection) {
      try { await connection.rollback(); } catch {}
      connection.release();
    }
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
      WHERE w.userId = ? AND (p.isHidden IS NULL OR p.isHidden = FALSE)
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

// Lấy danh sách mã giảm giá mà người dùng đã sử dụng
app.get('/vouchers/user/:userId', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT voucherCode FROM user_vouchers WHERE userId = ?', [req.params.userId]);
    connection.release();
    res.json(rows.map((r) => r.voucherCode));
  } catch (error) {
    console.error('Error fetching used vouchers:', error);
    res.status(500).json({ error: error.message });
  }
});

// Đánh dấu mã voucher đã được tài khoản sử dụng
app.post('/vouchers/use', async (req, res) => {
  try {
    const { userId, code, orderId } = req.body;
    if (!userId || !code) {
      return res.status(400).json({ error: 'userId và code là bắt buộc' });
    }
    const cleanCode = String(code).trim().toUpperCase();
    const connection = await pool.getConnection();
    await connection.query(
      'INSERT INTO user_vouchers (userId, voucherCode, orderId) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE usedAt = CURRENT_TIMESTAMP',
      [userId, cleanCode, orderId || null]
    );
    connection.release();
    res.json({ message: 'Đã đánh dấu mã giảm giá đã sử dụng', code: cleanCode });
  } catch (error) {
    console.error('Error recording voucher usage:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/vouchers/validate', async (req, res) => {
  try {
    const { code, totalAmount, userId } = req.body;
    const cleanCode = (code || '').trim().toUpperCase();
    const connection = await pool.getConnection();

    // 1. Kiểm tra tài khoản đã từng sử dụng voucher này chưa
    if (userId) {
      const [usedRows] = await connection.query(
        'SELECT id FROM user_vouchers WHERE userId = ? AND voucherCode = ?',
        [userId, cleanCode]
      );
      if (usedRows.length > 0) {
        connection.release();
        return res.status(400).json({
          valid: false,
          error: `Tài khoản của bạn đã sử dụng mã giảm giá "${cleanCode}" rồi`,
        });
      }
    }

    const [rows] = await connection.query('SELECT * FROM vouchers WHERE code = ?', [cleanCode]);
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ valid: false, error: 'Mã giảm giá không tồn tại' });
    }

    const voucher = rows[0];

    // 2. Kiểm tra hạn sử dụng của voucher
    if (voucher.expiryDate) {
      const today = new Date().toISOString().slice(0, 10);
      if (voucher.expiryDate < today) {
        return res.status(400).json({
          valid: false,
          error: `Mã giảm giá "${voucher.code}" đã hết hạn sử dụng vào ngày ${voucher.expiryDate}`,
        });
      }
    }

    // 3. Kiểm tra điều kiện đơn hàng tối thiểu
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

app.post('/vouchers', requireAdmin, async (req, res) => {
  try {
    const { code, discount, minOrder, label, expiryDate } = req.body;
    if (!code || !discount || !label) {
      return res.status(400).json({ error: 'Mã voucher, mức giảm và mô tả là bắt buộc' });
    }
    const cleanCode = code.trim().toUpperCase();
    const connection = await pool.getConnection();
    await connection.query(
      'INSERT INTO vouchers (code, discount, minOrder, label, expiryDate) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE discount=VALUES(discount), minOrder=VALUES(minOrder), label=VALUES(label), expiryDate=VALUES(expiryDate)',
      [cleanCode, Number(discount) || 0, Number(minOrder) || 0, label.trim(), expiryDate || '2026-12-31']
    );
    connection.release();
    res.status(201).json({ message: 'Lưu voucher thành công', code: cleanCode });
  } catch (error) {
    console.error('Error creating voucher:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/vouchers/:code', requireAdmin, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query('DELETE FROM vouchers WHERE code = ?', [req.params.code]);
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy voucher' });
    }
    res.json({ message: 'Đã xóa voucher thành công' });
  } catch (error) {
    console.error('Error deleting voucher:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== SUPPORT (CHATBOT -> ADMIN) ====================
async function getTicketWithMessages(connection, ticketId) {
  const [[ticket]] = await connection.query('SELECT * FROM support_tickets WHERE id = ?', [ticketId]);
  if (!ticket) return null;
  const [messages] = await connection.query(
    'SELECT * FROM support_messages WHERE ticketId = ? ORDER BY createdAt ASC, id ASC',
    [ticketId]
  );
  return { ...ticket, messages };
}

// Khách tạo yêu cầu hỗ trợ (hoặc gửi thêm vào yêu cầu đang mở của phiên)
app.post('/support/tickets', async (req, res) => {
  const { sessionId, userId, customerName, customerContact, message, botReply } = req.body || {};
  if (!sessionId || !message || !String(message).trim()) {
    return res.status(400).json({ error: 'Thiếu sessionId hoặc nội dung tin nhắn' });
  }
  let connection;
  try {
    connection = await pool.getConnection();
    const [[existing]] = await connection.query(
      "SELECT id FROM support_tickets WHERE sessionId = ? AND status != 'closed' ORDER BY id DESC LIMIT 1",
      [sessionId]
    );
    let ticketId = existing?.id;
    if (!ticketId) {
      const [result] = await connection.query(
        'INSERT INTO support_tickets (sessionId, userId, customerName, customerContact, status) VALUES (?, ?, ?, ?, ?)',
        [sessionId, userId || null, customerName || 'Khách vãng lai', customerContact || null, 'open']
      );
      ticketId = result.insertId;
    } else {
      await connection.query(
        "UPDATE support_tickets SET status = 'open', userId = COALESCE(?, userId), customerName = COALESCE(?, customerName), customerContact = COALESCE(?, customerContact) WHERE id = ?",
        [userId || null, customerName || null, customerContact || null, ticketId]
      );
    }
    await connection.query('INSERT INTO support_messages (ticketId, sender, text) VALUES (?, ?, ?)', [ticketId, 'customer', String(message).trim()]);
    if (botReply) {
      await connection.query('INSERT INTO support_messages (ticketId, sender, text) VALUES (?, ?, ?)', [ticketId, 'bot', String(botReply)]);
    }
    await connection.query('UPDATE support_tickets SET unreadByAdmin = unreadByAdmin + 1 WHERE id = ?', [ticketId]);
    const ticket = await getTicketWithMessages(connection, ticketId);
    res.status(201).json(ticket);
  } catch (error) {
    console.error('Error creating support ticket:', error);
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) connection.release();
  }
});

// Danh sách yêu cầu (admin) hoặc theo phiên khách (?sessionId=)
app.get('/support/tickets', async (req, res) => {
  let connection;
  try {
    const { sessionId, status } = req.query;
    connection = await pool.getConnection();

    if (sessionId) {
      const [[ticket]] = await connection.query(
        'SELECT id FROM support_tickets WHERE sessionId = ? ORDER BY id DESC LIMIT 1',
        [sessionId]
      );
      if (!ticket) return res.json(null);
      return res.json(await getTicketWithMessages(connection, ticket.id));
    }

    // Nếu xem toàn bộ tickets (admin panel), bắt buộc phải có quyền admin
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'Yêu cầu xác thực tài khoản quản trị' });
    }
    const [adminCheck] = await connection.query('SELECT role FROM users WHERE id = ?', [userId]);
    if (adminCheck.length === 0 || adminCheck[0].role !== 'admin') {
      return res.status(403).json({ error: 'Chỉ Admin mới có quyền xem danh sách hỗ trợ khách hàng' });
    }

    const params = [];
    let where = '';
    if (status && status !== 'all') {
      where = 'WHERE t.status = ?';
      params.push(status);
    }
    const [rows] = await connection.query(
      `SELECT t.*,
        (SELECT text FROM support_messages m WHERE m.ticketId = t.id ORDER BY m.id DESC LIMIT 1) AS lastMessage,
        (SELECT sender FROM support_messages m WHERE m.ticketId = t.id ORDER BY m.id DESC LIMIT 1) AS lastSender,
        (SELECT COUNT(*) FROM support_messages m WHERE m.ticketId = t.id) AS messageCount
       FROM support_tickets t ${where}
       ORDER BY (t.status = 'open') DESC, t.updatedAt DESC`,
      params
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) connection.release();
  }
});

app.get('/support/tickets/:id', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const ticket = await getTicketWithMessages(connection, req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Không tìm thấy yêu cầu hỗ trợ' });
    if (req.query.reader === 'admin') {
      await connection.query('UPDATE support_tickets SET unreadByAdmin = 0 WHERE id = ?', [req.params.id]);
      ticket.unreadByAdmin = 0;
    } else if (req.query.reader === 'customer') {
      await connection.query('UPDATE support_tickets SET unreadByCustomer = 0 WHERE id = ?', [req.params.id]);
      ticket.unreadByCustomer = 0;
    }
    res.json(ticket);
  } catch (error) {
    console.error('Error fetching support ticket:', error);
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) connection.release();
  }
});

// Gửi tin nhắn vào hội thoại (sender: 'customer' | 'admin')
app.post('/support/tickets/:id/messages', async (req, res) => {
  const { sender, text } = req.body || {};
  if (!['customer', 'admin'].includes(sender) || !text || !String(text).trim()) {
    return res.status(400).json({ error: 'Dữ liệu tin nhắn không hợp lệ' });
  }
  let connection;
  try {
    connection = await pool.getConnection();
    const [[ticket]] = await connection.query('SELECT id FROM support_tickets WHERE id = ?', [req.params.id]);
    if (!ticket) return res.status(404).json({ error: 'Không tìm thấy yêu cầu hỗ trợ' });
    await connection.query('INSERT INTO support_messages (ticketId, sender, text) VALUES (?, ?, ?)', [req.params.id, sender, String(text).trim()]);
    if (sender === 'admin') {
      await connection.query(
        "UPDATE support_tickets SET status = 'answered', unreadByCustomer = unreadByCustomer + 1 WHERE id = ?",
        [req.params.id]
      );
    } else {
      await connection.query(
        "UPDATE support_tickets SET status = 'open', unreadByAdmin = unreadByAdmin + 1 WHERE id = ?",
        [req.params.id]
      );
    }
    res.status(201).json(await getTicketWithMessages(connection, req.params.id));
  } catch (error) {
    console.error('Error sending support message:', error);
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) connection.release();
  }
});

app.patch('/support/tickets/:id', async (req, res) => {
  const { status } = req.body || {};
  if (!['open', 'answered', 'closed'].includes(status)) {
    return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
  }
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query('UPDATE support_tickets SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json(await getTicketWithMessages(connection, req.params.id));
  } catch (error) {
    console.error('Error updating support ticket:', error);
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) connection.release();
  }
});

app.delete('/support/tickets/:id', requireAdmin, async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query('DELETE FROM support_messages WHERE ticketId = ?', [req.params.id]);
    await connection.query('DELETE FROM support_tickets WHERE id = ?', [req.params.id]);
    res.json({ message: 'Đã xóa hội thoại hỗ trợ' });
  } catch (error) {
    console.error('Error deleting support ticket:', error);
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) connection.release();
  }
});

// ==================== ADMIN STATS ====================
app.get('/admin/stats', requireAdmin, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [[productsCount]] = await connection.query('SELECT COUNT(*) as total FROM products');
    const [[ordersCount]] = await connection.query('SELECT COUNT(*) as total FROM orders');
    const [[usersCount]] = await connection.query('SELECT COUNT(*) as total FROM users');
    const [[categoriesCount]] = await connection.query('SELECT COUNT(*) as total FROM categories');
    // Chỉ ghi nhận doanh thu cho đơn hàng hoàn thành (completed)
    const [[revenueResult]] = await connection.query("SELECT COALESCE(SUM(totalAmount), 0) as totalRevenue FROM orders WHERE status = 'completed'");
    const [recentOrders] = await connection.query('SELECT * FROM orders ORDER BY createdAt DESC LIMIT 5');
    connection.release();

    res.json({
      totalProducts: productsCount.total,
      totalOrders: ordersCount.total,
      totalUsers: usersCount.total,
      totalCategories: categoriesCount.total,
      totalRevenue: revenueResult.totalRevenue,
      recentOrders: recentOrders.map(o => ({ ...o, items: o.items ? (typeof o.items === 'string' ? JSON.parse(o.items) : o.items) : [] })),
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
