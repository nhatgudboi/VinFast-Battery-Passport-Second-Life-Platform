# Tiêu Chí Nghiệm Thu Sản Phẩm (Acceptance Criteria) — VSF

> **Hệ thống:** Nền tảng Hộ chiếu Số & Quản trị Vòng đời Pin Xe Điện VinFast (VSF)  
> **Trạng thái:** TARGET V1 — PRODUCTION SPECIFICATION  
> **Quy chuẩn:** Ánh xạ 1-1 với 16 User Stories (US01 – US16), 24 REST API Endpoints chuẩn OpenAPI 3.0.4 và Cơ sở dữ liệu 13 bảng chuẩn DBML 2.0.

---

## 1. Nguyên Tắc & Phương Pháp Nghiệm Thu
Mỗi tiêu chí nghiệm thu (Acceptance Criteria - AC) được đặc tả chặt chẽ theo cấu trúc kịch bản kiểm thử hành vi BDD:
* **Given (Bối cảnh ban đầu):** Trạng thái dữ liệu hệ thống và quyền hạn người dùng trước khi thực hiện.
* **When (Hành động kích hoạt):** Thao tác cụ thể của người dùng hoặc sự kiện hệ thống gửi tới Backend API.
* **Then (Kết quả kỳ vọng):** Phản hồi API, sự thay đổi trạng thái trong Cơ sở dữ liệu và hiển thị trên giao diện người dùng.

---

## 2. Danh Mục 16 Tiêu Chí Nghiệm Thu Chi Tiết (AC-01 Đến AC-16)

### AC-01 (Ánh xạ US01) — Xác Thực Đăng Nhập & Cấp Quyền Truy Cập
* **Given:** Tài khoản người dùng tồn tại trong bảng `app_users` với trạng thái `is_active = true`.
* **When:** Người dùng gửi yêu cầu `POST /api/v1/auth/login` với đúng email và mật khẩu.
* **Then:**
  1. Backend xác thực mật khẩu bằng thuật toán PBKDF2 với muối ngẫu nhiên (salt).
  2. Trả về mã HTTP `200 OK` kèm Bearer JWT Token có thời hạn chính xác 60 phút và thông tin `userProfile` (id, email, fullName, role, workshopId).
  3. Ghi 1 bản ghi vào `audit_logs` với hành động `AUTH_LOGIN_SUCCESS`.
* **Edge Case (Đăng nhập thất bại):** Khi gửi sai mật khẩu hoặc tài khoản bị khóa (`is_active = false`), trả về mã HTTP `401 Unauthorized` với thông điệp an toàn chung: *"Thông tin đăng nhập không hợp lệ"*, tuyệt đối không tiết lộ tài khoản có tồn tại trong hệ sinh thái hay không.

---

### AC-02 (Ánh xạ US02) — Đăng Xuất An Toàn & Hủy Bỏ Phiên Làm Việc
* **Given:** Người dùng đang đăng nhập với JWT Token hợp lệ trên Frontend.
* **When:** Người dùng bấm nút "Đăng xuất" (`POST /api/v1/auth/logout`).
* **Then:**
  1. Frontend xóa sạch JWT Token khỏi LocalStorage / SessionStorage.
  2. Ghi nhận sự kiện `AUTH_LOGOUT` vào bảng `audit_logs` kèm IP máy trạm.
  3. Điều hướng người dùng về màn hình `SCR-01 Login`. Mọi yêu cầu gọi API sau đó sử dụng token cũ sẽ bị từ chối với mã HTTP `401 Unauthorized`.

---

### AC-03 (Ánh xạ US03) — Dashboard Tổng Quan Sức Khỏe Pin Mạng Lưới
* **Given:** Cơ sở dữ liệu quản lý các pack pin trên toàn quốc.
* **When:** Người dùng có quyền (`ADMIN`, `STATION_LEAD`, `TECHNICIAN`) truy cập `GET /api/v1/dashboard/summary`.
* **Then:**
  1. Trả về mã HTTP `200 OK` với dữ liệu tổng hợp tức thời:
     * `total_batteries`: Tổng số pack pin quản lý.
     * `active_on_vehicle`: Số pin đang gắn trên xe lăn bánh.
     * `warranty_recall_pending`: Số pin có SoH < 70% hoặc lỗi cell cần thu hồi.
     * `second_life_bess`: Số pin đang hoạt động tại cụm trạm BESS V-Green.
     * `soh_distribution`: Phân nhóm SoH theo 3 dải: Xanh (> 85%), Vàng (70% - 85%), Đỏ (< 70%).
  2. Nếu người dùng là `STATION_LEAD` hoặc `TECHNICIAN`, dữ liệu tự động được lọc (scoped) theo `workshop_id` của xưởng dịch vụ đó.

---

### AC-04 (Ánh xạ US04) — Sổ Quản Lý Pack Pin & Bộ Lọc Đa Chiều
* **Given:** Bảng `batteries` chứa hàng nghìn bản ghi pack pin.
* **When:** Người dùng gửi `GET /api/v1/batteries` kèm tham số tìm kiếm (query search, modelId, lifecycleStatus, workshopId, page, limit).
* **Then:**
  1. Hệ thống thực thi câu lệnh SQL có phân trang (Pagination: offset/limit) và lọc theo index `idx_batteries_serial_number`.
  2. Tự động loại trừ các bản ghi có `deleted_at IS NOT NULL` (Soft-delete).
  3. Thời gian phản hồi API trung bình dưới 100ms với tập dữ liệu 50.000 bản ghi.

---

### AC-05 (Ánh xạ US05) — Đăng Ký Pack Pin Mới Xuất Xưởng Từ VinES
* **Given:** Người dùng có quyền `ADMIN` đang ở màn hình `SCR-21`.
* **When:** Gửi yêu cầu `POST /api/v1/batteries` với thông tin: `serial_number`, `model_id`, `carbon_footprint_kg_co2`, `recycled_content_pct`.
* **Then:**
  1. Kiểm tra tính duy nhất: Nếu `serial_number` đã tồn tại, trả về mã HTTP `409 Conflict`.
  2. Khởi tạo 1 bản ghi trong bảng `batteries` với `lifecycle_status = 'MANUFACTURED'`.
  3. Khởi tạo đồng thời bản ghi Hộ chiếu số trong bảng `battery_passports` với mã QR URL: `https://vsf.vinfast.vn/passport/{serial_number}`.
  4. Trả về mã HTTP `201 Created` kèm đối tượng pin vừa tạo.

---

### AC-06 (Ánh xạ US06) — Quản Lý Gắn Kết Quan Hệ 1 - N Giữa Xe & Pin
* **Given:** Một chiếc xe VinFast định danh bằng số khung VIN (`vehicles`) và một pack pin mới (`batteries`).
* **When:** Thực hiện gắn pin vào xe lần đầu hoặc sau kiểm định (`POST /api/v1/vehicles/{vin}/assign-battery`).
* **Then:**
  1. Kiểm tra toàn vẹn: Quả pin phải đang ở trạng thái khả dụng (chưa bị gán cho xe khác và không ở trạng thái `RECYCLED`).
  2. Cập nhật `vehicles.current_battery_id = new_battery_id`.
  3. Thêm 1 dòng mới vào bảng `vehicle_battery_histories` với `installed_at = NOW()` và `removed_at = NULL`.
  4. Cập nhật `batteries.lifecycle_status = 'ON_VEHICLE'`.

---

### AC-07 (Ánh xạ US07) — Sinh Mã & In Tem Nhãn QR Hộ Chiếu Pin
* **Given:** Pack pin đã tồn tại trong hệ thống.
* **When:** Kỹ thuật viên yêu cầu in tem nhãn (`GET /api/v1/batteries/{id}/qr-label?format=svg&size=50x30`).
* **Then:**
  1. Hệ thống tự động sinh mã QR động chuẩn ISO/IEC 18004 chứa URL: `https://vsf.vinfast.vn/passport/{serial_number}`.
  2. Trả về định dạng ảnh Vector SVG hoặc PDF nhãn in kích thước chuẩn 50x30mm hoặc 70x40mm.
  3. Tem nhãn bao gồm: Logo VinFast chữ V mạ chrome, mã QR, chuỗi Serial dạng chữ lớn và thông số điện áp/dung lượng danh định.

---

### AC-08 (Ánh xạ US08) — Đo Kiểm Dung Lượng & Tự Động Tính Toán SoH
* **Given:** Pack pin VF 8 Plus (có dung lượng chuẩn danh định khóa cứng `nominal_capacity_ah = 240.0 Ah`).
* **When:** Kỹ thuật viên cắm máy quét OBD-II và nhập số đo dung lượng thực tế `measured_capacity_ah = 162.0 Ah`, nội trở và nhiệt độ (`POST /api/v1/inspections`).
* **Then:**
  1. Hệ thống tự động áp dụng công thức:
     $$\text{SoH} = \left(\frac{162.0}{240.0}\right) \times 100\% = 67.50\%$$
  2. Cập nhật `current_soh_percent = 67.50` vào bảng `batteries`.
  3. Lưu toàn bộ số đo thô vào bảng `battery_inspections`.
  4. Trả về kết quả đo kèm chỉ số SoH chính xác đến 2 chữ số thập phân.

---

### AC-09 (Ánh xạ US09) — Phát Hiện Lỗi Lệch Áp Cell & Kích Hoạt Đổi Pin Bảo Hành
* **Given:** Biên bản đo kiểm vừa được nhập với các thông số điện áp cell: $V_{\max} = 3.652\text{V}$ và $V_{\min} = 3.628\text{V}$ (hoặc trường hợp cell lỗi $V_{\min} = 3.580\text{V}$).
* **When:** Hệ thống chạy thuật toán chẩn đoán an toàn `DiagnosticsEngine.EvaluateSafety`.
* **Then:**
  1. Tự động tính chênh lệch điện áp cell: $\Delta V = V_{\max} - V_{\min}$.
  2. **Trường hợp 1 (Lệch cell nguy hiểm):** Nếu $\Delta V > 0.050\text{V}$ ($50\text{mV}$), hệ thống lập tức gán cờ `has_cell_fault = true`, kết luận `FAIL_CELL_VOLTAGE_FAULT`, cảnh báo đỏ nguy cơ thoát nhiệt bất kể SoH bao nhiêu.
  3. **Trường hợp 2 (Pin chai dung lượng):** Nếu $\text{SoH} < 70.00\%$, hệ thống gán kết luận `FAIL_WARRANTY_ELIGIBLE`.
  4. Tự động chuyển trạng thái quả pin sang `RECALL_PENDING`.
  5. Mở khóa nút *"Tạo Lệnh Đổi Pin Bảo Hành"* trên giao diện xưởng để Trưởng xưởng phê duyệt đổi miễn phí cho khách hàng.

---

### AC-10 (Ánh xạ US10) — Điều Phối Pack Pin Tái Sinh Trạm Tích Điện BESS
* **Given:** Pack pin đã thu hồi về kho xưởng, có kết quả kiểm định an toàn: $55.00\% \le \text{SoH} < 70.00\%$, không có lỗi cell ($\Delta V \le 0.050\text{V}$) và vỏ pin nguyên vẹn.
* **When:** Trưởng xưởng phê duyệt điều phối pin sang trạm sạc V-Green (`POST /api/v1/second-life/bess-allocations`).
* **Then:**
  1. Kiểm tra vị trí tủ rack: Trạm BESS chỉ định (`bess_stations`) còn slot trống.
  2. Tạo bản ghi mới trong bảng `bess_allocations`.
  3. Cập nhật `batteries.lifecycle_status = 'SECOND_LIFE_BESS'`.
  4. Tăng số lượng `active_pack_count` và `current_installed_kwh` của trạm BESS tương ứng.
  5. Đảm bảo ràng buộc toàn vẹn: Một pack pin không thể gán đồng thời vào 2 trạm BESS khác nhau (Unique constraint `battery_id`).

---

### AC-11 (Ánh xạ US11) — Thanh Lý & Chuyển Giao Tái Chế Nguyên Liệu Phế Liệu
* **Given:** Pack pin có $\text{SoH} < 55.00\%$ hoặc bị biến dạng vỏ/cháy hỏng vật lý sau tai nạn.
* **When:** Trưởng xưởng gửi biên bản thanh lý (`POST /api/v1/second-life/recyclings`).
* **Then:**
  1. Cập nhật `batteries.lifecycle_status = 'RECYCLED'`.
  2. Tạo bản ghi biên bản bàn giao trong bảng `battery_recyclings` với các thông số: khối lượng phế liệu ($kg$), đơn vị tiếp nhận (Nhà máy Thủy Luyện VinES Hải Phòng).
  3. Khóa vĩnh viễn quả pin: Hệ thống không cho phép thực hiện bất kỳ lệnh gắn xe hay tái sinh BESS nào đối với quả pin này nữa.

---

### AC-12 (Ánh xạ US12) — Nhập Lô Dữ Liệu Pin Xuất Xưởng Bằng File Excel
* **Given:** Quản trị viên tải tệp danh sách xuất xưởng từ VinES (`POST /api/v1/import/excel`).
* **When:** File Excel có định dạng `.xlsx`, dung lượng $\le 10\text{MB}$, số lượng bản ghi tối đa 5.000 dòng.
* **Then:**
  1. Hệ thống thực hiện kiểm tra sơ bộ (Pre-validation): Kiểm tra cấu trúc cột, kiểu dữ liệu và chống trùng lặp mã Serial.
  2. **Cơ chế giao dịch All-or-Nothing:** Nếu có bất kỳ dòng nào sai cú pháp hoặc trùng Serial trong DB $\rightarrow$ Hệ thống Rollback toàn bộ, trả về danh sách chi tiết các dòng lỗi (số dòng, tên cột, lỗi cụ thể).
  3. Nếu 100% dòng hợp lệ $\rightarrow$ Thực thi chèn hàng loạt (Bulk Insert) trong 1 Transaction duy nhất, tạo đồng thời bản ghi trong `import_batches`, `batteries` và `battery_passports`.

---

### AC-13 (Ánh xạ US13) — Cổng Tra Cứu Hộ Chiếu QR Công Khai Không Cần Đăng Nhập
* **Given:** Bất kỳ ai sử dụng camera điện thoại quét mã QR trên xe/pin (`GET /public/passport/{serialNumber}`).
* **When:** Yêu cầu gửi tới máy chủ Backend API.
* **Then:**
  1. **Không yêu cầu xác thực:** Endpoint hoàn toàn mở, không yêu cầu Bearer JWT Token.
  2. **Tối ưu tốc độ cao:** Phản hồi với thời gian $T < 50\text{ms}$ nhờ Partial Unique Index trên trường `serial_number`.
  3. **Ẩn danh dữ liệu cá nhân (Tuân thủ Nghị định 13/2023/NĐ-CP):** Trả về đầy đủ thông số kỹ thuật (SoH, Dấu chân Carbon, Tỷ lệ tái chế, lịch sử kiểm định), nhưng **tuyệt đối không trả về thông tin cá nhân của chủ xe** (họ tên, số điện thoại, CCCD). Biển số xe và số khung VIN được che giấu một phần (ví dụ: `VNF8A21P5PA00****`).

---

### AC-14 (Ánh xạ US14) — Xuất Báo Cáo & Chứng Nhận PDF Chuẩn EU 2023/1542
* **Given:** Pack pin đã có đầy đủ thông tin xuất xưởng và lịch sử kiểm định.
* **When:** Người dùng bấm xuất chứng nhận (`GET /api/v1/reports/passport/{serialNumber}/pdf`).
* **Then:**
  1. Máy chủ sử dụng thư viện kết xuất PDF chuẩn hóa quốc tế (QuestPDF) sinh file định dạng A4.
  2. Nội dung file bao gồm: Tem cờ EU, chứng nhận đạo luật pin EU 2023/1542, mã QR vector, bảng thông số phát thải Carbon ($gCO_2eq/kWh$), tỷ lệ vật liệu tái chế, biểu đồ lão hóa SoH qua các năm và mã hash SHA-256 xác thực chống làm giả tài liệu.
  3. Trả về Header `Content-Type: application/pdf` với mã HTTP `200 OK`.

---

### AC-15 (Ánh xạ US15) — Nhật Ký Kiểm Toán Bất Biến & Chống Gian Lận (Audit Trail)
* **Given:** Hệ thống đang vận hành các thao tác nghiệp vụ quan trọng.
* **When:** Bất kỳ thao tác nào sau đây diễn ra: Cập nhật SoH, đổi trạng thái vòng đời pin, gỡ pin cũ / gắn pin mới cho xe, duyệt chuyển pin sang BESS.
* **Then:**
  1. Hệ thống tự động ghi 1 bản ghi vào bảng `audit_logs` bao gồm: `user_id`, `action`, `entity_name`, `entity_id`, `old_values` (JSONB), `new_values` (JSONB), `ip_address` và `created_at = NOW()`.
  2. **Tính chất bất biến (Immutable):** Bảng `audit_logs` được thiết lập quyền chỉ ghi (Append-only). Không một ai (kể cả tài khoản có quyền `ADMIN`) có quyền cập nhật (`UPDATE`) hoặc xóa (`DELETE`) các bản ghi nhật ký kiểm toán này.

---

### AC-16 (Ánh xạ US16) — Quản Trị Phân Quyền Người Dùng Theo Vai Trò (RBAC)
* **Given:** Hệ sinh thái có 4 nhóm quyền độc lập: `ADMIN`, `STATION_LEAD`, `TECHNICIAN`, `AUDITOR`.
* **When:** Người dùng thực hiện gọi một API được bảo vệ.
* **Then:**
  1. Backend API kiểm tra Claim `Role` trong JWT Token.
  2. Nếu người dùng không đủ quyền truy cập (ví dụ: Kỹ thuật viên gọi API duyệt đổi pin của Trưởng xưởng hoặc API quản trị user của Admin) $\rightarrow$ Backend lập tức từ chối với mã HTTP `403 Forbidden` và cấu trúc lỗi chuẩn RFC 7807 ProblemDetails.
  3. Frontend tự động bắt mã 403 và chuyển hướng người dùng về trang thông báo lỗi `SCR-90 Forbidden`.

---

## 3. Ma Trận Nghiệm Thu Tính Toàn Vẹn Hệ Thống (System Integrity Verification)

| Mã AC | User Story | API Endpoint Chính | Bảng CSDL Tác Động | Tiêu Chuẩn Thành Công Cốt Lõi |
|:---:|:---:|---|---|---|
| **AC-01** | US01 | `POST /api/v1/auth/login` | `app_users`, `audit_logs` | JWT Bearer 60m, PBKDF2 salt hash |
| **AC-02** | US02 | `POST /api/v1/auth/logout` | `audit_logs` | Xóa token client, ghi nhận log |
| **AC-03** | US03 | `GET /api/v1/dashboard/summary` | `batteries`, `workshops` | KPIs thời gian thực, phân vùng xưởng |
| **AC-04** | US04 | `GET /api/v1/batteries` | `batteries` | Lọc đa chiều, phân trang, loại bỏ soft-delete |
| **AC-05** | US05 | `POST /api/v1/batteries` | `batteries`, `battery_passports` | Tạo pin + Hộ chiếu số, chống trùng Serial |
| **AC-06** | US06 | `POST /api/v1/vehicles/{vin}/assign-battery` | `vehicles`, `vehicle_battery_histories` | Quan hệ 1-N nguyên tử, gỡ cũ gắn mới |
| **AC-07** | US07 | `GET /api/v1/batteries/{id}/qr-label` | `batteries` | Sinh QR ISO/IEC 18004, tem in 50x30mm |
| **AC-08** | US08 | `POST /api/v1/inspections` | `battery_inspections`, `batteries` | Khóa cứng dung lượng chuẩn, tự tính SoH |
| **AC-09** | US09 | `POST /api/v1/inspections` | `batteries`, `battery_inspections` | Lệch cell $\Delta V > 0.05\text{V}$ hoặc SoH < 70% |
| **AC-10** | US10 | `POST /api/v1/second-life/bess-allocations`| `bess_allocations`, `bess_stations` | Phân luồng $55\% \le \text{SoH} < 70\%$ vào trạm BESS |
| **AC-11** | US11 | `POST /api/v1/second-life/recyclings` | `battery_recyclings`, `batteries` | Thanh lý pin chai $< 55\%$ về NM Thủy Luyện |
| **AC-12** | US12 | `POST /api/v1/import/excel` | `import_batches`, `batteries` | All-or-Nothing transaction, tối đa 5000 dòng |
| **AC-13** | US13 | `GET /public/passport/{serialNumber}` | `batteries`, `battery_passports` | Public, không cần token, phản hồi $< 50\text{ms}$ |
| **AC-14** | US14 | `GET /api/v1/reports/passport/{sn}/pdf` | `batteries`, `battery_passports` | QuestPDF khổ A4, mã hash SHA-256 chuẩn EU |
| **AC-15** | US15 | Hệ thống Background Middleware | `audit_logs` | Append-only bất biến, không cho sửa/xóa |
| **AC-16** | US16 | Tầng Middleware RBAC Authorization | Toàn bộ các endpoints | Chặn 403 Forbidden nếu không đúng vai trò |
