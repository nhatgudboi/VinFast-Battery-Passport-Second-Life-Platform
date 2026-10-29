# Tiêu Chí Nghiệm Thu (Acceptance Criteria)

## AC-01: Đăng nhập & Xác thực
- **Kịch bản thành công:** Nhập đúng email và mật khẩu $\to$ Trả về mã JWT Bearer thời hạn 60 phút, chuyển hướng vào Dashboard.
- **Kịch bản thất bại:** Nhập sai mật khẩu $\to$ Trả về mã HTTP 401 với thông điệp an toàn, không tiết lộ tài khoản có tồn tại hay không.

## AC-02: Kiểm định Pin & Tự Động Phân Luồng SoH
- **Khi kỹ thuật viên nhập:** Dung lượng đo được $25.46\text{ kWh}$ cho pin VF 5 Plus (Dung lượng chuẩn $37.23\text{ kWh}$).
- **Hệ thống tính toán:** $SoH = (25.46 / 37.23) \times 100 = 68.39\%$.
- **Hành động tự động:**
  - Cập nhật `current_soh_percent = 68.39` vào bảng `battery_packs`.
  - Cập nhật trạng thái thành `RECALL_PENDING`.
  - Ghi 1 bản ghi vào `audit_logs` với hành động `STATUS_CHANGE`.
  - Hiển thị badge màu đỏ cảnh báo trên giao diện xưởng.

## AC-03: Nhập Lô từ Excel
- Dung lượng file tối đa 10 MB, hỗ trợ đuôi `.xlsx`.
- Nếu có dòng sai mã model xe hoặc trùng Serial $\to$ Hiển thị danh sách dòng lỗi chi tiết, không lưu vào DB cho đến khi người dùng sửa hoặc xác nhận bỏ qua dòng lỗi.
