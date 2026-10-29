# Rà Soát Yêu Cầu Người Dùng Theo Chuẩn INVEST — VSF

> **Dự án:** VSF — VinFast Battery Passport & Second-Life Platform  
> **Trạng thái:** TARGET V1  
> **Tiêu chuẩn:** Rà soát toàn bộ 16 User Stories (US01 – US16) theo 6 tiêu chí INVEST trước khi đưa vào phát triển.

---

## 1. Ý Nghĩa Tiêu Chuẩn INVEST Trong Hệ Thống VSF

| Tiêu Chí | Ý Nghĩa Thực Tế Trong Dự Án VSF |
|---|---|
| **Independent (Độc Lập)** | Mỗi User Story đại diện cho một năng lực nghiệp vụ cụ thể, có thể phát triển, kiểm thử và bàn giao độc lập mà không bị phụ thuộc vòng tròn. |
| **Negotiable (Có Thể Đàm Phán)** | Thiết kế UI và giải pháp công nghệ có thể tinh chỉnh linh hoạt, miễn là bảo toàn tuyệt đối quy tắc bảo hành đổi pin của VinFast và quy chuẩn EU. |
| **Valuable (Có Giá Trị)** | Mang lại giá trị trực tiếp cho chuỗi giá trị VinFast: ngăn chặn gian lận bảo hành, mở đường thông quan xuất khẩu EU, và tối ưu hóa tài sản tái sinh BESS. |
| **Estimable (Ước Lượng Được)** | Rõ ràng về Tác nhân (Actor), Đầu vào (Inputs), Đầu ra (Outputs), Điều kiện kích hoạt và Kịch bản lỗi để ước lượng chính xác Story Points. |
| **Small (Đủ Nhỏ)** | Mỗi Story đủ gọn để phân rã hoàn chỉnh thành 5 phần việc kỹ thuật: API Endpoint, Application Policy, Database Query, React UI/Modal, và Unit/Integration Test. |
| **Testable (Kiểm Thử Được)** | Mọi Story đều ánh xạ trực tiếp sang các tiêu chí nghiệm thu định lượng (như công thức SoH, mã lỗi RFC 7807, trạng thái Database). |

---

## 2. Danh Sách 16 User Stories Chi Tiết

```text
US01–US02   Xác thực & Quản lý Phiên làm việc (Authentication & Session)
US03        Dashboard Phân tích Vòng đời & Tỷ lệ SoH Toàn mạng lưới
US04–US07   Quản trị Pack Pin & Truy vết Hộ chiếu QR (Asset Tracking)
US08–US09   Kiểm định Đo đạc, Tính SoH & Kích hoạt Bảo hành Đổi pin
US10–US11   Điều phối Tái sinh Second-Life BESS & Thanh lý Tái chế
US12–US13   Nhập lô Excel Nhà máy VinES & Xuất Chứng nhận PDF Chuẩn EU
US14        Nhật ký Kiểm toán & Đối soát Tuân thủ (Audit Trail)
US15        Quản trị Người dùng & Phân bổ Xưởng Dịch vụ (Admin Only)
US16        Quản lý Hồ sơ Cá nhân & Bảo mật Mật khẩu
```

### US01 — Đăng Nhập Hệ Thống
* **Là một** nhân viên xưởng hoặc quản trị viên VinFast,
* **Tôi muốn** đăng nhập bằng Email và Mật khẩu được mã hóa,
* **Để** truy cập vào không gian làm việc an toàn tương ứng với vai trò của mình.

### US02 — Đăng Xuất An Toàn
* **Là một** người dùng đã xác thực,
* **Tôi muốn** đăng xuất khỏi phiên làm việc hiện tại,
* **Để** xóa bỏ token xác thực trên thiết bị và bảo vệ an toàn thông tin xưởng.

### US03 — Dashboard Giám Sát Sức Khỏe Pin Toàn Quốc
* **Là một** Trưởng xưởng hoặc Ban quản trị VinFast,
* **Tôi muốn** xem biểu đồ phân bố độ chai pin SoH và tỷ lệ pin các dòng xe (VF3 $	o$ VF9),
* **Để** nắm bắt tình trạng lão hóa của toàn bộ đội xe và nhận cảnh báo sớm các lô pin suy giảm bất thường.

### US04 — Sổ Quản Lý Pack Pin & Tra Cứu Bộ Lọc
* **Là một** Kỹ thuật viên hoặc Trưởng xưởng,
* **Tôi muốn** tra cứu danh sách pack pin theo Serial, Model xe, dải SoH và trạng thái vòng đời,
* **Để** nhanh chóng tìm kiếm và định danh pack pin đang bảo dưỡng tại xưởng.

### US05 — Đăng Ký Pack Pin Mới Xuất Xưởng
* **Là một** Trưởng xưởng hoặc Quản trị viên,
* **Tôi muốn** đăng ký thông tin khai sinh của pack pin mới (Serial, Model, Ngày SX, Carbon footprint ban đầu),
* **Để** khởi tạo Hộ chiếu Pin số hóa ngay khi pin xuất xưởng từ nhà máy VinES.

### US06 — Truy Vết Lịch Sử Gắn Xe 1-N Của Pack Pin
* **Là một** Kỹ thuật viên hoặc Kiểm toán viên,
* **Tôi muốn** xem danh sách các xe (VIN / Biển số) mà pack pin đã từng được gắn qua các thời kỳ,
* **Để** nắm rõ lịch sử luân chuyển và không bị ràng buộc chết 1 xe - 1 pin duy nhất.

### US07 — Sinh Mã & In Tem Nhãn QR Hộ Chiếu
* **Là một** Kỹ thuật viên xưởng,
* **Tôi muốn** sinh mã QR liên kết động và in tem nhãn nhiệt kích thước chuẩn 50x30mm,
* **Để** dán trực tiếp lên nắp kim loại của vỏ pack pin tại xưởng dịch vụ.

### US08 — Đo Kiểm Dung Lượng & Tự Động Tính SoH
* **Là một** Kỹ thuật viên bảo dưỡng,
* **Tôi muốn** nhập dung lượng đo thực tế $C_{\text{measured}}$ và nội trở từ máy chẩn đoán,
* **Để** hệ thống tự động khóa dung lượng danh định $C_{\text{nominal}}$ theo Model xe và tính toán tức thời điểm SoH mà không cần tính nhẩm.

### US09 — Kích Hoạt Bảo Hành Thu Hồi Đổi Pin Miễn Phí
* **Là một** Kỹ thuật viên hoặc Trưởng xưởng,
* **Tôi muốn** hệ thống tự động bật cờ `RECALL_PENDING` khi SoH < 70% hoặc phát hiện lỗi cell vật lý/nguy cơ thoát nhiệt,
* **Để** kích hoạt quy trình thay thế pack pin mới miễn phí cho khách hàng theo hợp đồng thuê pin VinFast.

### US10 — Điều Phối Pin Tái Sinh Vào Trạm Sạc V-Green BESS
* **Là một** Trưởng xưởng hoặc Quản trị viên,
* **Tôi muốn** gán các pack pin thu hồi đạt chuẩn ($55\% \le \text{SoH} < 70\%$) vào tủ rack trạm sạc V-Green,
* **Để** tái sử dụng làm hệ thống pin lưu trữ năng lượng đệm hỗ trợ các trụ sạc nhanh cao tốc.

### US11 — Thanh Lý Chuyển Giao Tái Chế Kim Loại Hiếm
* **Là một** Trưởng xưởng hoặc Quản trị viên,
* **Tôi muốn** lập lệnh thanh lý cho các pack pin chai nặng ($< 55\%$) hoặc hư hỏng vỏ,
* **Để** chuyển giao về nhà máy thủy luyện VinES thu hồi kim loại quý Lithium, Cobalt, Nickel.

### US12 — Batch Import Lô Pin Từ File Excel VinES
* **Là một** Quản trị viên hoặc Trưởng xưởng,
* **Tôi muốn** tải lên file Excel danh sách 500-1.000 pack pin mới kèm tính năng xem trước (Preview) và báo lỗi từng dòng,
* **Để** nhập dữ liệu hàng loạt từ nhà máy VinES một cách nhanh chóng và an toàn tuyệt đối.

### US13 — Cổng Tra Cứu Hộ Chiếu QR Công Khai
* **Là một** Khách hàng mua xe cũ hoặc Thanh tra Hải quan EU,
* **Tôi muốn** dùng camera điện thoại quét mã QR trên vỏ pin để mở trang tra cứu công khai,
* **Để** xác thực nguồn gốc xuất xứ, độ chai pin thực tế, Dấu chân Carbon ($gCO_2eq/kWh$) và Tỷ lệ vật liệu tái chế mà không cần đăng nhập.

### US14 — Xuất Giấy Chứng Nhận Sức Khỏe Pin PDF Chuẩn EU
* **Là một** Trưởng xưởng hoặc Kiểm toán viên,
* **Tôi muốn** xuất file Giấy chứng nhận (EU Battery Health Certificate) định dạng PDF có mã QR xác thực và chữ ký số,
* **Để** phục vụ hồ sơ hải quan thông quan xuất khẩu và mua bán chuyển nhượng xe điện.

### US15 — Nhật Ký Kiểm Toán Bất Biến (Audit Trail)
* **Là một** Ban quản trị hoặc Kiểm toán viên độc lập,
* **Tôi muốn** tra cứu toàn bộ lịch sử các thao tác kiểm định, đổi trạng thái và gán trạm BESS,
* **Để** đảm bảo tính minh bạch, chống gian lận dữ liệu kỹ thuật và tuân thủ quy chuẩn kiểm định.

### US16 — Quản Trị Người Dùng & Phân Xưởng Dịch Vụ
* **Là một** Quản trị viên VinFast HQ,
* **Tôi muốn** quản lý danh sách tài khoản nhân viên, phân vai trò (Role) và phân bổ xưởng dịch vụ,
* **Để** kiểm soát quyền truy cập và bảo vệ dữ liệu nội bộ của hệ thống.

---

## 3. Bảng Rà Soát Chi Tiết 16 User Stories Theo Chuẩn INVEST

| Story | I | N | V | E | S | T | Kết Luận & Giải Trình Kỹ Thuật Nghiệp Vụ |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|---|
| **US01** | PASS | PASS | PASS | PASS | PASS | PASS | Xác thực chuẩn JWT Bearer, PBKDF2 hash, mã lỗi an toàn 401. |
| **US02** | PASS | PASS | PASS | PASS | PASS | PASS | Xóa token phía client, ghi nhận sự kiện LOGOUT vào Audit log. |
| **US03** | PASS | PASS | PASS | PASS | PASS | PASS | Tổng hợp số liệu theo thời gian thực; phân vùng dữ liệu theo xưởng dịch vụ. |
| **US04** | PASS | PASS | PASS | PASS | PASS | PASS | Truy vấn phân trang indexed, loại trừ các bản ghi có `deleted_at`. |
| **US05** | PASS | PASS | PASS | PASS | PASS | PASS | Ràng buộc duy nhất Serial number, bắt buộc nhập thông số Carbon footprint. |
| **US06** | PASS | PASS | PASS | PASS | PASS | PASS | Mô hình 1-N giữa Xe (VIN) và Pin (Serial); độc lập vòng đời thiết bị. |
| **US07** | PASS | PASS | PASS | PASS | PASS | PASS | Sinh mã QR động chuẩn ISO/IEC 18004, xuất tem in vector 50x30mm. |
| **US08** | PASS | PASS | PASS | PASS | PASS | PASS | Khóa cứng dung lượng danh định theo Model ID, tự động tính SoH. |
| **US09** | PASS | PASS | PASS | PASS | PASS | PASS | Bắt điều kiện: $\text{SoH} < 70\%$ HOẶC $\text{has\_critical\_cell\_fault} = \text{true}$. |
| **US10** | PASS | PASS | PASS | PASS | PASS | PASS | Kiểm tra ngưỡng $55\% \le \text{SoH} < 70\%$, gán vị trí tủ rack trạm BESS. |
| **US11** | PASS | PASS | PASS | PASS | PASS | PASS | Phê duyệt thanh lý cho pin $<55\%$, chuyển trạng thái `RECYCLED`. |
| **US12** | PASS | PASS | PASS | PASS | PASS | PASS | Giới hạn 10 MB, 5.000 dòng; cơ chế giao dịch nguyên tử All-or-Nothing. |
| **US13** | PASS | PASS | PASS | PASS | PASS | PASS | Endpoint mở không cần token; bảo mật thông tin cá nhân chủ xe theo NĐ 13. |
| **US14** | PASS | PASS | PASS | PASS | PASS | PASS | QuestPDF sinh file A4 có mã QR và chữ ký băm SHA-256 xác thực. |
| **US15** | PASS | PASS | PASS | PASS | PASS | PASS | Quyền chỉ đọc (Read-only); trigger ghi log tự động từ Database. |
| **US16** | PASS | PASS | PASS | PASS | PASS | PASS | Quản trị vòng đời tài khoản; chỉ tài khoản ADMIN mới có quyền thực thi. |

---

## 4. Bảng Phân Rã Kỹ Thuật 5 Tầng (Technical Breakdown)

| Story | API Route & Controller | Application Logic & Policy | Database & Entities | Frontend UI / Modal | Test Scope |
|---|---|---|---|---|---|
| **US01** | `POST /api/v1/auth/login` | `AuthenticationService.LoginAsync` | `app_users` (Select by email) | `Login.jsx` (Two-column layout) | Unit test verify password hash, Integration test 401 |
| **US03** | `GET /api/v1/dashboard/metrics` | `DashboardService.GetMetricsAsync` | Aggregate queries on `battery_packs` | `Dashboard.jsx` (Chart.js SoH) | Unit test aggregation math, Empty state |
| **US04** | `GET /api/v1/batteries` | `BatteryService.ListBatteriesAsync` | Filtered query on `battery_packs` | `BatteryList.jsx` (Table & filters) | Pagination test, Status filtering |
| **US05** | `POST /api/v1/batteries` | `BatteryPolicy.EnsureCanRegister` | Insert `battery_packs` | `BatteryFormModal.jsx` | Duplicate serial validation, Carbon field check |
| **US07** | `GET /api/v1/batteries/{s}/qr` | `QrCodeService.GenerateLabel` | Read `battery_packs` & `models` | `QrCodeModal.jsx` (Print view) | QR decoding test, Vector SVG render |
| **US08** | `POST /api/v1/inspections` | `InspectionService.ProcessAsync` | Insert `battery_inspections` | `InspectionModal.jsx` | SoH auto-calculation formula test |
| **US09** | Handled in US08 service | `LifecycleEngine.EvaluateStatus` | Update `battery_packs.status` | Status badge auto-change | SoH < 70% threshold test, Cell fault flag test |
| **US10** | `POST /api/v1/second-life/deploy`| `BessService.DeployPackAsync` | Insert `second_life_deployments` | `BessDeployModal.jsx` | Eligible SoH 55-70% validation test |
| **US12** | `POST /api/v1/operations/import`| `ClosedXmlReader.ParseBatch` | Transaction insert `import_batches` | `ImportPage.jsx` (Preview table) | Invalid row rollback test, 5000 rows limit |
| **US13** | `GET /api/v1/public/passport/{s}`| `PublicPassportService.GetAsync` | Read-only join (no user data) | `PublicPassportPage.jsx` (Mobile) | Anonymous access test, Zero PII exposure |
| **US14** | `GET /api/v1/reports/pdf/{s}` | `QuestPdfBuilder.GeneratePdf` | Fetch pack & inspection history | Download button & PDF viewer | PDF generation speed < 1s, QR integrity |
| **US15** | `GET /api/v1/audit` | `AuditService.ListLogsAsync` | Query `audit_logs` | `AuditPage.jsx` (Timeline view) | Read-only audit query, Date-range filter |
| **US16** | `GET, POST /api/v1/users` | `UserService.ManageAccounts` | CRUD `app_users` | `UsersPage.jsx` (Admin modal) | Role guard test, Self-lock prevention |

---

## 5. Các Ràng Buộc Nghiệm Thu Xuyên Suốt (Cross-Cutting Constraints)

1. **Phân quyền do Backend API cưỡng chế:** Frontend chỉ ẩn/hiện nút để tối ưu UX; Backend Controller bắt buộc kiểm tra Claim Role và Token chữ ký hợp lệ trước khi thực thi.
2. **Khóa cứng $C_{\text{nominal}}$ theo Model ID:** Tuyệt đối không cho phép kỹ thuật viên tự gõ dung lượng danh định của xe để chống gian lận tính sai SoH.
3. **Quan hệ 1-N giữa Xe và Pin:** Mọi truy vấn lịch sử phải bảo toàn liên kết dòng thời gian giữa `vehicle_vin` và `serial_number`.
4. **Nhập Excel nguyên tử (Atomic All-or-Nothing):** Bất kỳ một dòng nào sai cấu trúc hoặc trùng Serial đều phải chặn toàn bộ đợt Import, không để lại dữ liệu rác trong cơ sở dữ liệu.
5. **Chuẩn hóa lỗi RFC 7807:** Mọi lỗi hệ thống đều trả về định dạng chuẩn `application/problem+json` với mã lỗi (`errorCode`) và mã vết (`traceId`) duy nhất.
