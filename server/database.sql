-- ============================================
-- ProMart - Database Setup (Gộp đầy đủ)
-- Chạy trên phpMyAdmin hoặc MySQL CLI
-- ============================================

-- Tạo Database
CREATE DATABASE IF NOT EXISTS promart
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE promart;

-- Tắt kiểm tra foreign key tạm thời
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================
-- Tạo Bảng
-- ============================================

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

-- Bảng Reviews (Đánh giá)
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

-- Bảng Vouchers (Mã giảm giá)
CREATE TABLE IF NOT EXISTS vouchers (
  code VARCHAR(50) PRIMARY KEY,
  discount BIGINT NOT NULL,
  minOrder BIGINT DEFAULT 0,
  label VARCHAR(255) NOT NULL,
  expiryDate VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bật lại foreign key
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- Insert Dữ Liệu
-- ============================================

-- Insert Vouchers
INSERT INTO vouchers (code, discount, minOrder, label, expiryDate) VALUES
('DPC50K', 50000, 2000000, 'Giảm 50.000₫ đơn từ 2tr', '2026-12-31'),
('FREESHIP', 30000, 0, 'Miễn phí giao hàng toàn quốc', '2026-12-31'),
('VIP200K', 200000, 20000000, 'Giảm 200.000₫ đơn từ 20tr', '2026-12-31')
ON DUPLICATE KEY UPDATE discount=VALUES(discount), minOrder=VALUES(minOrder), label=VALUES(label);

-- Insert Categories
INSERT INTO categories (id, name, count, icon) VALUES
('laptop', 'Laptop', 28, '💻'),
('gaming-pc', 'PC Gaming', 16, '🖥️'),
('office-pc', 'PC Văn Phòng', 12, '🧑‍💻'),
('cpu', 'CPU', 20, '⚙️'),
('gpu', 'GPU', 18, '🎮'),
('ram', 'RAM', 14, '🧠'),
('ssd', 'SSD', 22, '💾'),
('monitor', 'Màn Hình', 15, '🖥️'),
('keyboard', 'Bàn Phím', 19, '⌨️'),
('mouse', 'Chuột', 17, '🖱️'),
('headset', 'Tai Nghe', 13, '🎧'),
('accessories', 'Phụ Kiện', 24, '🔌');

-- Insert Products
INSERT INTO products (
  id, name, category_id, price, oldPrice, discount, rating, reviewCount, stock,
  isFeatured, isNew, isSale, isHot, image, description,
  specifications, features
) VALUES
(
  'lap-001',
  'Pro Gaming Laptop X15',
  'laptop',
  18990000,
  20990000,
  10,
  4.9,
  128,
  15,
  TRUE,
  TRUE,
  TRUE,
  TRUE,
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80',
  'Laptop gaming mạnh mẽ dành cho gameplay, sáng tạo và làm việc chuyên nghiệp',
  '{"CPU": "Intel Core i7-13700H", "GPU": "NVIDIA RTX 4070", "RAM": "32GB DDR5", "Storage": "1TB NVMe SSD", "Display": "15.6 QHD 165Hz"}',
  '["Intel Core i7", "RTX 4070", "32GB DDR5", "1TB NVMe SSD", "144Hz display"]'
),
(
  'lap-002',
  'UltraBook Pro 14',
  'laptop',
  13990000,
  15990000,
  12,
  4.8,
  95,
  20,
  TRUE,
  TRUE,
  FALSE,
  FALSE,
  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
  'Ultrabook siêu nhẹ, pin lâu dành cho công việc văn phòng và di động',
  '{"CPU": "Intel Core i5-1340P", "RAM": "16GB LPDDR5", "Storage": "512GB SSD", "Display": "14 4K"}',
  '["Intel Core i5", "16GB RAM", "512GB SSD", "14 4K display"]'
),
(
  'cpu-001',
  'Intel Core i9-13900K',
  'cpu',
  8990000,
  9990000,
  10,
  4.9,
  450,
  45,
  TRUE,
  FALSE,
  TRUE,
  FALSE,
  'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1200&q=80',
  'CPU cao cấp cho gaming và workstation chuyên nghiệp',
  '{"Cores": "24 (8P+16E)", "Threads": "32", "Base Clock": "3.0 GHz", "Max Clock": "5.8 GHz", "TDP": "253W"}',
  '["24 cores", "8P+16E cores", "5.8 GHz Max", "Raptor Lake"]'
),
(
  'gpu-001',
  'RTX 4090',
  'gpu',
  22990000,
  24990000,
  8,
  4.95,
  320,
  8,
  TRUE,
  FALSE,
  TRUE,
  TRUE,
  'https://images.unsplash.com/photo-1591290621835-1d04d7e66efc?auto=format&fit=crop&w=1200&q=80',
  'Card đồ họa flagship cho gaming 4K ultra settings',
  '{"Memory": "24GB GDDR6X", "Memory Speed": "20 Gbps", "TDP": "450W"}',
  '["16,384 CUDA cores", "24GB GDDR6X", "PCIe 4.0"]'
),
(
  'ram-001',
  'Corsair Vengeance RGB Pro 32GB DDR5',
  'ram',
  3990000,
  4490000,
  11,
  4.7,
  210,
  50,
  TRUE,
  TRUE,
  FALSE,
  FALSE,
  'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1200&q=80',
  'RAM DDR5 cao cấp với RGB lighting đẹp mắt',
  '{"Capacity": "32GB", "Type": "DDR5", "Speed": "5600MHz", "CAS Latency": "28"}',
  '["32GB capacity", "5600MHz speed", "RGB lighting", "XMP 3.0"]'
);

-- Insert Users mẫu
INSERT INTO users (email, password, name, phone, address, city) VALUES
('nguyenvana@gmail.com', '123456', 'Nguyễn Văn A', '0901234567', '123 Lê Lợi, Quận 1', 'TP. Hồ Chí Minh'),
('tranthib@gmail.com', '123456', 'Trần Thị B', '0912345678', '456 Trần Hưng Đạo, Quận 5', 'TP. Hồ Chí Minh'),
('levanc@gmail.com', '123456', 'Lê Văn C', '0923456789', '789 Nguyễn Huệ, Quận 1', 'TP. Hồ Chí Minh'),
('phamthid@gmail.com', '123456', 'Phạm Thị D', '0934567890', '321 Hai Bà Trưng, Quận 3', 'TP. Hồ Chí Minh'),
('hoangvane@gmail.com', '123456', 'Hoàng Văn E', '0945678901', '654 Điện Biên Phủ, Bình Thạnh', 'TP. Hồ Chí Minh');

-- Insert Orders mẫu (7 đơn hàng với nhiều trạng thái)
INSERT INTO orders (userId, orderNumber, items, totalAmount, shippingAddress, shippingMethod, paymentMethod, status, createdAt) VALUES
(
  1,
  'ORD-20260801-001',
  '[{"productId": "lap-001", "name": "Pro Gaming Laptop X15", "price": 18990000, "quantity": 1, "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80"}]',
  18990000,
  '123 Lê Lợi, Quận 1, TP. Hồ Chí Minh',
  'standard',
  'cod',
  'completed',
  '2026-08-01 10:30:00'
),
(
  1,
  'ORD-20260810-002',
  '[{"productId": "ram-001", "name": "Corsair Vengeance RGB Pro 32GB DDR5", "price": 3990000, "quantity": 2, "image": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1200&q=80"}]',
  7980000,
  '123 Lê Lợi, Quận 1, TP. Hồ Chí Minh',
  'express',
  'banking',
  'shipping',
  '2026-08-10 14:15:00'
),
(
  2,
  'ORD-20260815-003',
  '[{"productId": "lap-002", "name": "UltraBook Pro 14", "price": 13990000, "quantity": 1, "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80"}, {"productId": "cpu-001", "name": "Intel Core i9-13900K", "price": 8990000, "quantity": 1}]',
  22980000,
  '456 Trần Hưng Đạo, Quận 5, TP. Hồ Chí Minh',
  'standard',
  'momo',
  'pending',
  '2026-08-15 09:45:00'
),
(
  3,
  'ORD-20260820-004',
  '[{"productId": "gpu-001", "name": "RTX 4090", "price": 22990000, "quantity": 1, "image": "https://images.unsplash.com/photo-1591290621835-1d04d7e66efc?auto=format&fit=crop&w=1200&q=80"}]',
  22990000,
  '789 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
  'express',
  'banking',
  'confirmed',
  '2026-08-20 16:20:00'
),
(
  2,
  'ORD-20260825-005',
  '[{"productId": "cpu-001", "name": "Intel Core i9-13900K", "price": 8990000, "quantity": 1}, {"productId": "ram-001", "name": "Corsair Vengeance RGB Pro 32GB DDR5", "price": 3990000, "quantity": 2}]',
  16970000,
  '456 Trần Hưng Đạo, Quận 5, TP. Hồ Chí Minh',
  'standard',
  'cod',
  'pending',
  '2026-08-25 11:00:00'
),
(
  4,
  'ORD-20260826-006',
  '[{"productId": "lap-001", "name": "Pro Gaming Laptop X15", "price": 18990000, "quantity": 2}]',
  37980000,
  '321 Hai Bà Trưng, Quận 3, TP. Hồ Chí Minh',
  'express',
  'banking',
  'shipping',
  '2026-08-26 08:30:00'
),
(
  5,
  'ORD-20260827-007',
  '[{"productId": "gpu-001", "name": "RTX 4090", "price": 22990000, "quantity": 1}, {"productId": "cpu-001", "name": "Intel Core i9-13900K", "price": 8990000, "quantity": 1}, {"productId": "ram-001", "name": "Corsair Vengeance RGB Pro 32GB DDR5", "price": 3990000, "quantity": 4}]',
  47940000,
  '654 Điện Biên Phủ, Bình Thạnh, TP. Hồ Chí Minh',
  'express',
  'momo',
  'pending',
  '2026-08-27 15:45:00'
);
