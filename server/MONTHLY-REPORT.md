# Báo cáo tháng

Trang quản trị → **Báo cáo tháng**. Bấm **Tháng** và **Năm** để chọn kỳ (năm 2000 đến năm hiện tại), hoặc bấm mũi tên để chuyển tháng; có thể tìm sản phẩm/danh mục.

Theo xác nhận mới của người dùng, 123 đơn đã tạo từ 2024–2026 được dùng trong danh sách và báo cáo chung cùng các đơn mua hàng. Giữ nguyên mã `DEMO-REPORT-*` và thông tin nguồn tạo; không đổi chúng thành các giao dịch được xác minh. Giao diện không còn ô bật/tắt đơn mẫu.

Các ô tổng hợp hiển thị tổng đơn trong tháng (mọi trạng thái), đơn hoàn thành, số sản phẩm bán và tiền hàng đã bán. Số liệu tồn đầu tháng 10/2026 vẫn giữ nguyên 100 cho mỗi sản phẩm.

## Nhập tồn đầu tháng

Sửa cột **Tồn đầu** của sản phẩm rồi bấm **Lưu**, hoặc nhập số lượng ở thanh trên bảng để áp dụng cho các sản phẩm đang hiển thị (sau tìm kiếm). Dữ liệu lưu trong `monthly_inventory_openings`, theo tháng và mã sản phẩm, kèm người cập nhật. Chỉ quản trị viên được sửa. Nhập tồn đầu không sửa tồn hiện tại, không tự tạo nhập/xuất cho phần lịch sử thiếu.

Theo xác nhận của người dùng, tháng 10/2026 có tồn đầu 100 cho mỗi sản phẩm trong 326 sản phẩm hiện tại. Các giá trị này đã được lưu vào `database.sql` và `monthly-openings.sql`; file nhập riêng không ghi đè số liệu đã lưu.

- Số bán: tổng số lượng trong các đơn `completed`, theo `createdAt` ở GMT+7. Loại đơn trả hàng đã được duyệt.
- Tiền hàng: số lượng nhân đơn giá đã lưu trong đơn, trước voucher, không gồm vận chuyển. Đây không phải doanh thu thuần.
- Danh mục: danh mục hiện tại của sản phẩm. Sản phẩm đã xóa vẫn có số bán, được ghi rõ trong báo cáo.
- Tồn đầu: tồn lúc 00:00 ngày đầu tháng. Tồn cuối: tồn trước 00:00 ngày đầu tháng sau; tháng hiện tại chốt đến thời điểm tải báo cáo.
- Nhập/xuất: mọi tăng/giảm `products.stock`, gồm đặt hàng, hoàn kho và điều chỉnh. Số xuất kho có thể khác số bán vì đơn được trừ kho khi đặt nhưng chỉ tính bán khi hoàn thành.
- Tồn chưa có lịch sử hiển thị `—`, không suy đoán từ đơn hàng. Kỳ bắt đầu theo dõi giữa tháng chưa xác định được tồn đầu; nhập/xuất kỳ đó là dữ liệu một phần. Đơn mẫu không làm thay đổi tồn kho.

## Cài đặt

Khởi động lại backend bằng `npm run backend`. Backend tự tạo hai bảng và hai trigger từ `monthly-report.sql`, đồng thời ghi mốc tồn hiện tại. Tài khoản MySQL cần quyền tạo bảng và trigger.

`database.sql` đã chứa schema báo cáo cho lần cài mới. Không cần nhập riêng `monthly-report.sql` sau khi nhập bản `database.sql` mới. Không nhập lại toàn bộ CSDL để nâng cấp hệ thống đang có; dùng bước khởi động backend ở trên để giữ nguyên dữ liệu.

Kiểm thử: `node --test server/monthly-report.test.js`.
