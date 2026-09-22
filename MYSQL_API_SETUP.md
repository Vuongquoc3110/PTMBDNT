📱 **ProMart - Backend API Setup với MySQL**

✅ **Các file đã được tạo:**
  
1. **server/database.sql** - Script SQL để tạo database + tables + sample data
2. **server/api.js** - Express server API kết nối MySQL  
3. **.env.local** - Cấu hình database MySQL
4. **DATABASE_SETUP.md** - Hướng dẫn chi tiết

---

## 🚀 **Bắt đầu nhanh (5 phút)**

### Bước 1️⃣: Mở phpMyAdmin
```
1. Mở XAMPP Control Panel
2. Click Start → Apache, MySQL
3. Nhấp Admin (MySQL) → phpMyAdmin sẽ mở
```

### Bước 2️⃣: Import Database SQL
```
1. Trong phpMyAdmin, tab SQL
2. Copy toàn bộ nội dung: server/database.sql  
3. Dán vào → Click Go
```

**Hoặc:** Menu Import → Chọn file server/database.sql

### Bước 3️⃣: Chạy Backend API
```bash
npm run backend
```
✅ Server sẽ chạy tại: **http://localhost:5000**

### Bước 4️⃣: Chạy Expo App (terminal khác)
```bash
npm start
```
✅ Expo tại: **http://localhost:8081**

---

## 📊 **API Endpoints Sẵn sàng**

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/categories` | Lấy tất cả categories |
| GET | `/products` | Lấy tất cả products |
| GET | `/products?category=laptop` | Lấy theo category |
| GET | `/products/:id` | Lấy chi tiết product |
| POST | `/products` | Thêm product mới |
| POST | `/users/register` | Đăng ký user |
| POST | `/users/login` | Đăng nhập |
| GET | `/orders` | Lấy orders |
| POST | `/orders` | Tạo order mới |
| GET | `/cart/:userId` | Lấy giỏ hàng |
| POST | `/cart/:userId` | Cập nhật giỏ hàng |

---

## 🗂️ **Cấu trúc Database**

```
promart/
├── categories (12 danh mục)
├── products (5 sản phẩm mẫu)
├── users
├── orders
└── cart
```

**Sample data đã có:**
- ✅ 12 danh mục (Laptop, PC, CPU, GPU, RAM, SSD...)
- ✅ 5 sản phẩm (Pro Gaming Laptop, UltraBook, CPU i9, RTX 4090, RAM...)

---

## 🔧 **Cấu hình Database** (nếu khác mặc định)

Mở `.env.local` và chỉnh sửa:

```env
DB_HOST=localhost        # Nếu khác host
DB_USER=root             # Nếu khác user
DB_PASSWORD=             # Nếu có password
DB_NAME=promart          # Tên database
DB_PORT=3306             # Port MySQL
PORT=5000                # Port API server
```

---

## ✅ **Kiểm tra Setup**

### Test API
```bash
# Trong terminal hoặc browser console
curl http://localhost:5000/health
curl http://localhost:5000/categories
curl http://localhost:5000/products
```

### Xem dữ liệu trong phpMyAdmin
1. Mở phpMyAdmin → Database `promart`
2. Click các table: categories, products, users...
3. Xem dữ liệu đã được import

---

## 🎯 **Next Steps**

1. ✅ Import SQL script vào phpMyAdmin
2. ✅ Chạy backend: `npm run backend`
3. ✅ Chạy Expo app: `npm start` (terminal khác)
4. 📱 Scan QR Code trên điện thoại để xem app
5. 🔌 App sẽ tự động fetch dữ liệu từ API MySQL

---

## ⚠️ **Troubleshoot**

| Lỗi | Giải pháp |
|-----|----------|
| "Can't connect to MySQL" | • Mở XAMPP, start MySQL • Kiểm tra port 3306 |
| "Database doesn't exist" | • Import SQL script vào phpMyAdmin |
| "API connection error" | • Check backend chạy: `npm run backend` • Port 5000 có bị chiếm? |
| "Products not showing" | • Kiểm tra dữ liệu trong phpMyAdmin |

---

## 📚 **Chi tiết**

Xem hướng dẫn đầy đủ: **DATABASE_SETUP.md**

---

**All set! Backend API với MySQL ready! 🎉**
