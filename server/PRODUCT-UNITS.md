# Mã riêng cho từng máy và bảo hành

Mỗi chiếc trong kho có một dòng trong `maytinh.product_units`. `code` là mã
bảo hành nội bộ dạng `BH-...`, được tạo ở server và có khóa chính chống trùng.
Đây không phải IMEI của nhà sản xuất. `manufacturerSerial` lưu S/N hoặc IMEI
thật mà nhân viên đọc trên tem máy; giá trị này cũng không được trùng.

## Sử dụng

1. Bật MySQL trong XAMPP, chạy `npm run backend` (khởi động lại nếu đang chạy).
2. Vào trang nhân viên → Kho hàng → **Mã máy / BH** cạnh sản phẩm.
3. Đối chiếu từng máy, nhập serial thật, bấm **Lưu serial**, dán mã BH lên máy.
4. Khi đặt hàng, server cấp đúng số mã theo số lượng trong cùng transaction
   trừ kho. Trong chi tiết đơn hàng của nhân viên có thể nhập serial của các
   máy được cấp cho chính đơn đó. Khi giao hàng phải lấy đúng máy theo mã.
5. Hóa đơn và chi tiết đơn hàng hiển thị tất cả mã. Khách dùng mã BH hoặc serial
   thật trên trang Bảo hành sau khi đơn đã giao tới hoặc hoàn tất.

`orders.items[].serialNumbers` lưu danh sách mã đã cấp; `serialNumber` giữ mã
đầu tiên để tương thích. API đọc đơn bổ sung `deviceUnits` từ bảng máy.
Hủy đơn/duyệt trả hàng giải phóng đúng máy đã cấp; mã trong lịch sử đơn vẫn giữ
nguyên. Đơn bị hủy không được trả về trong tra cứu bảo hành đang có hiệu lực.
Xuất kho thủ công đánh dấu mã `removed`; nhập thêm kho tạo thêm mã mới.
Sản phẩm đã có mã máy phải dùng tính năng ẩn để giữ lịch sử bảo hành.

## Dữ liệu cũ và cài đặt

Backend tự tạo bảng và bổ sung mã cho từng chiếc trong đơn cũ và kho hiện có,
không thay đổi số lượng tồn kho hoặc ngày bảo hành. Mã trên đơn cũ có
`unitCodeSource: backfill`; cần đối chiếu máy thật trước khi dùng làm tem.
`legacySerialNumber` giữ mã cũ để còn tra cứu được hóa đơn trước khi nâng cấp.
Chạy lại khởi tạo không đổi mã đã cấp.

Để chuyển dữ liệu thủ công kèm bản sao JSON của đơn trước khi chuyển:

```powershell
node server/migrate-product-units.js
```

Bản sao nằm trong `server/backups/` và đã được loại khỏi Git.
File `database.sql` có cấu trúc bảng để cài mới; khởi chạy backend để cấp mã.

## Kiểm tra

```powershell
node --test server/product-units.test.js
# Cần backend mới đang chạy trên port 5000:
node --test server/product-units-api.test.js
```

Kiểm tra MySQL dùng transaction rollback; kiểm tra API tạo dữ liệu thử có tên
riêng rồi xóa đúng các dữ liệu thử đó. Có thể đặt `UNIT_CODES_TEST_URL` để dùng
backend kiểm thử trên cổng khác.
