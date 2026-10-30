# Thiết Kế Mô Hình Dữ Liệu & Ràng Buộc Nghiệp Vụ (Data Model) — VSF

> **Dự án:** VSF — VinFast Battery Passport & Second-Life Platform  
> **Schema CSDL:** `vsf_core` (PostgreSQL 16)  
> **Trạng thái:** TARGET V1  
> **Tài liệu liên quan:** [DATABASE.md](DATABASE.md) · [schema.dbml](../src/database/schema.dbml)

---

## 1. Tổng Quan Kiến Trúc Cơ Sở Dữ Liệu

Mô hình dữ liệu của VSF được thiết kế theo chuẩn cơ sở dữ liệu quan hệ chuẩn hóa (3NF), tối ưu hóa cho 3 mục tiêu kỹ thuật cốt lõi:
1. **Tuân thủ quy định Hộ chiếu Pin EU 2023/1542:** Lưu trữ trọn vẹn dấu chân carbon vòng đời, tỷ lệ thu hồi kim loại tái chế (Coban, Niken, Liti) và mã hash toàn vẹn bất biến.
2. **Quản trị mối quan hệ 1-N hoán đổi giữa Xe điện và Pack Pin:** Một xe VinFast trong suốt vòng đời có thể trải qua nhiều đời pin (do bảo dưỡng hoặc đổi pin khi chai dưới 70%), và một pack pin có thể được luân chuyển qua nhiều phương tiện trước khi chuyển sang trạm lưu trữ đệm BESS.
3. **Hiệu năng tra cứu mã QR cực nhanh:** Sử dụng cấu trúc chỉ mục tối ưu (Partial Unique Index) cho phép người dùng di động quét tem nhãn QR và xem Hộ chiếu pin với thời gian phản hồi **dưới 50ms**.

---

## 2. Danh Mục Các Bảng Dữ Liệu (Tables Catalog)

| Tên Bảng | Khóa Chính | Mục Đích Nghiệp Vụ & Ràng Buộc Cốt Lõi |
| :--- | :--- | :--- |
| **`workshops`** | `id` (bigint) | Danh mục các Xưởng dịch vụ VinFast và Trạm sạc V-Green trên toàn quốc. Chứa mã định danh duy nhất (`code`), địa chỉ, tọa độ GPS. |
| **`app_users`** | `id` (bigint) | Tài khoản nhân sự nội bộ (Admin HQ, Trưởng xưởng, KTV). Liên kết xưởng dịch vụ trực thuộc, mã nhân viên VinFast (`staff_code`), mã hóa mật khẩu BCrypt. |
| **`batteries`** | `id` (bigint) | Thực thể pack pin vật lý. Định danh duy nhất bằng `serial_number`, quản lý dung lượng thiết kế, công nghệ cell (LFP/NMC), SoH hiện tại, số chu kỳ sạc và trạng thái vòng đời. |
| **`battery_passports`** | `id` (bigint) | Hộ chiếu số hóa chuẩn EU. Liên kết 1-1 duy nhất với `batteries`, lưu URL mã QR, dấu chân Carbon (`kg CO2 eq/kWh`), tỷ lệ tái chế Co/Ni/Li, chứng nhận UN 38.3. |
| **`vehicles`** | `id` (bigint) | Xe điện VinFast thương mại. Định danh bằng số VIN 17 ký tự chuẩn quốc tế (`vin`), biển số xe, chủ sở hữu, và liên kết 1-1 với pack pin đang gắn hiện tại (`current_battery_id`). |
| **`vehicle_battery_histories`** | `id` (bigint) | Bảng lịch sử 1-N ghi nhận mọi lần lắp vào/tháo ra của từng pack pin trên từng xe; lưu ODO xe, SoH pin tại thời điểm hoán đổi, thời gian và KTV phụ trách. |
| **`battery_inspections`** | `id` (bigint) | Nhật ký đo kiểm chẩn đoán định kỳ tại xưởng: Dung lượng thực đo ($C_{\text{measured}}$), SoH, nội trở, điện áp min/max của cell, độ lệch $\Delta V$, phát hiện lỗi cell. |
| **`battery_swap_orders`** | `id` (bigint) | Lệnh phê duyệt thay thế pin mới khi pin cũ có $\text{SoH} < 70\%$ hoặc có cell bị lệch áp nghiêm trọng. Yêu cầu chữ ký số / xác nhận của Trưởng Xưởng. |
| **`bess_stations`** | `id` (bigint) | Cụm trạm sạc tích điện đệm V-Green BESS: Công suất thiết kế (kWh), công suất thực tế đã lắp, số lượng khe cắm rack container. |
| **`bess_allocations`** | `id` (bigint) | Ghi nhận việc ghép nối pack pin $55-70\%$ vào vị trí slot cụ thể trong tủ rack container trạm sạc BESS. |
| **`battery_recyclings`** | `id` (bigint) | Bàn giao xử lý cuối vòng đời (End-of-Life) cho đối tác luyện kim thu hồi Black Mass (Niken, Coban, Liti). Chốt đóng vĩnh viễn hộ chiếu pin. |
| **`import_batches`** | `id` (bigint) | Lịch sử các đợt nhập dữ liệu hàng loạt bằng file Excel từ các nhà máy sản xuất VinES Hải Phòng / Hà Tĩnh. |
| **`audit_logs`** | `id` (bigint) | Nhật ký kiểm toán bất biến ghi nhận toàn bộ các thao tác thêm, sửa, đổi pin, duyệt BESS, xuất báo cáo kèm Diff JSON Before/After. |

---

## 3. Các Quy Tắc Nghiệp Vụ Cốt Lõi (Business Integrity Rules)

### 3.1 Thuật Toán Đo Kiểm Sức Khỏe Pin (SoH) & Lỗi Cell
* **Công thức xác định độ chai pin:**
  $$\text{SoH (\%)} = \left( \frac{C_{\text{measured}}}{C_{\text{nominal}}} \right) \times 100$$
* **Công thức xác định độ lệch điện áp cell:**
  $$\Delta V = V_{\text{max}} - V_{\text{min}}$$
* **Quy tắc phân loại tự động tại máy đo xưởng:**
  1. *Đạt chuẩn First-Life:* Khi $\text{SoH} \ge 70.00\%$ **VÀ** $\Delta V \le 0.050\text{V}$. Kết luận: `PASS_FIRST_LIFE`.
  2. *Chai dung lượng dưới ngưỡng:* Khi $\text{SoH} < 70.00\%$ nhưng $\Delta V \le 0.050\text{V}$. Kết luận: `FAIL_DEGRADED_SOH` $\implies$ Kích hoạt quy trình đổi pin mới; chuyển pin cũ về kho tái sinh BESS nếu $\text{SoH} \ge 55.00\%$.
  3. *Lỗi lệch áp cell nguy hiểm (Cell Fault):* Khi $\Delta V > 0.050\text{V}$ (bất kể SoH cao hay thấp). Hệ thống lập tức gán cờ `has_cell_fault = true`, kết luận `FAIL_CELL_VOLTAGE_FAULT` $\implies$ Lập tức dừng xe, cách ly pack pin, kích hoạt lệnh đổi pin khẩn cấp vì nguy cơ mất an toàn nhiệt.

### 3.2 Quy Tắc Tính Toàn Vẹn Của Quan Hệ 1-N (Xe & Pin)
* Tại một thời điểm bất kỳ, một chiếc xe điện (`vehicles`) chỉ có tối đa **1 pack pin duy nhất** đang được gắn (`current_battery_id`), thể hiện qua ràng buộc `UNIQUE (current_battery_id)`.
* Khi thực hiện lệnh đổi pin mới (`battery_swap_orders`):
  1. Hệ thống cập nhật bản ghi trong `vehicle_battery_histories` của quả pin cũ: set `removed_at = NOW()`, ghi nhận ODO xe lúc tháo.
  2. Cập nhật `vehicles.current_battery_id = new_battery_id`.
  3. Tạo bản ghi mới trong `vehicle_battery_histories` cho quả pin mới: set `installed_at = NOW()`, `removed_at = NULL`.
  4. Cập nhật trạng thái của pin cũ trong bảng `batteries` sang `RETIRED_FROM_VEHICLE` hoặc `SECOND_LIFE_BESS`.

---

## 4. Cơ Chế Xóa Mềm (Soft Delete Policy)

Hệ thống áp dụng cơ chế Xóa Mềm (Soft Delete) đối với các bảng thực thể quan trọng (`batteries`, `app_users`):
* Sử dụng cột `deleted_at timestamptz NULL`.
* Các truy vấn hoạt động mặc định chỉ đọc các bản ghi còn hiệu lực: `WHERE deleted_at IS NULL`.
* Thao tác xóa mềm được thực hiện bằng lệnh `UPDATE ... SET deleted_at = NOW()`, đồng thời ghi nhận vào `audit_logs` với hành động `SOFT_DELETE`.
* Cho phép Quản trị viên phục hồi bản ghi (`RESTORE`) bằng cách set `deleted_at = NULL`.

---

## 5. Tiêu Chuẩn Bảo Mật & Ẩn Danh Dữ Liệu Kiểm Toán (SEC-AUDIT-001)

Theo quy định kiểm toán EU và Luật An toàn Dữ liệu:
1. **Tuyệt đối không lưu trữ thông tin nhạy cảm** trong cột `old_values_json` và `new_values_json` của bảng `audit_logs`.
2. Danh sách các trường bắt buộc bị loại bỏ (Redacted) tự động trước khi ghi log:
   - `password_hash`
   - `jwt_tokens`, `refresh_tokens`
   - `private_keys`, `signing_secrets`
3. Dữ liệu công khai khi người dùng quét mã QR (`SCR-02`) tuyệt đối **không để lộ thông tin định danh cá nhân (PII)** của chủ xe (Tên khách hàng, Số điện thoại và Số khung VIN xe được ẩn danh hoàn toàn theo tiêu chuẩn GDPR).

---

## 6. Ranh Giới Giao Dịch Cơ Sở Dữ Liệu (Transaction Boundaries)

Mọi biến động dữ liệu quan trọng đều được bao bọc trong một Database Transaction (`BEGIN ... COMMIT`) để đảm bảo tính nguyên tử (Atomicity):

| Nghiệp Vụ | Ranh Giới Giao Dịch (Transaction Scope) | Cam Kết Tính Toàn Vẹn |
| :--- | :--- | :--- |
| **Phê duyệt Đổi Pin Mới** | Cập nhật `swap_orders`, gỡ pin cũ khỏi `vehicles`, gắn pin mới, cập nhật 2 bản ghi `vehicle_battery_histories`, đổi trạng thái 2 pack pin trong `batteries`, ghi `audit_logs`. | Tất cả thành công hoặc toàn bộ Rollback; không bao giờ xảy ra tình trạng 1 xe gắn 2 pin hoặc pin bị mất vết. |
| **Nhập File Excel VinES** | Kiểm tra toàn bộ file; nếu có lỗi định dạng $\implies$ dừng lại và trả về lỗi; nếu hợp lệ $\implies$ tạo `import_batches`, insert toàn bộ danh sách `batteries` và `battery_passports` tương ứng. | Cam kết Atomic Import: Tối đa 5,000 pack pin trong một giao dịch duy nhất. |
| **Điều Phối Pin Sang BESS** | Kiểm tra điều kiện $55\% \le \text{SoH} < 70\%$, gán `bess_allocations`, tăng `active_pack_count` và `current_installed_kwh` của `bess_stations`, đổi trạng thái pin sang `SECOND_LIFE_BESS`. | Ngăn ngừa việc cùng 1 pack pin được gán trùng vào 2 trạm BESS khác nhau (Unique constraint `battery_id`). |

---

## 7. Dữ Liệu Mẫu Khởi Tạo (Seed Data)

### 7.1 Tài Khoản Người Dùng Mẫu (Demo Users)
* **Quản trị viên HQ:** `admin.hq@vinfast.vn` (Vai trò: `ADMIN_HQ`, Toàn quyền hệ thống).
* **Trưởng xưởng Long Biên:** `lead.longbien@vinfast.vn` (Vai trò: `STATION_LEAD`, Xưởng: VinFast Long Biên).
* **Trưởng trạm V-Green BESS:** `lead.vgreen@v-green.vn` (Vai trò: `STATION_LEAD`, Phụ trách cụm BESS).
* **Kỹ thuật viên đo kiểm:** `tech.an@vinfast.vn` (Vai trò: `TECHNICIAN`, Thao tác đo chẩn đoán).
* **Kiểm toán viên EU:** `auditor.tuv@tuv-sud.de` (Vai trò: `AUDITOR_PUBLIC`, Tra cứu xác thực).

### 7.2 Thông Số Pack Pin Các Dòng Xe VinFast Chuẩn Hóa
* **VF 3:** 18.64 kWh (LFP), 180V, 185 kg, Nhà máy VinES Hà Tĩnh.
* **VF 5 Plus:** 37.23 kWh (LFP), 340V, 320 kg, Nhà máy VinES Hải Phòng.
* **VF 6:** 59.60 kWh (LFP), 380V, 430 kg, Nhà máy VinES Hải Phòng.
* **VF 7:** 75.30 kWh (NMC), 400V, 490 kg, Nhà máy VinES Hải Phòng.
* **VF 8:** 87.70 kWh (NMC), 400V, 550 kg, Dấu chân Carbon: 72.50 kg CO2 eq/kWh.
* **VF 9:** 123.00 kWh (NMC), 450V, 710 kg, Dấu chân Carbon: 78.20 kg CO2 eq/kWh.
* **VF e34:** 42.00 kWh (LFP), 350V, 360 kg, Tiên phong chính sách đổi pin thương mại.
