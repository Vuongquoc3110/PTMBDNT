# 🗄️ Hướng dẫn Thiết lập Database MySQL

## Bước 1: Mở phpMyAdmin từ XAMPP

1. Mở XAMPP Control Panel
2. Click **Start** Apache và MySQL
3. Click **Admin** cho MySQL → phpMyAdmin sẽ mở tại `http://localhost/phpmyadmin`

## Bước 2: Tạo Database và Tables

### Cách 1: Import SQL Script (Nhanh nhất)

1. Trong phpMyAdmin, click tab **SQL**
2. Copy toàn bộ nội dung file `server/database.sql`
3. Dán vào khung SQL và click **Go**

**Hoặc:**

1. Click vào **Import**
2. Chọn file `server/database.sql`
3. Click **Go**

### Cách 2: Tạo thủ công

1. Mở phpMyAdmin
2. Click **New** → Nhập tên: `promart` → Click **Create**
3. Chọn database `promart`
4. Mở tab **SQL** → Copy từng câu lệnh CREATE TABLE

## Bước 3: Kiểm tra Database

Chạy lệnh này trong phpMyAdmin SQL:

```sql
-- Kiểm tra tất cả tables
SHOW TABLES;

-- Kiểm tra dữ liệu categories
SELECT * FROM categories;

-- Kiểm tra dữ liệu products
SELECT * FROM products;

-- Đếm số sản phẩm
SELECT COUNT(*) as total_products FROM products;
```

## Bước 4: Chạy Backend API

```bash
# Chỉ chạy backend API
npm run backend

# Hoặc chạy cùng với Expo
npm run dev
```

Backend sẽ chạy tại `http://localhost:5000`

## Kiểm tra API hoạt động

Mở browser console hoặc terminal, chạy:

```bash
# Kiểm tra API health
curl http://localhost:5000/health

# Lấy danh sách categories
curl http://localhost:5000/categories

# Lấy danh sách products
curl http://localhost:5000/products

# Lấy product theo category
curl http://localhost:5000/products?category=laptop
```

## Cấu hình kết nối MySQL

File `.env.local` đã cấu hình:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=promart
DB_PORT=3306
PORT=5000
```

**Nếu MySQL user khác:**

1. Mở `.env.local`
2. Chỉnh `DB_USER`, `DB_PASSWORD`, `DB_HOST`

## API Endpoints

### Categories
- `GET /categories` - Lấy tất cả categories
- `GET /categories/:id` - Lấy category theo ID

### Products
- `GET /products` - Lấy tất cả products
- `GET /products?category=laptop` - Lấy theo category
- `GET /products?featured=true` - Lấy products nổi bật
- `GET /products?new=true` - Lấy products mới
- `GET /products?sale=true` - Lấy products sale
- `GET /products/:id` - Lấy product theo ID
- `POST /products` - Tạo product mới

### Users
- `POST /users/register` - Đăng ký user mới
- `POST /users/login` - Đăng nhập
- `GET /users/:id` - Lấy thông tin user

### Orders
- `GET /orders` - Lấy danh sách orders
- `GET /orders/:userId` - Lấy orders của user
- `POST /orders` - Tạo order mới

### Cart
- `GET /cart/:userId` - Lấy giỏ hàng
- `POST /cart/:userId` - Cập nhật giỏ hàng

## Thêm dữ liệu mới

### Cách 1: Dùng phpMyAdmin

1. Mở `promart` database
2. Chọn table muốn insert
3. Click **Insert** → Điền dữ liệu → Click **Go**

### Cách 2: Dùng SQL

```sql
INSERT INTO products (
  id, name, category_id, price, oldPrice, discount, 
  rating, stock, image, description, specifications, features
) VALUES (
  'new-001',
  'Sản phẩm mới',
  'laptop',
  5000000,
  6000000,
  17,
  4.5,
  25,
  'https://example.com/image.jpg',
  'Mô tả sản phẩm',
  '{"CPU": "Intel i5"}',
  '["Feature 1", "Feature 2"]'
);
```

## Troubleshooting

### Lỗi: "Can't connect to MySQL server"
- ✅ MySQL service phải đang chạy (XAMPP)
- ✅ Check port 3306 có bị chiếm không

### Lỗi: "Database 'promart' doesn't exist"
- ✅ Chỉ có import SQL script chưa
- ✅ Copy toàn bộ file `database.sql` và chạy lại

### API không trả về dữ liệu
- ✅ Kiểm tra MySQL đang chạy: `npm run backend`
- ✅ Kiểm tra console có error không
- ✅ Test endpoint: `curl http://localhost:5000/health`

---

**All set! Database đã sẵn sàng với dữ liệu mẫu. 🎉**
