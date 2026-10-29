# Quy Tắc Nghiệp Vụ (Business Rules)

* **BR-01 (Công thức SoH):** Điểm sức khỏe pin luôn được làm tròn đến 2 chữ số thập phân: \(SoH = (Dung\_lượng\_đo / Dung\_lượng\_gốc) \times 100\).
* **BR-02 (Ngưỡng kích hoạt bảo hành đổi pin VinFast):** Nếu \(SoH < 70.00\%\), hệ thống tự động khóa trạng thái không cho gắn lại lên xe và bật cờ `RECALL_PENDING`.
* **BR-03 (Điều kiện tái sinh trạm sạc BESS):** Chỉ những pack pin có \(55.00\% \le SoH < 70.00\%\) và không bị hư hỏng cơ học (nứt vỏ, ngập nước) mới được phép phân bổ vào trạm sạc V-Green.
* **BR-04 (Bảo mật Hộ chiếu Pin QR):** Trang tra cứu công khai cho phép đọc thông số kỹ thuật và độ chai pin, nhưng tuyệt đối không hiển thị thông tin cá nhân của chủ sở hữu xe (tuân thủ Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân).
