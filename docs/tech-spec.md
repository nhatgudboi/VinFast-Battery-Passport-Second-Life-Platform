# Đặc Tả Kỹ Thuật Hệ Thống (Technical Specification) — VSF

> **Hệ thống:** Nền tảng Hộ chiếu Số & Quản trị Vòng đời Pin Xe Điện VinFast (VSF)  
> **Phiên bản:** TARGET V1 — PRODUCTION BASELINE  
> **Tiêu chuẩn tuân thủ:** EU Battery Regulation (EU 2023/1542), RFC 7807 (ProblemDetails), OpenAPI 3.0.4, DBML 2.0.

---

## 1. Ngăn Xếp Công Nghệ Chuẩn Hóa (Technology Stack)

| Tầng Kiến Trúc | Công Nghệ Lựa Chọn | Phiên Bản | Lý Do Kỹ Thuật & Nghiệp Vụ VinFast |
|---|---|---|---|
| **Máy Chủ Backend API** | C# / ASP.NET Core Web API | .NET 9 (LTS/Current) | Hiệu năng cao, xử lý tính toán SoH & giao dịch hoán đổi 1-N an toàn đa luồng. |
| **Kiến Trúc Ứng Dụng** | Clean Architecture (3 Dự án) | Onion Pattern | Độc lập nghiệp vụ lõi (`Vsf.Application`) khỏi CSDL và giao diện. |
| **Cơ Sở Dữ Liệu** | PostgreSQL | 16-alpine (Docker) | Hỗ trợ JSONB linh hoạt cho Audit Log, Partial Indexes tối ưu tốc độ tra cứu < 50ms. |
| **Truy Xuất Dữ Liệu** | Entity Framework Core & Dapper | 9.0 | EF Core quản lý Migrations & Transaction; Dapper truy vấn phân tích Dashboard siêu tốc. |
| **Giao Tiếp API** | RESTful JSON API | OpenAPI 3.0.4 | Chuẩn hóa 24 endpoints, tự động sinh tài liệu Swagger UI và Client SDK. |
| **Xử Lý Tệp Lô (Import)**| ClosedXML | 0.104+ | Đọc và bóc tách dữ liệu tệp Excel (.xlsx) từ nhà máy VinES Hải Phòng trong bộ nhớ. |
| **Xuất Văn Bản Pháp Lý** | QuestPDF | 2024.x | Dựng tài liệu Hộ chiếu pin khổ A4 chuẩn EU kèm tem vector QR và chữ ký hash SHA-256. |
| **Giao Diện Người Dùng** | HTML5 Semantic, Modern CSS, JS | VinFast High-Tech | Giao diện tối ưu phản hồi tức thì, Glassmorphism, chuẩn bị tích hợp React 19 Shell. |

---

## 2. Kiến Trúc 3 Tầng (Clean Architecture Breakdown)

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   1. TẦNG PRESENTATION (Vsf.Api)                       │
│  - 10 REST Controllers ánh xạ 24 Endpoints chuẩn OpenAPI 3.0.4        │
│  - Middleware: Global Exception (RFC 7807), RBAC Authorization, Audit  │
│  - Swagger UI Documentation & Rate Limiting cho Cổng QR Công Khai      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Phụ thuộc (Calls)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│               2. TẦNG APPLICATION CORE (Vsf.Application)               │
│  - DiagnosticEngine: Thuật toán tự tính SoH & bắt lỗi cell Delta V    │
│  - BatterySwapService: Điều phối hoán đổi 1-N nguyên tử cho xe (VIN)   │
│  - SecondLifeEngine: Phân luồng trạm tích điện BESS V-Green / Tái chế  │
│  - DTOs, FluentValidation Validators, Result Monad Pattern             │
│  - Interfaces trừu tượng: IBatteryRepository, IPdfGenerator...         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    ▲ Thực thi (Implements)
                                    │
┌────────────────────────────────────────────────────────────────────────┐
│             3. TẦNG HẠ TẦNG & DỮ LIỆU (Vsf.Infrastructure)             │
│  - PostgreSQL 16 (VsfDbContext, Configurations Fluent API)             │
│  - Repositories: BatteryRepository, InspectionRepository...            │
│  - External Adapters: QuestPdfGenerator, ClosedXmlReader, Pbkdf2Hasher │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Thuật Toán Cốt Lõi & Quy Tắc Ra Quyết Định Kỹ Thuật

### 3.1 Thuật Toán Chẩn Đoán Độ Chai Pin & Lệch Áp Cell
```csharp
public DiagnosticResult EvaluateInspection(
    decimal measuredCapacityAh, 
    decimal nominalCapacityAh, 
    decimal cellVMax, 
    decimal cellVMin)
{
    // 1. Tính toán điểm sức khỏe SoH
    decimal soh = (measuredCapacityAh / nominalCapacityAh) * 100m;
    soh = Math.Round(soh, 2);

    // 2. Tính độ lệch áp giữa các cell
    decimal deltaV = cellVMax - cellVMin;
    bool hasCellFault = deltaV > 0.050m; // Ngưỡng an toàn quốc tế 50mV

    // 3. Quy tắc ra quyết định tự động
    InspectionConclusion conclusion;
    if (hasCellFault)
    {
        conclusion = InspectionConclusion.FAIL_CELL_VOLTAGE_FAULT; // Nguy cơ thoát nhiệt
    }
    else if (soh < 70.00m)
    {
        conclusion = InspectionConclusion.FAIL_WARRANTY_ELIGIBLE;  // Đủ điều kiện đổi miễn phí
    }
    else
    {
        conclusion = InspectionConclusion.PASS_FIRST_LIFE;         // Tiếp tục lăn bánh
    }

    return new DiagnosticResult(soh, deltaV, hasCellFault, conclusion);
}
```

### 3.2 Quy Trình Hoán Đổi Pin 1-N Nguyên Tử (Database Transaction)
Khi Trưởng xưởng duyệt lệnh thay thế pack pin mới cho xe, hệ thống mở một giao dịch duy nhất:
1. `BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;`
2. Đóng dấu thời gian tháo cho pin cũ:
   `UPDATE vehicle_battery_histories SET removed_at = NOW() WHERE battery_id = @oldId AND removed_at IS NULL;`
3. Cập nhật con trỏ pin hiện tại trên xe:
   `UPDATE vehicles SET current_battery_id = @newId WHERE vin = @vin;`
4. Gắn kết quả pin mới vào xe:
   `INSERT INTO vehicle_battery_histories (vehicle_id, battery_id, installed_at) VALUES (@vehId, @newId, NOW());`
5. Cập nhật trạng thái vòng đời pin cũ sang `SECOND_LIFE_BESS` (hoặc `RECYCLED`):
   `UPDATE batteries SET lifecycle_status = @targetStatus WHERE id = @oldId;`
6. Ghi nhật ký bất biến vào `audit_logs`.
7. `COMMIT TRANSACTION;` (Tự động Rollback nếu có bất kỳ lỗi nào xảy ra).

---

## 4. Đặc Tả Hiệu Năng & Tiêu Chuẩn Phi Chức Năng (NFR)
1. **Thời gian đáp ứng (Response Time):**
   * Endpoint tra cứu Hộ chiếu số QR công khai (`GET /public/passport/{serial}`): $\le 50\text{ms}$ (nhờ Partial Unique Index `idx_batteries_serial_number`).
   * Các API tác vụ danh mục (`GET /api/v1/batteries`): $\le 120\text{ms}$ với độ phân trang 50 dòng/trang.
2. **Bảo vệ quyền riêng tư cá nhân (Nghị định 13/2023/NĐ-CP):**
   * Mọi dữ liệu trả về trên Cổng công khai đều tự động che giấu thông tin cá nhân khách hàng (PII Redacted). Số khung VIN và biển số xe chỉ hiển thị dạng ẩn danh (ví dụ: `VNF8A21P5PA00****`).
3. **Tính bất biến của sổ kiểm toán (Immutable Audit Log):**
   * Bảng `audit_logs` chỉ có quyền ghi (Append-only). Database Trigger và quyền User PostgreSQL chặn tuyệt đối các thao tác `UPDATE` hoặc `DELETE`.
