# API Documentation - ProMart

## Khởi động API Server

### Cách 1: Chạy riêng API server
```bash
npm run api
```
Server sẽ chạy tại `http://localhost:3000`

### Cách 2: Chạy cùng lúc API + Expo App (Recommended)
```bash
npm run dev
```
Điều này sẽ khởi động:
- JSON Server API tại `http://localhost:3000`
- Expo dev server tại `http://localhost:8081`

## API Endpoints

### Products
- `GET /products` - Lấy danh sách sản phẩm
- `GET /products/:id` - Lấy chi tiết sản phẩm
- `GET /products?category=laptop` - Lấy sản phẩm theo danh mục

### Categories
- `GET /categories` - Lấy danh sách danh mục

### Users
- `GET /users` - Lấy danh sách user
- `POST /users` - Tạo user mới
- `GET /users/:id` - Lấy chi tiết user

### Orders
- `GET /orders` - Lấy danh sách đơn hàng
- `GET /orders/:id` - Lấy chi tiết đơn hàng
- `POST /orders` - Tạo đơn hàng mới

### Cart
- `GET /cart` - Lấy giỏ hàng
- `POST /cart` - Cập nhật giỏ hàng

## Sử dụng trong App

### Import API Service
```typescript
import { apiService } from '@/services/api';
```

### Ví dụ 1: Lấy danh sách sản phẩm
```typescript
const products = await apiService.getProducts();
```

### Ví dụ 2: Lấy sản phẩm theo danh mục
```typescript
const laptops = await apiService.getProductsByCategory('laptop');
```

### Ví dụ 3: Sử dụng Hook
```typescript
import { useProducts } from '@/hooks/useApi';

export default function ProductsScreen() {
  const { products, loading, error } = useProducts();
  
  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;
  
  return (
    // Render products
  );
}
```

## Database Structure

Database được lưu tại `server/db.json` với các collection:
- `categories` - Danh sách danh mục
- `products` - Danh sách sản phẩm
- `users` - Thông tin user
- `orders` - Đơn hàng
- `cart` - Giỏ hàng

## Chỉnh sửa dữ liệu
Bạn có thể chỉnh sửa trực tiếp file `server/db.json` và server sẽ tự động reload dữ liệu.

## Thêm dữ liệu mới
Có thể sử dụng API endpoints để POST dữ liệu mới:

```typescript
// Thêm sản phẩm mới
const newProduct = await apiService.request('/products', {
  method: 'POST',
  body: JSON.stringify({
    name: 'New Product',
    category: 'laptop',
    price: 10000000,
    // ... other fields
  })
});
```
