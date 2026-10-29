# Mô Hình Dữ Liệu & Ràng Buộc Nghiệp Vụ (Data Model)

## 1. Thực Thể Cốt Lõi

1. **`battery_models`**: Định danh các dòng xe & thông số pin VinFast gốc (VF3: 18.64 kWh LFP, VF5: 37.23 kWh LFP, VF8: 87.7 kWh NMC, VF9: 123 kWh NMC).
2. **`battery_packs`**: Trái tim của hệ thống. Mỗi bản ghi đại diện cho 1 quả pin vật lý với mã Serial/UUID duy nhất, gắn với mã QR Hộ chiếu số.
3. **`battery_inspections`**: Lưu vết mọi lần xe vào xưởng đo dung lượng. Một quả pin có thể có nhiều lần kiểm định theo thời gian.
4. **`second_life_deployments`**: Lưu vết các pack pin đã thu hồi được tái sử dụng tại các trạm sạc V-Green BESS.
5. **`import_batches`**: Ghi nhận các đợt nhập dữ liệu hàng loạt bằng file Excel từ nhà máy VinES.
6. **`audit_logs`**: Ghi vết kiểm toán bất biến (Ai làm gì, vào thời điểm nào, dữ liệu trước và sau khi thay đổi).
7. **`app_users`**: Danh sách kỹ thuật viên, trưởng xưởng và quản trị viên hệ thống.

## 2. Công Thức & Quy Tắc Nghiệp Vụ

* **Công thức tính Độ chai pin (State of Health - SoH):**
  \[
  \text{SoH (\%)} = \frac{\text{measured\_capacity\_kwh}}{\text{design\_capacity\_kwh}} \times 100
  \]
* **Quy tắc Phân luồng Vòng đời:**
  * \(\text{SoH} \ge 70.00\%\): Pin đạt chuẩn, trạng thái `ON_VEHICLE`.
  * \(\text{SoH} < 70.00\%\): Tự động chuyển `RECALL_PENDING` (Kích hoạt đổi pin miễn phí theo hợp đồng thuê pin).
  * \(55.00\% \le \text{SoH} < 70.00\%\): Đủ điều kiện chuyển đổi sang `SECOND_LIFE_BESS`.
  * \(\text{SoH} < 55.00\%\) hoặc hỏng cell vật lý: Chuyển sang `RECYCLED` để thu hồi lithium/cobalt.
