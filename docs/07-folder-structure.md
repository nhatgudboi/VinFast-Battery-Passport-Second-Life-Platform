# Cấu Trúc Thư Mục & Tổ Chức Mã Nguồn (Folder Structure) — VSF

> **Hệ thống:** Nền tảng Hộ chiếu Số & Quản trị Vòng đời Pin Xe Điện VinFast (VSF)  
> **Kiến trúc mục tiêu:** Clean Architecture 3 Lớp (.NET 9 Web API) + Frontend Tối Giản Tốc Độ Cao & React Ready + CSDL PostgreSQL 16  
> **Tuân thủ:** Chuẩn OpenAPI 3.0.4, DBML 2.0, và Tiêu chuẩn Thiết kế UI/UX VinFast High-Tech.

---

## 1. Nguyên Tắc Thiết Kế Kiến Trúc & Ranh Giới Trách Nhiệm

Hệ thống tuân thủ chặt chẽ các nguyên tắc cốt lõi của **Clean Architecture (Onion/Hexagonal Architecture)** nhằm đảm bảo tính độc lập, dễ kiểm thử và khả năng mở rộng:

1. **Chiều phụ thuộc hướng tâm (Dependency Inversion):**
   * Tầng Ngoại vi (Presentation & Infrastructure) phụ thuộc vào Tầng Trung tâm (Application & Domain Core).
   * Lớp nghiệp vụ (`Vsf.Application`) tuyệt đối không tham chiếu trực tiếp tới EF Core hay thư viện ngoài; mọi giao tiếp với CSDL, File Excel hay PDF đều thông qua các Interface trừu tượng.
2. **Ranh giới tin cậy (Trust Boundary):**
   * Giao diện người dùng (Frontend) **chỉ đóng vai trò hiển thị và thu thập số đo**. Mọi quyết định an toàn (tính SoH, bắt lỗi lệch cell $\Delta V > 0.050\text{V}$, kích hoạt đổi pin miễn phí hay phân luồng BESS) đều phải được thẩm định cưỡng chế tại Backend API.
3. **Bộ điều khiển tinh gọn (Thin Controllers):**
   * Các Controller trong `Vsf.Api` chỉ làm 3 nhiệm vụ: Tiếp nhận HTTP Request, gọi Dịch vụ nghiệp vụ (Application Service) tương ứng và trả về HTTP Response chuẩn RFC 7807 ProblemDetails. Tuyệt đối không viết câu lệnh SQL hay logic tính toán trong Controller.
4. **Giao dịch nguyên tử (Atomic Transactions):**
   * Các thao tác nghiệp vụ phức tạp liên quan đến nhiều bảng (như quy trình hoán đổi pin 1 - N cho xe hoặc nhập lô Excel hàng loạt) bắt buộc phải được đóng gói trong một Database Transaction duy nhất (All-or-Nothing).

---

## 2. Sơ Đồ Cây Thư Mục Toàn Dự Án (Project Directory Tree)

```text
d:\VSF/
├── compose.yaml                         # Khởi chạy PostgreSQL 16 container qua Docker
├── .env.example                         # Mẫu biến môi trường (DB Connection, JWT Secret)
├── .gitignore                           # Danh mục tệp loại trừ kiểm soát phiên bản Git
├── README.md                            # Tài liệu tổng quan toàn diện của dự án
│
├── docs/                                # TOÀN BỘ TÀI LIỆU KỸ THUẬT & THIẾT KẾ
│   ├── 01-scope.md                      # Bối cảnh EU 2023/1542, bài toán VinFast & Mindmap
│   ├── 02-features.md                   # Danh mục 12 nhóm tính năng (F01 - F12) & 28 sub-features
│   ├── 03-use-cases.md                  # Sơ đồ và đặc tả 16 ca sử dụng cốt lõi (UC01 - UC16)
│   ├── 04-information-architecture.md   # Sơ đồ IA, sitemap 19 màn hình và hợp đồng 8 trạng thái UI
│   ├── 05-data-model.md                 # Đặc tả chi tiết 13 bảng CSDL, quan hệ 1-N và Indexing
│   ├── 06-acceptance-criteria.md        # Bộ 16 tiêu chí nghiệm thu chi tiết (AC-01 - AC-16)
│   ├── 07-folder-structure.md           # [Tài liệu hiện tại] Cấu trúc mã nguồn & quy chuẩn code
│   ├── 08-invest-requirements.md        # 16 User Stories chuẩn INVEST & ma trận truy vết
│   ├── DATABASE.md                      # Sơ đồ ERD Mermaid, Enums, Views và chiến lược đánh Index
│   │
│   ├── api/                             # ĐẶC TẢ GIAO DIỆN LẬP TRÌNH REST API
│   │   ├── openapi.yaml                 # Hợp đồng OpenAPI 3.0.4 đầy đủ (24 endpoints, 11 tags)
│   │   └── README.md                    # Hướng dẫn tích hợp API, cURL mẫu, phân quyền RBAC
│   │
│   ├── architecture/                    # TÀI LIỆU KIẾN TRÚC HỆ THỐNG
│   │   ├── c4/                          # Mô hình kiến trúc C4 từ mức C1 đến C4
│   │   │   ├── README.md                # Tổng quan cấp độ phân rã kiến trúc
│   │   │   ├── 01-system-context.md     # C1: Bối cảnh hệ thống & 4 nhóm tác nhân
│   │   │   ├── 02-container.md          # C2: Các thùng chứa (Web, API, PostgreSQL)
│   │   │   ├── 03-component.md          # C3: Các thành phần bên trong .NET Backend API
│   │   │   └── 04-code.md               # C4: Chi tiết thuật toán chẩn đoán & Hoán đổi 1-N
│   │   └── uml/                         # SƠ ĐỒ MÔ HÌNH HÓA THỐNG NHẤT (UML)
│   │       ├── 01-class-diagrams.md     # 3 Sơ đồ lớp chi tiết (Auth, Battery, Swap)
│   │       └── 02-sequence-diagrams.md  # 4 Sơ đồ tuần tự các luồng nghiệp vụ trọng yếu
│   │
│   ├── images/                          # HÌNH ẢNH DỰ ÁN ĐÃ CHUẨN HÓA
│   │   ├── mindmap.png                  # Sơ đồ tư duy phân rã bài toán cấp cao
│   │   ├── mindmap-inspection-ops.png   # Sơ đồ nghiệp vụ kiểm định đo đạc xưởng
│   │   ├── mindmap-passport-lifecycle.png # Sơ đồ tiến trình vòng đời pin khép kín
│   │   ├── ui-dashboard-kpi.png         # Ảnh chụp giao diện Dashboard (KPI & phân bố SoH)
│   │   ├── ui-dashboard-warnings.png    # Ảnh chụp bảng cảnh báo sớm nguy cơ thoát nhiệt
│   │   ├── ui-battery-registry.png      # Ảnh chụp màn hình Sổ quản lý pack pin toàn quốc
│   │   ├── ui-diagnostic-modal.png      # Ảnh chụp Modal đo kiểm tự động tính SoH thời gian thực
│   │   └── ui-mobile-qr-portal.png      # Ảnh chụp Cổng Hộ chiếu số QR trên iPhone chuẩn EU
│   │
│   └── ui-ux/                           # HỆ THỐNG THIẾT KẾ GIAO DIỆN & DỮ LIỆU MẪU
│       ├── README.md                    # VinFast Design System, bảng màu, typography, 8 trạng thái
│       ├── 01-dashboard-wireframe.md    # Bản vẽ ASCII layout & mô tả dữ liệu Dashboard
│       ├── 02-battery-registry-wireframe.md # Bản vẽ ASCII layout Sổ Pack pin & Modal đo kiểm
│       ├── 03-mobile-qr-portal-wireframe.md # Bản vẽ ASCII layout Cổng QR chuẩn EU 2023/1542
│       └── mock-data.json               # Bộ dữ liệu mẫu đầy đủ (6 Model xe, 5 Pack pin, KPIs)
│
└── src/                                 # MÃ NGUỒN TOÀN BỘ HỆ THỐNG (SOURCE CODE)
    │
    ├── database/                        # CƠ SỞ DỮ LIỆU POSTGRESQL 16
    │   ├── schema.dbml                  # Thiết kế lược đồ CSDL chuẩn hóa DBML 2.0 (13 bảng)
    │   ├── vsf_battery.dbml             # Bản lược đồ dự phòng định dạng DBML
    │   └── vsf_battery.sql              # Kịch bản DDL SQL khởi tạo bảng, Trigger, Index & Seed Data
    │
    ├── frontend/                        # GIAO DIỆN NGƯỜI DÙNG (HIGH-TECH WEB APP)
    │   ├── index.html                   # Khung ứng dụng HTML5 Semantic tích hợp cả 3 màn hình
    │   ├── style.css                    # Toàn bộ CSS Design System VinFast, Glassmorphism, Responsive
    │   ├── app.js                       # Logic tương tác, bộ lọc tìm kiếm và máy tính SoH thời gian thực
    │   └── assets/                      # Biểu tượng vector, logo chữ V mạ chrome, phông chữ
    │
    └── backend/                         # MÁY CHỦ XỬ LÝ NGHIỆP VỤ (ASP.NET CORE 9 CLEAN ARCHITECTURE)
        ├── Vsf.sln                      # Solution file quản lý toàn bộ các dự án C#
        │
        ├── Vsf.Api/                     # 1. TẦNG PRESENTATION (REST API HOST)
        │   ├── Controllers/             # Nhận và phản hồi HTTP Requests theo chuẩn OpenAPI
        │   │   ├── AuthController.cs            # Đăng nhập, đăng xuất, cấp phát JWT Bearer
        │   │   ├── DashboardController.cs       # Tổng hợp KPIs và phân bố sức khỏe SoH
        │   │   ├── BatteriesController.cs       # Tra cứu sổ pin, đăng ký pin mới
        │   │   ├── InspectionsController.cs     # Nhập kết quả đo đạc, chẩn đoán lệch cell
        │   │   ├── SwapsController.cs           # Phê duyệt lệnh đổi pin bảo hành 1-N cho xe
        │   │   ├── SecondLifeController.cs      # Điều phối trạm BESS & thanh lý tái chế
        │   │   ├── ImportController.cs          # Tiếp nhận và xử lý file Excel lô xuất xưởng
        │   │   ├── ReportsController.cs         # Kết xuất chứng nhận Hộ chiếu số PDF chuẩn EU
        │   │   ├── PublicPassportController.cs  # Cổng tra cứu QR công khai (Không cần token)
        │   │   └── AuditController.cs           # Tra cứu sổ nhật ký kiểm toán bất biến
        │   ├── Middleware/              # Bộ lọc trung gian xử lý toàn hệ thống
        │   │   ├── ExceptionMiddleware.cs       # Bắt lỗi toàn cục, trả về RFC 7807 ProblemDetails
        │   │   ├── AuditLoggingMiddleware.cs    # Tự động ghi vết request nhạy cảm vào audit_logs
        │   │   └── RateLimitingMiddleware.cs    # Giới hạn tần suất gọi API cho cổng QR công khai
        │   ├── Extensions/              # Các phương thức mở rộng cấu hình DI Container
        │   │   ├── ServiceCollectionExtensions.cs # Đăng ký Services, Repositories, DbContext
        │   │   └── SwaggerExtensions.cs         # Cấu hình Swagger UI hiển thị OpenAPI 3.0.4
        │   ├── Program.cs               # Điểm khởi chạy ứng dụng (Application Entry Point)
        │   └── appsettings.json         # Cấu hình chuỗi kết nối PostgreSQL và Secret JWT
        │
        ├── Vsf.Application/             # 2. TẦNG CORE BUSINESS LOGIC & INTERFACES
        │   ├── Common/                  # Các lớp dùng chung tầng ứng dụng
        │   │   ├── Result.cs                    # Mô hình kết quả thực thi (Success/Failure Monad)
        │   │   ├── PagedList.cs                 # Cấu trúc phân trang dữ liệu chuẩn hóa
        │   │   └── Exceptions/                  # Các ngoại lệ nghiệp vụ (Domain Exceptions)
        │   ├── DTOs/                    # Đối tượng truyền dữ liệu (Data Transfer Objects)
        │   │   ├── Auth/                        # LoginRequestDto, LoginResponseDto, UserProfileDto
        │   │   ├── Dashboard/                   # DashboardSummaryDto, SohDistributionDto
        │   │   ├── Battery/                     # BatteryRegistryDto, RegisterBatteryDto
        │   │   ├── Inspection/                  # CreateInspectionDto, DiagnosticResultDto
        │   │   ├── Swap/                        # CreateSwapOrderDto, ExecuteSwapDto
        │   │   ├── SecondLife/                  # BessAllocationDto, RecyclingOrderDto
        │   │   └── Import/                      # ExcelBatchUploadDto, BatchErrorDetailDto
        │   ├── Interfaces/              # Các hợp đồng trừu tượng (Dependency Inversion)
        │   │   ├── Repositories/                # IBatteryRepository, IInspectionRepository...
        │   │   ├── Services/                    # IDiagnosticEngine, ISwapService, IPassportService
        │   │   └── Infrastructure/              # IPdfGenerator, IExcelReader, ICurrentUserService
        │   ├── Services/                # Hiện thực hóa các quy tắc nghiệp vụ cốt lõi
        │   │   ├── DiagnosticEngine.cs          # Thuật toán tính SoH và bắt lỗi lệch cell Delta V
        │   │   ├── BatterySwapService.cs        # Điều phối giao dịch hoán đổi 1-N nguyên tử
        │   │   ├── PassportService.cs           # Quản lý Hộ chiếu số và dữ liệu QR công khai
        │   │   ├── SecondLifeService.cs         # Phân luồng pin vào trạm BESS hoặc tái chế
        │   │   └── BatchImportService.cs        # Điều phối nạp dữ liệu lô All-or-Nothing
        │   └── Validators/              # Bộ thẩm định dữ liệu đầu vào (FluentValidation)
        │       ├── CreateInspectionValidator.cs # Kiểm tra giới hạn số đo Ah, điện áp cell V
        │       └── RegisterBatteryValidator.cs  # Kiểm tra định dạng Serial, Model xe VinFast
        │
        └── Vsf.Infrastructure/          # 3. TẦNG HẠ TẦNG KỸ THUẬT & DỮ LIỆU
            ├── Data/                    # Tương tác Cơ sở dữ liệu Entity Framework Core / Dapper
            │   ├── VsfDbContext.cs              # DbContext chính ánh xạ 13 bảng CSDL
            │   ├── Configurations/              # Cấu hình quan hệ bảng qua Fluent API
            │   │   ├── BatteryConfiguration.cs      # Ràng buộc Unique Serial, Index
            │   │   ├── VehicleConfiguration.cs      # Quan hệ 1-N với BatteryHistories
            │   │   └── AuditLogConfiguration.cs     # Cấu hình bảng chỉ ghi (Append-only)
            │   └── Migrations/                  # Lịch sử dịch chuyển CSDL tự động
            ├── Repositories/            # Hiện thực hóa các Repository truy vấn PostgreSQL
            │   ├── BatteryRepository.cs         # Truy vấn sổ pin, phân trang, lọc đa chiều
            │   ├── InspectionRepository.cs      # Lưu trữ số đo chẩn đoán và cập nhật SoH
            │   ├── VehicleRepository.cs         # Quản lý số khung VIN và lịch sử đổi pin
            │   └── AuditLogRepository.cs        # Ghi nhận nhật ký kiểm toán bất biến
            └── Adapters/                # Bộ chuyển đổi tích hợp với các thư viện bên ngoài
                ├── QuestPdfPassportGenerator.cs # Dựng file PDF Hộ chiếu pin A4 chuẩn EU
                ├── ClosedXmlExcelReader.cs      # Đọc và bóc tách dữ liệu từ file Excel .xlsx
                └── Pbkdf2PasswordHasher.cs      # Thuật toán mã hóa băm mật khẩu bảo mật
```

---

## 3. Quy Ước Đặt Tên & Tiêu Chuẩn Viết Mã (Coding Conventions)

### 3.1 Quy Ước Cho Tầng Backend (.NET 9 / C#)
* **Tên Lớp, Interface, Phương Thức:** Sử dụng kiểu **PascalCase** (`BatteryInspectionService`, `CalculateSoH`, `IBatteryRepository`).
* **Interface:** Bắt buộc bắt đầu bằng tiền tố chữ `I` viết hoa (`IInspectionService`).
* **Phương thức bất đồng bộ (Async):** Bắt buộc kết thúc bằng hậu tố `Async` và nhận `CancellationToken` (`GetBatteryBySerialAsync(string serial, CancellationToken ct)`).
* **Biến cục bộ & Tham số hàm:** Sử dụng kiểu **camelCase** (`measuredCapacityAh`, `cellVoltageMax`).
* **Biến nội bộ (Private readonly fields):** Sử dụng dấu gạch dưới kèm camelCase (`_batteryRepository`, `_logger`).

### 3.2 Quy Ước Cho Cơ Sở Dữ Liệu (PostgreSQL 16)
* **Tên Bảng & Tên Cột:** Sử dụng kiểu **snake_case** và danh từ số nhiều cho bảng (`batteries`, `vehicle_battery_histories`, `measured_capacity_ah`).
* **Khóa chính:** Luôn đặt tên là `id` (kiểu `bigint` tự tăng hoặc UUID).
* **Khóa ngoại:** Sử dụng định dạng `{tên_bảng_số_ít}_id` (`battery_id`, `workshop_id`).
* **Chỉ mục (Index):** Bắt đầu bằng `idx_{tên_bảng}_{tên_cột}` (`idx_batteries_serial_number`).

### 3.3 Quy Ước Cho Giao Diện (Frontend & CSS)
* **Tên Tệp Tin:** Sử dụng kiểu chữ thường nối dấu gạch ngang **kebab-case** (`index.html`, `style.css`, `app.js`).
* **Tên Lớp CSS (CSS Classes):** Tuân thủ tiền tố thương hiệu `vf-` kèm phân cấp rõ ràng (`.vf-navbar`, `.vf-btn-primary`, `.pill-status`).
* **Biến CSS Tokens:** Sử dụng tiền tố `--vf-` hoặc `--color-` (`--vf-primary`, `--color-green`).

---

## 4. Quyền Sở Hữu & Quy Tắc Sửa Đổi Tệp Mã Nguồn

| Phân Vùng Thư Mục | Ngôn Ngữ / Công Nghệ | Vai Trò Chính | Trách Nhiệm Nghiệp Vụ Cốt Lõi |
|---|---|---|---|
| `docs/` | Markdown, Mermaid | Đặc tả thiết kế | Lưu trữ chân lý kiến trúc; code phải tuân thủ docs, không tự ý làm sai lệch |
| `src/database/` | SQL, DBML | Lưu trữ dữ liệu | Đảm bảo tính toàn vẹn 1-N giữa Xe & Pin; cưỡng chế ràng buộc Unique Serial |
| `src/backend/` | C#, ASP.NET Core 9 | Xử lý logic máy chủ | Tính toán SoH, chẩn đoán lệch cell $\Delta V$, thực thi giao dịch đổi pin nguyên tử |
| `src/frontend/` | HTML5, CSS3, JS | Trải nghiệm người dùng | Hiển thị dữ liệu trực quan chuẩn VinFast; không chứa logic bảo mật hay tính toán |
