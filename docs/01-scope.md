# Phạm Vi Dự Án — VSF (VinFast Battery Passport & Second-Life)

> Trạng thái thiết kế: **TARGET V1**  
> Đối tượng áp dụng: Hệ sinh thái xe điện VinFast (VF 3, VF 5, VF 6, VF 7, VF 8, VF 9)

Tên sản phẩm: **VSF (VinFast Smart Fleet & Battery Passport)**.

## 1. Vấn đề thực tế (Problem Statement)

Ngành công nghiệp xe điện toàn cầu và VinFast đang đối mặt với 3 thách thức lớn:
1. **Tuân thủ đạo luật Pin Liên minh Châu Âu (EU Battery Regulation 2023/1542):** Bắt buộc mọi xe điện lưu hành tại EU (như VF 8, VF 9) từ năm 2026 phải có Digital Battery Passport lưu trữ nguồn gốc khoáng sản, độ phát thải carbon và lịch sử sức khỏe pin.
2. **Nghĩa vụ bảo hành & đổi pin miễn phí theo hợp đồng thuê pin VinFast:** VinFast cam kết khi pin bị chai dưới 70% (SoH < 70%), khách hàng được thu hồi và đổi pin mới miễn phí. Cần một hệ thống đo đạc đồng bộ giữa các xưởng dịch vụ để xác thực quyền lợi, tránh tranh chấp.
3. **Bài toán Second-Life (Vòng đời thứ hai):** Thay vì tiêu hủy hàng chục nghìn pack pin thu hồi gây ô nhiễm môi trường, VinFast liên doanh với Marubeni để tái sinh pin có SoH từ 55% - 70% thành các trạm tích điện đệm (BESS) cho hệ thống trạm sạc V-Green.

## 2. Mục tiêu Target V1

Hệ thống VSF V1 đáp ứng:
- **Đăng nhập & Xác thực an toàn (REST API + JWT Bearer)**: Phân quyền theo 4 vai trò (Admin, Trưởng xưởng, Kỹ thuật viên, Kiểm toán viên).
- **Dashboard Trung tâm (KPIs & Biểu đồ)**: Thống kê số lượng pin toàn mạng lưới, phân bố SoH, cảnh báo pin sắp chạm ngưỡng 70%.
- **Sổ Quản lý Pack Pin (Battery Registry)**: Lưu trữ hồ sơ định danh duy nhất (Serial/QR), dòng xe, hóa học pin (LFP/NMC), số chu kỳ sạc, quãng đường di chuyển.
- **Quy trình Đo kiểm & Đánh giá Sức khỏe (Inspection & SoH Calculation)**: Kỹ thuật viên nhập số liệu đo đạc, hệ thống tự động tính SoH và phân luồng trạng thái.
- **Điều phối Tái sinh Second-Life BESS**: Phân bổ pin thu hồi vào các tủ rack lưu trữ tại trạm sạc V-Green.
- **Nhập dữ liệu hàng loạt từ Excel**: Đọc danh sách pin mới xuất xưởng từ nhà máy VinES với tính năng xem trước và báo lỗi từng dòng.
- **Cổng Quét QR Công Khai (Public Mobile Battery Passport)**: Bất kỳ ai quét mã QR trên vỏ pin đều tra cứu được nguồn gốc, độ chai pin và tải Giấy chứng nhận PDF đạt chuẩn EU.
- **Lưu vết Kiểm toán (Audit Logs)**: Ghi vết bất biến mọi hành động kiểm định và thay đổi trạng thái pin.

## 3. Giới hạn ngoài phạm vi (Non-goals)

- Không kết nối IoT trực tiếp qua mạng viễn thông gắn trên xe (Telematics thời gian thực).
- Không quản lý mua bán phụ tùng, động cơ hay bảo dưỡng khung gầm xe.
- Không tích hợp cổng thanh toán trực tuyến tiền thuê pin.
