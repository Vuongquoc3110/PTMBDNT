# Nhật ký phát triển

## 2026-09-22

### Giao diện mobile

- Tách header mobile thành hai tầng: logo/nút thao tác và ô tìm kiếm.
- Tối ưu trang chủ cho điện thoại:
  - Hero chuyển sang bố cục dọc.
  - Sản phẩm hiển thị dạng lưới 2 cột.
  - Điều chỉnh khoảng cách, kích thước chữ và banner khuyến mãi.
- Tối ưu trang danh sách sản phẩm mobile:
  - Thanh tìm kiếm và sắp xếp xếp dọc.
  - Bộ lọc danh mục hiển thị dạng 2 cột.
  - Thẻ sản phẩm có ảnh và nội dung gọn hơn.
- Giữ nguyên bố cục và trải nghiệm giao diện PC.

### Sửa lỗi React Native Web

- Xử lý lỗi `Failed to set an indexed property [0] on CSSStyleDeclaration`.
- Flatten các mảng style trước khi truyền vào `Link` của Expo Router.
- Cập nhật các component có `Link asChild` và `Pressable` để tránh truyền mảng style xuống thẻ HTML `<a>`.

### Kiểm tra

- Đã chạy kiểm tra TypeScript:

```powershell
npm.cmd exec tsc -- --noEmit
```

- Kết quả: không có lỗi TypeScript.

### Chạy lại dự án

Chạy lệnh từ thư mục gốc dự án:

```powershell
cd "C:\Users\HP\appW33\appW33"
npx expo start -c
```
