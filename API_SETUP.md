# ProMart - Setup Hướng dẫn API

## ✅ Những gì đã được thiết lập:

### 1. **API Server (JSON Server)**
- **Port**: `3000`
- **URL**: `http://localhost:3000`
- **Database**: `server/db.json`
- **Tính năng**: RESTful API với CRUD operations

### 2. **API Endpoints Available**
```
GET    /categories      - Lấy danh sách danh mục
GET    /products        - Lấy danh sách sản phẩm
GET    /products/:id    - Lấy chi tiết sản phẩm
GET    /users          - Lấy danh sách user
POST   /users          - Tạo user mới
GET    /orders         - Lấy danh sách đơn hàng
POST   /orders         - Tạo đơn hàng mới
GET    /cart           - Lấy giỏ hàng
POST   /cart           - Cập nhật giỏ hàng
```

### 3. **API Service & Hooks**
- **File**: `services/api.ts` - Lớp ApiService quản lý tất cả API calls
- **File**: `hooks/useApi.ts` - Custom hooks (useProducts, useProduct, useCategories)
- **Cấu hình**: `.env.local` - API_URL configuration

### 4. **Dữ liệu Database**
**File**: `server/db.json` chứa:
- 12 danh mục (laptop, PC, CPU, GPU, etc)
- 4 sản phẩm mẫu (Pro Gaming Laptop, UltraBook, CPU, GPU)
- Collections rỗng: users, orders, cart

## 🚀 Cách chạy

### Option 1: Chạy API + Expo cùng lúc (Recommended)
```bash
npm run dev
```
- API Server: `http://localhost:3000`
- Expo Web: `http://localhost:8081`

### Option 2: Chạy chỉ API server
```bash
npm run api
```

### Option 3: Chạy chỉ Expo
```bash
npm start
```

## 💻 Sử dụng API trong Component

### Cách 1: Dùng Hook (Recommended)
```typescript
import { useProducts } from '@/hooks/useApi';

export default function ProductScreen() {
  const { products, loading, error } = useProducts();
  
  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;
  
  return (
    // Render products
  );
}
```

### Cách 2: Dùng API Service trực tiếp
```typescript
import { apiService } from '@/services/api';

useEffect(() => {
  const loadProducts = async () => {
    const products = await apiService.getProducts();
    // Use products
  };
  loadProducts();
}, []);
```

## 📝 Thêm/Chỉnh sửa dữ liệu

### Cách 1: Edit trực tiếp file db.json
- Mở `server/db.json`
- Chỉnh sửa dữ liệu
- Server sẽ auto-reload

### Cách 2: POST request qua API
```typescript
const newProduct = await apiService.request('/products', {
  method: 'POST',
  body: JSON.stringify({
    id: 'new-001',
    name: 'New Product',
    category: 'laptop',
    price: 10000000,
    rating: 5,
    stock: 10,
    // ... other fields
  })
});
```

## 🔌 Thêm tính năng mới

### Thêm Collection mới trong Database
1. Thêm vào `server/db.json`:
```json
{
  "newCollection": [
    { "id": 1, "data": "..." }
  ]
}
```

2. Thêm method trong `services/api.ts`:
```typescript
async getNewCollection() {
  return this.request('/newCollection');
}
```

3. Thêm hook trong `hooks/useApi.ts`:
```typescript
export function useNewCollection() {
  // ... similar to useProducts
}
```

## 🧪 Test API Endpoints

Mở browser console và chạy:
```javascript
// Test GET
fetch('http://localhost:3000/products')
  .then(r => r.json())
  .then(d => console.log(d))

// Test GET by ID
fetch('http://localhost:3000/products/lap-001')
  .then(r => r.json())
  .then(d => console.log(d))

// Test POST
fetch('http://localhost:3000/categories', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ id: 'new-cat', name: 'New Category' })
})
```

## 📚 Files đã tạo/chỉnh sửa

```
✅ Created:
  - services/api.ts                 (API Service class)
  - hooks/useApi.ts                 (Custom hooks for data fetching)
  - server/db.json                  (Database file)
  - server/json-server-config.json  (JSON Server config)
  - .env.local                      (Environment variables)
  - API_GUIDE.md                    (Detailed documentation)

✏️ Modified:
  - package.json                    (Added npm scripts: api, dev)
```

## ⚠️ Lưu ý

1. **CORS**: JSON Server tự động bật CORS, nên không lo về lỗi CORS
2. **Port Conflict**: Nếu port 3000 hoặc 8081 đang dùng, chỉnh sửa:
   - Port API: Chỉnh `package.json` script `api`
   - Port Expo: Chỉnh `EXPO_PUBLIC_API_URL` trong `.env.local`
3. **Mobile**: Khi test trên device, thay `localhost` bằng IP của máy
4. **Production**: Này là development setup, cần migrate sang backend thật trước khi deploy

## 🎯 Next Steps

1. ✅ API Server chạy tại http://localhost:3000
2. ✅ Expo App chạy tại http://localhost:8081
3. 📄 Xem chi tiết tại [API_GUIDE.md](./API_GUIDE.md)
4. 💡 Customize database trong `server/db.json`
5. 🔧 Extend API service khi cần thêm endpoints

Happy coding! 🚀
