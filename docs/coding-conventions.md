# Quy Chuẩn Viết Mã & Định Dạng Toàn Hệ Thống (Coding Conventions) — VSF

> **Hệ thống:** Nền tảng Hộ chiếu Số & Quản trị Vòng đời Pin Xe Điện VinFast (VSF)  
> **Áp dụng cho:** Toàn bộ thành viên đội ngũ kỹ thuật phát triển Backend C#, Database PostgreSQL và Frontend.

---

## 1. Quy Chuẩn Backend C# (.NET 9 / ASP.NET Core)

### 1.1 Quy Tắc Đặt Tên (Naming Styles)
* **PascalCase:** Áp dụng cho Tên Lớp (`class`), Interface (`interface`), Struct, Enum, Record, Tên Hàm / Phương thức (`Method`), Thuộc tính (`Property`), và Tên Namespace.
  * *Ví dụ:* `BatteryInspectionService`, `CalculateSoH`, `DiagnosticResultDto`.
* **Tiền tố Interface:** Bắt buộc bắt đầu bằng chữ `I` viết hoa.
  * *Ví dụ:* `IBatteryRepository`, `IPassportService`, `IPdfGenerator`.
* **Quy chuẩn Phương thức Bất đồng bộ (Async):** Bắt buộc kết thúc bằng hậu tố `Async` và luôn nhận tham số `CancellationToken ct = default`.
  * *Ví dụ:* `Task<BatteryResponseDto> GetBatteryBySerialAsync(string serial, CancellationToken ct = default)`.
* **camelCase:** Áp dụng cho Tham số của hàm (`parameters`) và Biến cục bộ trong hàm (`local variables`).
  * *Ví dụ:* `measuredCapacityAh`, `nominalCapacityAh`, `cellVoltageMax`.
* **Biến nội bộ (Private readonly fields):** Bắt đầu bằng dấu gạch dưới `_` kèm theo kiểu camelCase.
  * *Ví dụ:* `private readonly IBatteryRepository _batteryRepository;`.

### 1.2 Cấu Trúc File & Thứ Tự Khai Báo Trong Class
Mỗi tệp tin C# tuân thủ thứ tự sắp xếp nhất quán từ trên xuống dưới:
1. `using` directives (Sắp xếp theo thứ tự bảng chữ cái, nhóm `System.*` ở đầu).
2. `namespace Vsf.Application.Services;` (Sử dụng File-scoped namespace).
3. Khai báo Lớp và Dependency Injection:
   ```csharp
   public sealed class BatteryInspectionService : IInspectionService
   {
       // 1. Private readonly fields
       private readonly IBatteryRepository _batteryRepository;
       private readonly ILogger<BatteryInspectionService> _logger;

       // 2. Public Constructor
       public BatteryInspectionService(
           IBatteryRepository batteryRepository, 
           ILogger<BatteryInspectionService> logger)
       {
           _batteryRepository = batteryRepository;
           _logger = logger;
       }

       // 3. Public Business Methods
       public async Task<DiagnosticResultDto> InspectBatteryAsync(...) { ... }

       // 4. Private Helper Methods
       private static decimal ComputeSoH(...) { ... }
   }
   ```

---

## 2. Quy Chuẩn Cơ Sở Dữ Liệu (PostgreSQL 16)

* **snake_case toàn bộ:** Tên Bảng, Tên Cột, Tên Trigger và Tên View đều sử dụng chữ in thường nối dấu gạch dưới `_`.
  * *Ví dụ:* Bảng `battery_inspections`, cột `measured_capacity_ah`, cột `cell_voltage_max`.
* **Tên Bảng:** Luôn sử dụng danh từ số nhiều (Plural nouns).
  * *Ví dụ:* `batteries`, `vehicles`, `workshops`, `audit_logs`.
* **Khóa chính (Primary Key):** Luôn đặt tên là `id` (kiểu `BIGSERIAL` hoặc `BIGINT`).
* **Khóa ngoại (Foreign Key):** Sử dụng định dạng: `{tên_bảng_số_ít}_id`.
  * *Ví dụ:* `battery_id`, `vehicle_id`, `workshop_id`.
* **Quy chuẩn đặt tên Chỉ mục (Indexes):**
  * Index thông thường: `idx_{tên_bảng}_{tên_cột}` (Ví dụ: `idx_batteries_model_id`).
  * Unique Index: `uq_{tên_bảng}_{tên_cột}` (Ví dụ: `uq_batteries_serial_number`).
  * Partial Index: `idx_{tên_bảng}_{mục_đích}` (Ví dụ: `idx_batteries_active_on_vehicle`).

---

## 3. Quy Chuẩn Frontend & Giao Diện Web

* **kebab-case cho tệp tin:** Tất cả các file giao diện đặt tên chữ thường nối dấu gạch ngang: `index.html`, `style.css`, `app.js`, `mock-data.json`.
* **Tiền tố thương hiệu VinFast (CSS Class BEM-like):**
  * Các khối thành phần dùng tiền tố `vf-` để tránh xung đột: `.vf-navbar`, `.vf-card`, `.vf-btn-primary`, `.vf-table`.
* **Biến màu & Thiết kế Design Tokens:**
  * Khai báo tập trung trong `:root` tại `style.css`: `--vf-primary`, `--vf-navy-dark`, `--color-green`, `--color-red`.
* **Tabular Numbers cho dữ liệu số:** Các con số hiển thị điện áp, dung lượng $Ah$, SoH bắt buộc thêm thuộc tính CSS:
  `font-feature-settings: "tnum";` để khi số nhảy không làm rung giật layout.

---

## 4. Quy Chuẩn Commit Git & Kiểm Soát Phiên Bản

Tuân thủ nghiêm ngặt chuẩn **Conventional Commits**:
* `feat(...):` Thêm chức năng mới (Ví dụ: `feat(api): add battery inspection calculation endpoint`).
* `fix(...):` Sửa lỗi (Ví dụ: `fix(db): correct unique constraint on bess allocations`).
* `docs(...):` Cập nhật tài liệu kỹ thuật (Ví dụ: `docs: add technical specification and coding conventions`).
* `refactor(...):` Tối ưu cấu trúc code nhưng không thay đổi hành vi logic.
* `test(...):` Thêm kiểm thử đơn vị hoặc kiểm thử tích hợp.
