require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const mysql = require('mysql2/promise');

async function exportFullDatabaseSql() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'maytinh'
  });

  const [categories] = await connection.query('SELECT * FROM categories ORDER BY id ASC');
  const [products] = await connection.query('SELECT * FROM products ORDER BY category_id ASC, id ASC');
  const [vouchers] = await connection.query('SELECT * FROM vouchers');
  const [users] = await connection.query('SELECT * FROM users');
  const [orders] = await connection.query('SELECT * FROM orders');

  await connection.end();

  const esc = (str) => (str ? str.replace(/'/g, "''").replace(/\\/g, '\\\\') : '');

  let sql = `-- ============================================
-- DANGVINHPC / ProMart - Database Setup (Full All-In-One 326 Products)
-- Tự động sinh từ hệ thống với 12 danh mục (mỗi danh mục >= 20 sản phẩm)
-- ============================================

CREATE DATABASE IF NOT EXISTS maytinh
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE maytinh;

SET FOREIGN_KEY_CHECKS = 0;

-- Bảng Categories
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  count INT DEFAULT 0,
  icon VARCHAR(10),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Products
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category_id VARCHAR(50) NOT NULL,
  price BIGINT NOT NULL,
  oldPrice BIGINT,
  discount INT,
  rating DECIMAL(2,1),
  reviewCount INT DEFAULT 0,
  stock INT DEFAULT 0,
  isFeatured BOOLEAN DEFAULT FALSE,
  isNew BOOLEAN DEFAULT FALSE,
  isSale BOOLEAN DEFAULT FALSE,
  isHot BOOLEAN DEFAULT FALSE,
  image LONGTEXT,
  description TEXT,
  specifications JSON,
  features JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(50),
  state VARCHAR(50),
  zipCode VARCHAR(20),
  country VARCHAR(50),
  avatar LONGTEXT,
  role VARCHAR(20) DEFAULT 'customer',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Orders
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  orderNumber VARCHAR(50) UNIQUE,
  items JSON NOT NULL,
  totalAmount BIGINT NOT NULL,
  shippingAddress TEXT,
  shippingMethod VARCHAR(50),
  paymentMethod VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Cart
CREATE TABLE IF NOT EXISTS cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  items JSON,
  totalItems INT DEFAULT 0,
  totalPrice BIGINT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id),
  UNIQUE KEY unique_user_cart (userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Wishlist
CREATE TABLE IF NOT EXISTS wishlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  productId VARCHAR(50) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_wishlist (userId, productId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  productId VARCHAR(50) NOT NULL,
  userId INT,
  userName VARCHAR(100) NOT NULL,
  userAvatar LONGTEXT,
  rating DECIMAL(2,1) NOT NULL DEFAULT 5.0,
  comment TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Vouchers
CREATE TABLE IF NOT EXISTS vouchers (
  code VARCHAR(50) PRIMARY KEY,
  discount BIGINT NOT NULL,
  minOrder BIGINT DEFAULT 0,
  label VARCHAR(255) NOT NULL,
  expiryDate VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- Insert Categories
-- ============================================
INSERT INTO categories (id, name, count, icon) VALUES
${categories.map(c => `('${esc(c.id)}', '${esc(c.name)}', ${c.count}, '${esc(c.icon)}')`).join(',\n')}
ON DUPLICATE KEY UPDATE name=VALUES(name), count=VALUES(count), icon=VALUES(icon);

-- ============================================
-- Insert Vouchers
-- ============================================
INSERT INTO vouchers (code, discount, minOrder, label, expiryDate) VALUES
${vouchers.map(v => `('${esc(v.code)}', ${v.discount}, ${v.minOrder || 0}, '${esc(v.label)}', '${esc(v.expiryDate || '2026-12-31')}')`).join(',\n')}
ON DUPLICATE KEY UPDATE discount=VALUES(discount), minOrder=VALUES(minOrder), label=VALUES(label);

-- ============================================
-- Insert Products (326 Items)
-- ============================================
INSERT INTO products (
  id, name, category_id, price, oldPrice, discount, rating, reviewCount, stock,
  isFeatured, isNew, isSale, isHot, image, description, specifications, features
) VALUES
`;

  const prodRows = products.map(p => {
    const specs = typeof p.specifications === 'string' ? p.specifications : JSON.stringify(p.specifications || {});
    const feats = typeof p.features === 'string' ? p.features : JSON.stringify(p.features || []);
    return `('${esc(p.id)}', '${esc(p.name)}', '${esc(p.category_id)}', ${p.price}, ${p.oldPrice || 'NULL'}, ${p.discount || 0}, ${p.rating}, ${p.reviewCount}, ${p.stock}, ${p.isFeatured ? 1 : 0}, ${p.isNew ? 1 : 0}, ${p.isSale ? 1 : 0}, ${p.isHot ? 1 : 0}, '${esc(p.image)}', '${esc(p.description)}', '${esc(specs)}', '${esc(feats)}')`;
  });

  sql += prodRows.join(',\n') + `\nON DUPLICATE KEY UPDATE name=VALUES(name), price=VALUES(price), oldPrice=VALUES(oldPrice), image=VALUES(image);\n`;

  fs.writeFileSync('server/database.sql', sql, 'utf8');
  console.log(`✅ Fully exported complete database.sql with ${products.length} products!`);
}

exportFullDatabaseSql().catch(console.error);
