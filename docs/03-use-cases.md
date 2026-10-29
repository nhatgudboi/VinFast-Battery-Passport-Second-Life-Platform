# Actors, Vai Trò và Ca Sử Dụng (Use Cases)

## 1. Các Tác Nhân (Actors)

* **Administrator (Quản trị viên VinFast):** Ban hành chính sách pin, cấu hình ngưỡng bảo hành, quản lý tài khoản xưởng dịch vụ toàn quốc.
* **Station Lead (Trưởng xưởng dịch vụ / Trưởng trạm V-Green):** Phê duyệt lệnh đổi pin mới, phê duyệt đưa pin vào trạm tích điện BESS, nhập file Excel từ nhà máy.
* **Technician (Kỹ thuật viên đo kiểm):** Đo đạc dung lượng, nội trở, nhiệt độ pin trong các đợt bảo dưỡng, in tem mã QR dán lên pack pin.
* **Auditor / Public User (Kiểm toán viên EU / Khách quét QR):** Quét mã QR tra cứu lý lịch quả pin, tải chứng chỉ PDF xác thực.

## 2. Ma trận Phân quyền (RBAC Matrix)

| Quyền hạn | Administrator | Station Lead | Technician | Auditor / Public |
|---|:---:|:---:|:---:|:---:|
| Xem Dashboard & Tra cứu Pin | Có | Có | Có | Có (Chỉ xem) |
| Nhập kết quả kiểm định SoH | Có | Có | Có | Không |
| Phê duyệt Thu hồi đổi pin (<70%) | Có | Có | Không | Không |
| Điều phối Pin vào Trạm sạc BESS | Có | Có | Không | Không |
| Import lô pin từ Excel | Có | Có | Không | Không |
| In tem nhãn QR & Xuất PDF | Có | Có | Có | Có |
| Xem Audit Log | Có | Có | Không | Không |
| Quản lý tài khoản User | Có | Không | Không | Không |

## 3. Luồng Nghiệp Vụ Cốt Lõi (Business Flows)

### Flow 1: Kiểm định Pin & Đổi pin miễn phí
1. Xe VinFast (ví dụ VF 5 taxi Xanh SM) vào xưởng dịch vụ bảo dưỡng định kỳ.
2. Kỹ thuật viên quét mã QR trên pin hoặc nhập biển số xe để mở hồ sơ pin.
3. Kỹ thuật viên cắm máy chẩn đoán, nạp số liệu: Dung lượng đo thực tế, chu kỳ sạc, nội trở.
4. Hệ thống tính: \(SoH = (Dung lượng thực / Dung lượng thiết kế) \times 100%\).
5. Nếu \(SoH < 70%\): Hệ thống tự động chuyển trạng thái pin sang `RECALL_PENDING`, gửi thông báo đến Trưởng xưởng để xuất kho pin mới đổi cho khách hàng.

### Flow 2: Tái sinh Vòng đời thứ hai (Second-Life BESS)
1. Pack pin thu hồi có SoH từ 55% đến 69.9% được kiểm tra độ an toàn tế bào.
2. Trưởng xưởng mở module Second-Life, chọn các pack pin đủ tiêu chuẩn.
3. Phân bổ các pack pin vào tủ rack của Trạm sạc cao tốc V-Green (ví dụ: `VGREEN-BESS-PV-01`).
4. Hệ thống cập nhật trạng thái pin thành `SECOND_LIFE_BESS`, kết thúc vòng đời chạy xe và bắt đầu vòng đời lưu trữ điện đệm.
