# Tài Liệu Đặc Tả Giao Diện Lập Trình (VSF API Documentation)

> **Dự án:** VSF — VinFast Battery Passport & Second-Life Platform  
> **Trạng thái:** TARGET V1 (Thiết kế hoàn thiện hợp đồng OpenAPI 3.0.4)  
> **Tệp hợp đồng nguồn:** [docs/api/openapi.yaml](openapi.yaml)

---

## 1. Tổng Quan Kiến Trúc API

Tài liệu này xác lập hợp đồng giao tiếp chuẩn hóa (API Contract) giữa tầng **Web Frontend (React 19 / Mobile QR Portal)** và tầng **Backend (ASP.NET Core Web API / PostgreSQL 16)** của Nền tảng Hộ chiếu Số & Quản trị Vòng đời Pin Xe Điện VinFast.

Mọi đặc tả về đường dẫn HTTP, phương thức, cấu trúc Request/Response, cơ chế phân quyền RBAC và mã lỗi nghiệp vụ chuẩn RFC 7807 đều lấy `openapi.yaml` làm **Nguồn Chân Lý Duy Nhất (Single Source of Truth)**.

---

## 2. Phạm Vi Nghiệp Vụ Của API (API Scope)

1. **Authentication & Profile:** Đăng nhập VinFast SSO/JWT, quản lý phiên, xem hồ sơ cá nhân và đổi mật khẩu.
2. **Dashboard & Fleet Analytics:** Tổng hợp KPIs vòng đời, phân bố sức khỏe SoH toàn mạng lưới và cảnh báo khẩn cấp lệch áp cell ($\Delta V > 0.05\text{V}$).
3. **Batteries & Passports:** Quản lý danh mục pack pin vật lý, khởi tạo Hộ chiếu số đạt chuẩn Châu Âu (EU 2023/1542), xuất tem nhãn QR nhiệt 100x75mm.
4. **Vehicles & 1-N Timeline:** Quản lý số VIN xe điện VinFast và truy vết lịch sử hoán đổi đa kỳ giữa xe và pin.
5. **Diagnostics & Inspections:** Nhập thông số đo đạc thực tế ($C_{\text{measured}}$, $V_{\text{max}}$, $V_{\text{min}}$, $\Delta V$, nội trở, nhiệt độ) và tự động kích hoạt logic đổi pin.
6. **Battery Swap Workflow:** Quy trình phê duyệt thay thế pack pin mới có chữ ký số xác nhận của Trưởng Xưởng Dịch Vụ.
7. **Second-Life BESS & Recycling:** Điều phối pin $55-70\%$ vào trạm sạc tích điện đệm V-Green BESS và bàn giao tiêu hủy thu hồi Black Mass.
8. **Batch Excel Import:** Tiếp nhận và phân tích nguyên tử tệp Excel lô pack pin xuất xưởng từ nhà máy VinES.
9. **Public QR Passport Portal:** Cổng tra cứu Hộ chiếu Pin công khai trên di động (không cần login) và tải file PDF có xác thực số.
10. **Governance & Audit Trail:** Truy vấn nhật ký kiểm toán bất biến theo tiêu chuẩn an toàn `SEC-AUDIT-001`.

---

## 3. Máy Chủ & Cấu Hình Base URL

- **Môi trường phát triển cục bộ (Local):** `http://localhost:5000/api/v1`
- **Môi trường Gateway Đám mây (Production):** `https://api.passport.vinfast.vn/api/v1`

---

## 4. Xác Thực & Cơ Chế Phân Quyền (Authentication & RBAC)

Hệ thống sử dụng cơ chế xác thực **Bearer JWT**:
```http
Authorization: Bearer <YOUR_ACCESS_TOKEN>
```

- **Thời hạn Token:** Access Token có hiệu lực trong 30 phút.
- **Ngoại lệ Public (Không cần token):** Cổng tra cứu Hộ chiếu pin di động `/public/passport/{serialNumber}` và endpoint đăng nhập `/auth/login` được gắn cờ `security: []`.
- **Ma trận phân quyền (RBAC Tags):** Mỗi endpoint nghiệp vụ trong `openapi.yaml` được gắn thuộc tính `x-roles` chỉ định rõ ràng các vai trò được phép truy cập:
  - `ADMIN_HQ`: Toàn quyền quản trị hệ thống, nhập lô Excel, quản lý người dùng, xóa mềm pack pin.
  - `STATION_LEAD`: Phê duyệt lệnh đổi pin mới, điều phối pin vào trạm BESS, ký biên bản bàn giao tái chế.
  - `TECHNICIAN`: Thao tác đo chẩn đoán dung lượng, tạo yêu cầu đổi pin, in tem nhãn QR vật lý tại xưởng.
  - `AUDITOR_PUBLIC`: Tra cứu thông tin hộ chiếu công khai, tải chứng nhận kiểm định PDF.

---

## 5. Định Dạng Nội Dung (Content-Types)

- `application/json`: Định dạng mặc định cho mọi request và response thành công.
- `application/problem+json`: Định dạng bắt buộc cho tất cả các thông báo lỗi (RFC 7807).
- `multipart/form-data`: Dành cho thao tác tải lên tệp Excel lô pin (`.xlsx`) tại `/imports/preview` và `/imports/commit`.
- `application/pdf`: Luồng nhị phân tải Giấy Chứng Nhận Kiểm Định Pin Đạt Chuẩn EU tại `/public/passport/{serialNumber}/certificate.pdf`.

---

## 6. Quy Ước Phân Trang Chuẩn (Pagination Contract)

Mọi danh sách dữ liệu có số lượng lớn đều áp dụng phân trang thống nhất:
- `page`: Bắt đầu từ `1` (Mặc định: `1`).
- `pageSize`: Mặc định `20`, tối đa `100` bản ghi/trang.
- Cấu trúc đối tượng phân trang:
```json
{
  "items": [ ... ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 142,
    "totalPages": 8
  }
}
```

---

## 7. Tiêu Chuẩn Xử Lý Lỗi (Problem Details — RFC 7807)

Mọi phản hồi lỗi đều tuân thủ định dạng `application/problem+json` với cấu trúc nhất quán:
```json
{
  "type": "https://errors.vinfast.vn/VALIDATION_FAILED",
  "title": "Validation Failed",
  "status": 400,
  "errorCode": "CELL_VOLTAGE_FAULT",
  "detail": "Measured cell voltage delta 0.065V exceeds allowable threshold of 0.050V.",
  "traceId": "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01",
  "errors": {
    "vDeltaVolts": ["Cell delta exceeds safety limit 0.050V. Pack requires replacement."]
  }
}
```

### Bảng Mã Lỗi Ổn Định (Machine-Readable Error Codes)
- `AUTH_INVALID_CREDENTIALS`: Sai email hoặc mật khẩu.
- `AUTH_UNAUTHORIZED`: Token hết hạn, không hợp lệ hoặc thiếu header Authorization.
- `ACCESS_FORBIDDEN`: Người dùng không đủ thẩm quyền theo vai trò RBAC.
- `VALIDATION_FAILED`: Dữ liệu gửi lên sai định dạng hoặc vi phạm ràng buộc kỹ thuật.
- `BATTERY_NOT_FOUND`: Không tìm thấy mã Serial pack pin tương ứng.
- `BATTERY_SERIAL_CONFLICT`: Trùng mã Serial Number đã tồn tại trong cơ sở dữ liệu.
- `VEHICLE_NOT_FOUND`: Không tìm thấy số VIN xe điện VinFast.
- `CELL_VOLTAGE_FAULT`: Độ lệch áp cell $\Delta V > 0.050\text{V}$ bắt buộc dừng vận hành.
- `SWAP_ORDER_INVALID_STATE`: Lệnh đổi pin không ở trạng thái chờ duyệt.
- `FILE_TOO_LARGE`: Tệp Excel tải lên vượt quá giới hạn 10 MB.

---

## 8. Các Lệnh cURL Mẫu Thử Nghiệm API

### 8.1 Đăng Nhập Hệ Thống (Login)
```bash
curl --request POST \
  --url http://localhost:5000/api/v1/auth/login \
  --header "Content-Type: application/json" \
  --data '{
    "email": "lead.longbien@vinfast.vn",
    "password": "VinFast2026!"
  }'
```

### 8.2 Quét QR Tra Cứu Hộ Chiếu Pin Công Khai (Mobile QR - Không cần Token)
```bash
curl --request GET \
  --url "http://localhost:5000/api/v1/public/passport/VF-BAT-VF8-2026-00892" \
  --header "Accept: application/json"
```

### 8.3 Kỹ Thuật Viên Nhập Số Liệu Đo Kiểm Tại Cầu Nâng Xưởng
```bash
curl --request POST \
  --url http://localhost:5000/api/v1/inspections \
  --header "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "batteryId": 108,
    "vehicleId": 45,
    "measuredCapacityKwh": 60.10,
    "internalResistanceMohm": 24.50,
    "cycleCountReading": 480,
    "vMaxVolts": 4.185,
    "vMinVolts": 4.120,
    "operatingTemperatureC": 28.5,
    "diagnosticNotes": "Dung lượng chai còn 68.53% và lệch cell 0.065V. Kích hoạt đổi pin."
  }'
```

### 8.4 Trưởng Xưởng Phê Duyệt Lệnh Đổi Pin Mới
```bash
curl --request POST \
  --url http://localhost:5000/api/v1/swaps/512/approve \
  --header "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  --header "Accept: application/json"
```

### 8.5 Tải Lên & Xem Trước Kiểm Tra Lô Pin Excel (VinES Factory Batch)
```bash
curl --request POST \
  --url http://localhost:5000/api/v1/imports/preview \
  --header "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  --form "file=@/path/to/VinES_Batch_202610.xlsx"
```

---

## 9. Kiểm Tra & Xác Thực OpenAPI Contract

Bạn có thể xác thực tính hợp lệ của tệp `openapi.yaml` bằng công cụ Redocly CLI:

```bash
# 1. Cài đặt và kiểm tra cú pháp (Linting)
npx @redocly/cli lint docs/api/openapi.yaml

# 2. Đóng gói kiểm tra các liên kết tham chiếu ($ref)
npx @redocly/cli bundle docs/api/openapi.yaml
```
