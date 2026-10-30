# VSF — VinFast Battery Passport & Second-Life Platform

**Hệ thống Hộ chiếu Số & Quản trị Vòng đời Tái sinh Pin Xe Điện VinFast**  
Tuân thủ tiêu chuẩn pin Châu Âu (*EU Battery Regulation 2023/1542*) và chính sách bảo hành đổi pin miễn phí của VinFast.

---

## 1. Yêu Cầu Nghiệp Vụ — INVEST, Use Cases & Phân Quyền (RBAC)

Yêu cầu nghiệp vụ định nghĩa những gì nền tảng VSF phải thực thi, các nhóm tác nhân sử dụng, giá trị mang lại cho chuỗi cung ứng VinFast và các tiêu chí thành công quan sát được. Toàn bộ 16 User Stories được rà soát nghiêm ngặt theo chuẩn INVEST và ánh xạ trực tiếp sang 16 Use Cases và ma trận phân quyền 4 Roles.

### 1.1 Product Mind Map

Hệ thống **VSF** được trực quan hóa toàn diện qua Bản đồ Tư duy Sản phẩm (Product Mind Map), bao gồm sơ đồ tổng quan và hai cụm phân hệ nghiệp vụ chi tiết:

#### A. Bức tranh Tổng quan Toàn hệ thống (High-Level Overview)

![VSF Product mind map - Tổng quan](docs/mindmap.png)

#### B. Phân hệ Cổng Hộ Chiếu QR, Quản Trị Pack Pin & Tái Sinh Second-Life BESS

![Phân hệ Hộ chiếu QR Di động & Quản trị Vòng đời Pin](docs/images/mindmap-passport-lifecycle.png)

#### C. Phân hệ Kiểm Định Dung Lượng SoH, Báo Cáo Excel & Quản Trị Hệ Thống

![Phân hệ Kiểm định & Quản trị Hệ thống](docs/images/mindmap-inspection-ops.png)

### 1.2 Tiêu Chuẩn INVEST & Danh Sách 16 User Stories

Danh mục sản phẩm V1 bao gồm **16 User Stories**. Các câu chuyện người dùng này bao phủ toàn bộ vòng đời pin: đăng nhập an toàn, dashboard giám sát SoH, quản trị pack pin, kiểm định đo dung lượng tự động, kích hoạt thu hồi đổi pin, tái sinh trạm sạc BESS, thanh lý tái chế, import Excel từ VinES, xuất PDF chứng nhận EU, cổng QR di động công khai, nhật ký kiểm toán và quản trị nhân sự xưởng.

Trước khi đưa vào phát triển, mỗi User Story đều được kiểm định chặt chẽ theo 6 tiêu chí **INVEST**:

| Tiêu Chí | Ý Nghĩa Thực Tế Trong Hệ Thống VSF |
|---|---|
| **Independent (Độc Lập)** | Mỗi User Story đại diện cho một năng lực nghiệp vụ cụ thể, có thể phát triển, kiểm thử và bàn giao độc lập mà không bị phụ thuộc vòng tròn. |
| **Negotiable (Có Thể Đàm Phán)** | Thiết kế UI và giải pháp công nghệ có thể tinh chỉnh linh hoạt, miễn là bảo toàn tuyệt đối quy tắc bảo hành đổi pin của VinFast và quy chuẩn EU. |
| **Valuable (Có Giá Trị)** | Mang lại giá trị trực tiếp cho chuỗi giá trị VinFast: ngăn chặn gian lận bảo hành, mở đường thông quan xuất khẩu EU, và tối ưu hóa tài sản tái sinh BESS. |
| **Estimable (Ước Lượng Được)** | Rõ ràng về Tác nhân (Actor), Đầu vào (Inputs), Đầu ra (Outputs), Điều kiện kích hoạt và Kịch bản lỗi để ước lượng chính xác Story Points. |
| **Small (Đủ Nhỏ)** | Mỗi Story đủ gọn để phân rã hoàn chỉnh thành 5 phần việc kỹ thuật: API Endpoint, Application Policy, Database Query, React UI/Modal, và Unit/Integration Test. |
| **Testable (Kiểm Thử Được)** | Mọi Story đều ánh xạ trực tiếp sang các tiêu chí nghiệm thu định lượng (như công thức SoH, mã lỗi RFC 7807, trạng thái Database). |

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

Toàn bộ 16 User Stories đều đã có hành vi mục tiêu định lượng: Đăng xuất xóa token client-side, công thức SoH tự động khóa cứng dung lượng chuẩn theo Model xe, nhập Excel nguyên tử All-or-Nothing giới hạn 10 MB/5.000 dòng, xuất PDF đạt chuẩn EU kèm chữ ký băm, và cổng quét QR di động không làm lộ thông tin cá nhân (PII). Tài liệu rà soát và phân rã kỹ thuật 5 tầng được duy trì đầy đủ tại [Rà Soát INVEST Requirements](docs/08-invest-requirements.md).

### 1.3 Sơ Đồ Ca Sử Dụng (Use Cases)

```mermaid
flowchart TB
    subgraph roles["Actors"]
        direction LR
        admin(["HQ Admin"])
        lead(["Station Lead"])
        tech(["Field Tech"])
        viewer(["Auditor / Public"])
    end

    subgraph system["VSF — System Boundary"]
        direction TB
        subgraph row1["Governance and Station Management"]
            direction LR
            adminBox["<b>HQ Admin</b><br/><br/>• UC01-02: Auth (Login/Out)<br/>• UC03: SoH Dashboard<br/>• UC04: Battery Registry<br/>• UC05: Create Passport<br/>• UC10: BESS Allocation<br/>• UC11: Recycle Disposal<br/>• UC12: Excel Batch Import<br/>• UC14: Export EU PDF<br/>• UC15: View Audit Log<br/>• UC16: User Management"]
            
            leadBox["<b>Station Lead</b><br/><br/>• UC01-02: Auth (Login/Out)<br/>• UC03: SoH Dashboard<br/>• UC04: Battery Registry<br/>• UC06: Vehicle History<br/>• UC07: Print QR Label<br/>• UC08: SoH Diagnostic<br/>• UC09: Swap on Cell Fault<br/>• UC10: BESS Allocation<br/>• UC11: Recycle Disposal<br/>• UC14: Export EU PDF<br/>• UC15: View Audit Log"]
        end
        
        subgraph row2["Field Operations & Public Verification"]
            direction LR
            techBox["<b>Field Technician</b><br/><br/>• UC01-02: Auth (Login/Out)<br/>• UC03: SoH Dashboard<br/>• UC04: Battery Registry<br/>• UC06: Vehicle History<br/>• UC07: Print QR Label<br/>• UC08: Capacity & SoH Test<br/>• UC09: Cell Fault Swap"]
            
            viewerBox["<b>Auditor / Public User</b><br/><br/>• UC06: Public Battery Search<br/>• UC13: Mobile QR Scan<br/>• UC14: Download EU Cert"]
        end
    end

    admin --> adminBox
    lead --> leadBox
    tech --> techBox
    viewer --> viewerBox

    classDef actor fill:#1b365d,color:#fff,stroke:#00205b
    classDef primary fill:#0088ff,color:#fff,stroke:#0055b3
    classDef standard fill:#10b981,color:#fff,stroke:#059669
    classDef publicStyle fill:#d97706,color:#fff,stroke:#b45309
    
    class admin,lead,tech,viewer actor
    class adminBox,leadBox primary
    class techBox standard
    class viewerBox publicStyle
    
    style roles fill:#f8fafc,stroke:#94a3b8,stroke-dasharray: 4 4
    style system fill:#f0f9ff,stroke:#0088ff,stroke-width:2px
    style row1 fill:#ffffff,stroke:#cbd5e1,stroke-width:1px
    style row2 fill:#ffffff,stroke:#cbd5e1,stroke-width:1px
```

Đặc tả chi tiết từng luồng tiền điều kiện, luồng chính, kịch bản lỗi và hậu điều kiện được duy trì tại [Đặc Tả Use Cases & RBAC](docs/03-use-cases.md).

### 1.4 Ma Trận Phân Quyền (Roles & Permissions)

| Năng Lực Nghiệp Vụ (Capabilities) | Admin (VinFast HQ) | Station Lead (Trưởng Xưởng) | Technician (Kỹ Thuật Viên) | Auditor / Public (Thanh Tra / Khách) | Ghi Chú Ràng Buộc Kỹ Thuật |
|---|:---:|:---:|:---:|:---:|---|
| **Xem Dashboard KPI & Biểu đồ SoH** | Có | Có | Có | Không | Phân vùng dữ liệu toàn quốc vs xưởng |
| **Tra cứu Sổ Pack Pin (Battery Registry)** | Có | Có | Có | Không | Hỗ trợ bộ lọc đa chiều (SoH, Model) |
| **Đăng ký Pack Pin mới xuất xưởng** | Có | Có | Không | Không | Ràng buộc duy nhất Serial Number |
| **In Tem Nhãn Mã QR kích thước chuẩn** | Có | Có | Có | Không | Định dạng vector nhiệt 50x30mm |
| **Nhập thông số đo kiểm dung lượng** | Có | Có | Có | Không | Tự động tính SoH, khóa Model gốc |
| **Phê duyệt lệnh đổi pin mới (< 70%)** | Có | Có | Không | Không | Căn cứ hợp đồng thuê pin VinFast |
| **Điều phối Pin vào Trạm sạc BESS** | Có | Có | Không | Không | Điều kiện $55\% \le \text{SoH} < 70\%$ |
| **Lập lệnh chuyển giao tái chế (< 55%)** | Có | Có | Không | Không | Bóc tách Lithium/Cobalt tại VinES |
| **Batch Import file Excel từ VinES** | Có | Có | Không | Không | Giới hạn 10 MB / 5.000 dòng, Atomic |
| **Quét mã QR tra cứu Hộ chiếu Công khai** | Có | Có | Có | **Có** | Endpoint mở, bảo vệ PII theo NĐ 13 |
| **Xuất Giấy Chứng Nhận PDF chuẩn EU** | Có | Có | Có | Có | File PDF có QR và chữ ký số băm |
| **Xem Nhật ký Kiểm toán (Audit Trail)** | Có | Có | Không | Không | Quyền chỉ đọc (Read-only immutable) |
| **Quản trị người dùng & Phân xưởng** | **Có** | Không | Không | Không | Phân quyền độc quyền của Admin HQ |

Tầng Backend API bắt buộc thực thi cưỡng chế phân quyền RBAC và token claims; việc ẩn/hiện các nút thao tác tại giao diện React chỉ phục vụ trải nghiệm người dùng (UI/UX).

## 2. Kiến Trúc Thông Tin, Phân Cấp Màn Hình & Giao Diện Người Dùng (Information Architecture)

Kiến trúc thông tin tổ chức không gian làm việc số hóa dựa trên năng lực nghiệp vụ thực tế của chuỗi xưởng dịch vụ và vòng đời pin VinFast. Phân quyền màn hình và điều hướng tuân thủ nghiêm ngặt ma trận RBAC, đồng thời mọi màn hình đều chuẩn hóa 8 trạng thái giao diện (Loading, Empty, Validation, API Error, 401, 403, Saving, Success).

### 2.1 Sơ Đồ Kiến Trúc Thông Tin & Thành Phần Màn Hình (Information Architecture Diagram)

Sơ đồ kiến trúc thông tin chi tiết hóa toàn bộ các màn hình, thành phần dữ liệu và chức năng nghiệp vụ trực quan:

```mermaid
flowchart TB
    subgraph publicPortal["1. Public Portal (Mobile-First — Khong Can Dang Nhap)"]
        direction LR
        scr01["<b>SCR-01: Dang Nhap Login</b><br/>• VinFast SSO / Email<br/>• JWT Credential Auth<br/>• Session Guard"]
        scr02["<b>SCR-02: Public Passport QR</b><br/>• SoH Health Gauge<br/>• Carbon Footprint kgCO2<br/>• Recycled Content Co/Ni/Li<br/>• Anonymous Service History<br/>• Download EU Cert PDF"]
    end

    subgraph workspace["2. Authenticated Workspace (Phan He Quan Tri & Van Hanh)"]
        direction TB
        
        subgraph row1["Phan He Tong Quan & Quan Ly Pack Pin"]
            direction LR
            scr10["<b>SCR-10: Dashboard SoH</b><br/>• 4 Life-cycle KPI Cards<br/>• SoH Distribution Chart<br/>• Degradation Curve<br/>• Delta V Cell Alerts"]
            scr20["<b>SCR-20: Battery Registry</b><br/>• Full Search & Filters<br/>• Life-cycle Status Badges<br/>• Server Pagination<br/>• Batch Action Toolbar"]
            scr21["<b>SCR-21: Create Passport</b><br/>• VinES Serial Number<br/>• LFP/NMC Chem Specs<br/>• Nominal Capacity kWh<br/>• EU Carbon & Recycled %"]
            scr22["<b>SCR-22: Passport Detail</b><br/>• 1-N Vehicle Timeline<br/>• Historic ODO Tracking<br/>• Multi-cycle SoH History<br/>• Export Action Trigger"]
            scr23["<b>SCR-23: QR Label Print</b><br/>• 100x75mm Live Preview<br/>• Public Passport URL QR<br/>• Industrial Thermal Print"]
        end

        subgraph row2["Phan He Do Kiem, Chan Doan & Second-Life BESS"]
            direction LR
            scr30["<b>SCR-30: Inspections Log</b><br/>• Diagnostic Event List<br/>• Delta V Status Filter<br/>• SoH Threshold Audit"]
            scr31["<b>SCR-31: Diagnostic Entry</b><br/>• C_measured & Impedance<br/>• Cell Vmax / Vmin Input<br/>• Auto SoH Calculation<br/>• Auto Swap Rule Warning"]
            scr32["<b>SCR-32: Swap Approval</b><br/>• 1-N Vin-Pack Rebinding<br/>• Old Pack SoH Audit<br/>• New Pack Allocation<br/>• Lead Signature Auth"]
            scr40["<b>SCR-40: Second-Life BESS</b><br/>• 55-70% SoH Buffer Pool<br/>• V-Green Fast Charger Hub<br/>• Container Cluster Map"]
            scr41["<b>SCR-41: Recycle Disposal</b><br/>• SoH Under 55% Scrapping<br/>• Black Mass Handover<br/>• Permanent Lock Event"]
        end

        subgraph row3["Phan He Quan Tri, Tich Hop & Kiem Toan"]
            direction LR
            scr50["<b>SCR-50: Excel Import</b><br/>• VinES Factory Batch File<br/>• In-browser Validation<br/>• Atomic Commit Process"]
            scr60["<b>SCR-60: Reports & PDF</b><br/>• EU Compliance Audit<br/>• Fleet Degradation Trends<br/>• Vector PDF Certificate"]
            scr70["<b>SCR-70: Audit Trail</b><br/>• Immutable Event Log<br/>• User IP & Timestamp<br/>• Before / After Diff JSON"]
            scr80["<b>SCR-80: User Admin</b><br/>• Account & Role Matrix<br/>• Service Workshop Bind<br/>• Active Status Switch"]
            scr81["<b>SCR-81: User Form Modal</b><br/>• Full Name & Staff Code<br/>• Role RBAC Assignment<br/>• Temporary Password"]
            scr85["<b>SCR-85/90: Profile & 403</b><br/>• Password & Sessions<br/>• RBAC Route Guard Safe Back"]
        end
    end

    publicPortal -.-> workspace
    scr20 -.-> scr21
    scr20 -.-> scr22
    scr20 -.-> scr23
    scr30 -.-> scr31
    scr30 -.-> scr32
    scr40 -.-> scr41
    scr80 -.-> scr81

    classDef publicStyle fill:#1e293b,stroke:#0f172a,color:#f8fafc
    classDef overview fill:#0088ff,stroke:#0055b3,color:#ffffff
    classDef inspection fill:#10b981,stroke:#059669,color:#ffffff
    classDef adminStyle fill:#6366f1,stroke:#4338ca,color:#ffffff
    classDef modalStyle fill:#f0f9ff,stroke:#0088ff,color:#0055b3
    
    class scr01,scr02 publicStyle
    class scr10,scr20 overview
    class scr21,scr22,scr23,scr31,scr32,scr41,scr81 modalStyle
    class scr30,scr40 inspection
    class scr50,scr60,scr70,scr80,scr85 adminStyle
    
    style publicPortal fill:#f8fafc,stroke:#94a3b8,stroke-dasharray: 4 4
    style workspace fill:#f0fdf4,stroke:#10b981,stroke-width:2px
    style row1 fill:#ffffff,stroke:#cbd5e1,stroke-width:1px
    style row2 fill:#ffffff,stroke:#cbd5e1,stroke-width:1px
    style row3 fill:#ffffff,stroke:#cbd5e1,stroke-width:1px
```

### 2.2 Sơ Đồ Cây Kiến Trúc Thông Tin (Sitemap Tree)

```text
VSF — VinFast Battery Passport & Second-Life Platform
│
├── Public Portal (Không cần đăng nhập, Mobile-First)
│   ├── /login                         [SCR-01: Đăng nhập xác thực nội bộ VinFast SSO]
│   └── /passport/:serialNumber        [SCR-02: Cổng Tra Cứu Hộ Chiếu Pin Công Khai (Mobile QR)]
│       └── Action: Tải Giấy Chứng Nhận Kiểm Định PDF Chuẩn EU
│
└── Authenticated Workspace (Bảo mật JWT & RBAC, Sidebar + Topbar)
    ├── /dashboard                     [SCR-10: Dashboard Giám Sát SoH & Cảnh Báo Pin Khẩn Cấp]
    ├── /batteries                     [SCR-20: Sổ Quản Lý Pack Pin Toàn Hệ Thống (Battery Registry)]
    │   ├── Modal: Khởi Tạo Hộ Chiếu Pin Mới                [SCR-21]
    │   ├── Modal / Drawer: Chi Tiết Hộ Chiếu & Lịch Sử Xe 1-N [SCR-22]
    │   └── Modal: Cấu Hình & In Tem Nhãn Mã QR Pack Pin     [SCR-23]
    ├── /inspections                   [SCR-30: Danh Mục Nhật Ký Đo Kiểm Dung Lượng & Cell]
    │   ├── Modal: Nhập Liệu Đo Dung Lượng & Đánh Giá SoH    [SCR-31]
    │   └── Modal: Phê Duyệt Lệnh Đổi Pin Mới Khi Lỗi Cell/SoH < 70% [SCR-32]
    ├── /second-life                   [SCR-40: Phân Hệ Điều Phối Pin Tái Sinh Trạm Sạc BESS]
    │   └── Modal: Phê Duyệt Lệnh Thanh Lý & Tái Chế Đen     [SCR-41]
    ├── /import                        [SCR-50: Nhập Lô Dữ Liệu Pin Xuất Xưởng Từ Excel (VinES)]
    ├── /reports                       [SCR-60: Trung Tâm Báo Cáo & Xuất Chứng Nhận EU Battery Passport]
    ├── /audit                         [SCR-70: Nhật Ký Kiểm Toán Toàn Hệ Thống (Audit Trail)]
    ├── /users                         [SCR-80: Quản Trị Tài Khoản Nhân Sự & Phân Xưởng Dịch Vụ]
    │   └── Modal: Tạo Mới / Cập Nhật Người Dùng            [SCR-81]
    ├── /profile                       [SCR-85: Hồ Sơ Cá Nhân & Đổi Mật Khẩu]
    └── /403                           [SCR-90: Màn Hình Từ Chối Truy Cập (Forbidden)]
```

### 2.3 Sơ Đồ Phân Cấp Màn Hình (Screen Hierarchy Flow)

Đăng nhập xác thực tại `SCR-01` dẫn trực tiếp vào Authenticated Shell. Không gian làm việc sở hữu thanh điều hướng bên (Sidebar) tương ứng với vai trò đăng nhập; các tương tác thêm mới, đo kiểm, phê duyệt đổi pin và in tem QR được mở thông qua các Modal chuyên dụng. Điều hướng vượt thẩm quyền được Router Guard chặn đứng và chuyển hướng an toàn về màn hình `SCR-90 Forbidden`.

```mermaid
flowchart TB
    Login["SCR-01 Login (Public)"]
    PublicQR["SCR-02 Tra Cứu QR Mobile (Public)"]
    Shell["Authenticated Workspace Shell"]
    
    Login -->|Xác thực hợp lệ| Shell
    PublicQR -->|Tải PDF| PDFExport["Xuất PDF Chứng Nhận EU"]
    
    Shell --> Dashboard["SCR-10 Dashboard SoH"]
    
    Shell --> Batteries["SCR-20 Sổ Pack Pin"]
    Batteries --> BattCreate["SCR-21 Tạo Hộ Chiếu Modal"]
    Batteries --> BattDetail["SCR-22 Chi Tiết Hộ Chiếu & Xe 1-N"]
    Batteries --> BattQR["SCR-23 In Tem QR Modal"]
    
    Shell --> Inspections["SCR-30 Đo Kiểm Dung Lượng"]
    Inspections --> InspCreate["SCR-31 Đo Kiểm SoH Modal"]
    Inspections --> SwapApprove["SCR-32 Duyệt Đổi Pin Modal"]
    
    Shell --> SecondLife["SCR-40 Điều Phối BESS"]
    SecondLife --> RecycleModal["SCR-41 Thanh Lý Tái Chế Modal"]
    
    Shell --> Import["SCR-50 Nhập Excel VinES"]
    Shell --> Reports["SCR-60 Báo Cáo & PDF EU"]
    Shell --> Audit["SCR-70 Nhật Ký Audit Log"]
    
    Shell --> Users["SCR-80 Quản Trị Nhân Sự"]
    Users --> UserModal["SCR-81 Tạo/Sửa User Modal"]
    
    Shell --> Profile["SCR-85 Hồ Sơ Cá Nhân"]
    Shell --> Forbidden["SCR-90 403 Forbidden"]

    classDef pub fill:#f8fafc,stroke:#94a3b8,color:#1e293b
    classDef authen fill:#0088ff,stroke:#0055b3,color:#fff
    classDef sub fill:#f0f9ff,stroke:#0088ff,color:#0055b3
    class Login,PublicQR pub
    class Shell,Dashboard,Batteries,Inspections,SecondLife,Import,Reports,Audit,Users,Profile,Forbidden authen
    class BattCreate,BattDetail,BattQR,InspCreate,SwapApprove,RecycleModal,UserModal,PDFExport sub
```

### 2.4 Bảng Danh Mục Màn Hình & Phân Quyền (Screen Inventory)

| Mã Màn Hình | Tên Màn Hình & Phân Hệ | Dạng Trình Bày | URL Route | Phân Quyền Truy Cập (RBAC) | Ca Sử Dụng Liên Quan |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **SCR-01** | Đăng Nhập Hệ Thống | Trang đơn (Public) | `#/login` | Tất cả | UC01, UC02 |
| **SCR-02** | Cổng Tra Cứu Hộ Chiếu Pin QR | Trang Mobile-First (Public) | `#/passport/:serialNumber` | Kiểm toán EU, Khách hàng, Public | UC06, UC13, UC14 |
| **SCR-10** | Dashboard Giám Sát SoH & Cảnh Báo | Trang chính Workspace | `#/dashboard` | Admin HQ, Station Lead, Kỹ thuật viên | UC03 |
| **SCR-20** | Sổ Quản Lý Pack Pin Hệ Thống | Trang bảng dữ liệu | `#/batteries` | Admin HQ, Station Lead, Kỹ thuật viên | UC04 |
| **SCR-21** | Đăng Ký Pin & Khởi Tạo Hộ Chiếu | Hộp thoại Modal | `#/batteries/new` | Admin HQ | UC05 |
| **SCR-22** | Chi Tiết Hộ Chiếu & Lịch Sử Xe 1-N | Hộp thoại Drawer / Modal | `#/batteries/:id` | Admin HQ, Station Lead, Kỹ thuật viên | UC04, UC06 |
| **SCR-23** | Cấu Hình & In Tem Nhãn Mã QR | Hộp thoại Modal | `#/batteries/:id/qr` | Station Lead, Kỹ thuật viên | UC07 |
| **SCR-30** | Danh Mục Nhật Ký Đo Kiểm SoH | Trang bảng dữ liệu | `#/inspections` | Admin HQ, Station Lead, Kỹ thuật viên | UC08 |
| **SCR-31** | Nhập Liệu Đo Dung Lượng & Lỗi Cell | Hộp thoại Modal | `#/inspections/new` | Station Lead, Kỹ thuật viên | UC08, UC09 |
| **SCR-32** | Phê Duyệt Lệnh Đổi Pin Mới Cho Xe | Hộp thoại Modal | `#/inspections/:id/swap` | Station Lead | UC09 |
| **SCR-40** | Điều Phối Tái Sinh Trạm Sạc BESS | Trang thẻ trạm & bảng | `#/second-life` | Admin HQ, Station Lead | UC10 |
| **SCR-41** | Phê Duyệt Lệnh Thanh Lý & Tái Chế | Hộp thoại Modal | `#/second-life/recycle` | Admin HQ, Station Lead | UC11 |
| **SCR-50** | Nhập Lô Dữ Liệu Pin Từ Excel | Trang thao tác tải tệp | `#/import` | Admin HQ | UC12 |
| **SCR-60** | Trung Tâm Báo Cáo & Xuất PDF EU | Trang tương tác lọc & xem | `#/reports` | Admin HQ, Station Lead | UC14 |
| **SCR-70** | Nhật Ký Kiểm Toán (Audit Trail) | Trang bảng bất biến | `#/audit` | Admin HQ, Station Lead | UC15 |
| **SCR-80** | Quản Trị Tài Khoản & Phân Xưởng | Trang bảng dữ liệu | `#/users` | Admin HQ | UC16 |
| **SCR-81** | Tạo Mới / Sửa Người Dùng | Hộp thoại Modal | `#/users/form` | Admin HQ | UC16 |
| **SCR-85** | Hồ Sơ Cá Nhân & Bảo Mật | Trang dạng Tabs | `#/profile` | Tất cả người dùng nội bộ | UC01, UC16 |
| **SCR-90** | Từ Chối Truy Cập (403 Forbidden) | Trang thông báo lỗi | `#/403` | Tất cả | Cross-cutting RBAC |

Đặc tả chi tiết từng thành phần giao diện, chức năng trong màn hình, hợp đồng 8 trạng thái UI/UX và luồng thao tác điển hình được duy trì đầy đủ tại tài liệu kỹ thuật [Kiến Trúc Thông Tin & Phân Cấp Giao Diện (Information Architecture)](docs/04-information-architecture.md).

### 3.3 Bản Vẽ Giao Diện Chi Tiết & Bộ Dữ Liệu Mẫu (UI/UX Wireframes & Mock Data)

Hệ thống giao diện được thiết kế theo ngôn ngữ nhận diện thương hiệu cao cấp **VinFast Electric High-Tech** (Tone màu xanh chủ đạo `#1462D2`, nền Navy tối `#0B192C`, mã màu trạng thái pin chuẩn quốc tế), tài liệu và bản vẽ chi tiết gồm:
* 🎨 [Hệ Thống Thiết Kế UI/UX VinFast (Design System & Guidelines)](docs/ui-ux/README.md)
* 📊 [Bản Vẽ Wireframe Màn Hình 1: Dashboard Sức Khỏe Pin & Giám Sát Mạng Lưới (SCR-10)](docs/ui-ux/01-dashboard-wireframe.md)
* ⚡ [Bản Vẽ Wireframe Màn Hình 2: Sổ Quản Lý Pack Pin & Modal Đo Kiểm Chẩn Đoán (SCR-20 & SCR-22)](docs/ui-ux/02-battery-registry-wireframe.md)
* 📱 [Bản Vẽ Wireframe Màn Hình 3: Cổng Hộ Chiếu Pin QR Di Động Chuẩn EU 2023/1542 (SCR-02)](docs/ui-ux/03-mobile-qr-portal-wireframe.md)
* 📦 [Tập Dữ Liệu Mẫu Đầy Đủ (Mock Data JSON chuẩn VinFast VF 3 đến VF 9)](docs/ui-ux/mock-data.json)

## 3. Kiến Trúc C4 (C4 Architecture)

### C1 — System Context

```mermaid
flowchart LR
    admin(["Quản Trị Viên VinFast"])
    lead(["Trưởng Xưởng / Trạm V-Green"])
    tech(["Kỹ Thuật Viên"])
    customer(["Khách Hàng / Kiểm Toán Viên EU"])

    subgraph VSF["VSF System Boundary"]
        core["VSF Platform<br/><i>[Phần mềm Quản lý Hộ chiếu & Vòng đời Pin]</i>"]
    end

    vgreen[("Hạ Tầng Trạm Sạc V-Green<br/><i>[Đối tác lưu trữ BESS]</i>")]
    vines[("Nhà Máy Sản Xuất VinES<br/><i>[File Excel xuất xưởng]</i>")]

    admin -- "Giám sát & ban hành chính sách" --> core
    lead -- "Phê duyệt đổi pin & điều phối BESS" --> core
    tech -- "Đo kiểm dung lượng & in tem QR" --> core
    customer -- "Quét QR tra cứu Hộ chiếu Pin" --> core
    core -- "Cung cấp pin thứ cấp cho trạm sạc" --> vgreen
    vines -- "Dữ liệu lô pin xuất xưởng" --> core

    style core fill:#1b365d,color:#fff
```

### C2 — Container

```mermaid
flowchart TB
    operator(["Kỹ thuật viên / Quản lý VinFast"])
    reader(["Người quét mã QR trên di động"])

    subgraph Platform["Hệ Thống VSF"]
        direction TB
        web["Web Frontend<br/><i>[React 19 + Vite]</i><br/>Portal quản trị nội bộ & Trang tra cứu QR di động"]
        backend[".NET Backend API<br/><i>[ASP.NET Core Web API]</i><br/>Xác thực JWT, RBAC, tính SoH, phân luồng BESS, xuất PDF"]
        database[("PostgreSQL 16<br/><i>[Database]</i><br/>Lưu thông số pin, lịch sử đo kiểm, audit log")]
    end

    workbook[("File Excel Lô Pin<br/><i>[Dữ liệu VinES]</i>")]

    operator --> web
    reader --> web
    web -- "REST / HTTPS / JSON" --> backend
    workbook -.->|"Upload qua giao diện web"| backend
    backend -- "Npgsql / SQL" --> database

    style web fill:#0088ff,color:#fff
    style backend fill:#1b365d,color:#fff
    style database fill:#10b981,color:#fff
```

### C3 — Component (.NET Backend)

```mermaid
flowchart TB
    subgraph Backend[".NET Backend Container"]
        api["Controllers Layer<br/><i>RESTful API, JWT Auth, RFC 7807 Errors</i>"]
        auth["Identity & Access Service<br/><i>Xác thực và phân quyền 4 roles</i>"]
        battery["Battery Management Service<br/><i>Quản lý danh mục pin, tính SoH, phân luồng</i>"]
        secondlife["Second-Life Coordinator<br/><i>Điều phối pin vào trạm sạc BESS</i>"]
        importer["Excel Batch Reader<br/><i>[ClosedXML] Đọc file nhà máy VinES</i>"]
        exporter["PDF Document Builder<br/><i>[QuestPDF] Xuất Chứng nhận EU Passport</i>"]
        audit["Audit Trail Service<br/><i>Lưu vết kiểm toán bất biến</i>"]
        repo["Persistence Layer<br/><i>PostgreSQL Repositories</i>"]
    end

    web["Web Frontend"]
    db[("PostgreSQL")]

    web --> api
    api --> auth
    api --> battery
    api --> secondlife
    api --> importer
    api --> exporter
    api --> audit
    auth --> repo
    battery --> repo
    secondlife --> repo
    importer --> repo
    audit --> repo
    repo --> db

    style api fill:#1b365d,color:#fff
    style battery fill:#0088ff,color:#fff
```

Tài liệu thiết kế kiến trúc chi tiết C4 Model:
- **Tổng quan mô hình C4:** [docs/architecture/c4/README.md](docs/architecture/c4/README.md)
- **C1 — System Context:** [docs/architecture/c4/01-system-context.md](docs/architecture/c4/01-system-context.md)
- **C2 — Container Diagram:** [docs/architecture/c4/02-container.md](docs/architecture/c4/02-container.md)
- **C3 — Component Diagram:** [docs/architecture/c4/03-component.md](docs/architecture/c4/03-component.md)
- **C4 — Code Collaboration Design:** [docs/architecture/c4/04-code.md](docs/architecture/c4/04-code.md)

---

## 4. Mô Hình Cơ Sở Dữ Liệu & Hợp Đồng OpenAPI 3.0

### 4.1 Sơ Đồ Thực Thể Liên Kết (ERD) & Cơ Sở Dữ Liệu

Mô hình PostgreSQL 16 (`vsf_core`) bao phủ trọn vẹn 13 bảng thực thể nghiệp vụ: Quản lý Pack Pin & Hộ Chiếu Số EU (EU 2023/1542), quan hệ hoán đổi 1-N giữa Xe điện và Pack Pin (`vehicles` & `vehicle_battery_histories`), nhật ký chẩn đoán đo kiểm dung lượng & cảnh báo lệch áp cell ($\Delta V > 0.05V$), phê duyệt lệnh đổi pin mới, điều phối tái sinh Trạm sạc V-Green BESS, bàn giao tái chế Black Mass và hệ thống Audit Log bất biến.

```mermaid
erDiagram
    workshops ||--o{ app_users : "employs"
    workshops ||--o{ batteries : "current_location"
    workshops ||--o{ vehicle_battery_histories : "service_location"
    workshops ||--o{ battery_inspections : "test_facility"

    batteries ||--|| battery_passports : "has_passport"
    batteries ||--o{ vehicle_battery_histories : "lifecycle_timeline"
    batteries ||--o{ battery_inspections : "inspected_in"
    batteries ||--o{ bess_allocations : "allocated_to"
    batteries ||--o| battery_recyclings : "disposed_to"

    vehicles ||--o{ vehicle_battery_histories : "battery_history"
    vehicles ||--o{ battery_inspections : "vehicle_tested"
    vehicles ||--o| batteries : "current_mounted_pack"

    battery_inspections ||--o| battery_swap_orders : "triggers_swap"
    bess_stations ||--o{ bess_allocations : "contains_packs"
    import_batches ||--o{ batteries : "imported_packs"

    app_users ||--o{ battery_inspections : "performed_by"
    app_users ||--o{ battery_swap_orders : "approved_by"
    app_users ||--o{ bess_allocations : "assigned_by"
    app_users ||--o{ battery_recyclings : "authorized_by"
    app_users ||--o{ import_batches : "uploaded_by"
    app_users ||--o{ audit_logs : "actor"

    workshops {
        bigint id PK
        varchar code UK
        varchar name
        varchar city
        boolean is_active
        timestamptz created_at
    }

    app_users {
        bigint id PK
        bigint workshop_id FK
        varchar email UK
        varchar password_hash
        varchar full_name
        varchar staff_code UK
        user_role role
        boolean is_active
    }

    batteries {
        bigint id PK
        varchar serial_number UK
        vehicle_model model_name
        cell_chemistry cell_chemistry
        numeric nominal_capacity_kwh
        numeric nominal_voltage_v
        lifecycle_status lifecycle_status
        numeric current_soh
        integer total_cycles
        bigint current_workshop_id FK
        bigint import_batch_id FK
        timestamptz deleted_at
    }

    battery_passports {
        bigint id PK
        bigint battery_id FK,UK
        varchar passport_id UK
        varchar qr_payload_url
        varchar data_matrix_hash
        varchar eu_declaration_of_conformity
        numeric carbon_footprint_total_kg_co2e_per_kwh
        varchar carbon_footprint_performance_class
        numeric recycled_cobalt_percent
        numeric recycled_lithium_percent
        numeric recycled_nickel_percent
        boolean safety_test_un38_3_certified
        passport_status passport_status
    }

    vehicles {
        bigint id PK
        varchar vin UK
        varchar license_plate UK
        vehicle_model model_name
        varchar customer_name
        bigint current_battery_id FK,UK
        integer total_odometer_km
        date registered_at
    }

    vehicle_battery_histories {
        bigint id PK
        bigint vehicle_id FK
        bigint battery_id FK
        swap_action action_type
        integer odometer_at_action
        numeric battery_soh_at_action
        timestamptz installed_at
        timestamptz removed_at
        bigint workshop_id FK
        bigint technician_id FK
    }

    battery_inspections {
        bigint id PK
        bigint battery_id FK
        bigint vehicle_id FK
        bigint workshop_id FK
        bigint technician_id FK
        timestamptz inspection_date
        numeric measured_capacity_kwh
        numeric calculated_soh
        numeric internal_resistance_mohm
        integer cycle_count_reading
        numeric v_max_volts
        numeric v_min_volts
        numeric v_delta_volts
        boolean has_cell_fault
        inspection_conclusion conclusion
    }

    battery_swap_orders {
        bigint id PK
        bigint inspection_id FK,UK
        bigint vehicle_id FK
        bigint old_battery_id FK
        bigint new_battery_id FK
        bigint station_lead_id FK
        swap_order_status status
        timestamptz approved_at
        timestamptz completed_at
    }

    bess_stations {
        bigint id PK
        varchar station_code UK
        varchar name
        bigint workshop_id FK
        numeric capacity_target_kwh
        numeric current_installed_kwh
        integer max_pack_slots
        integer active_pack_count
        boolean is_online
    }

    bess_allocations {
        bigint id PK
        bigint bess_station_id FK
        bigint battery_id FK,UK
        integer slot_number
        numeric allocated_soh
        timestamptz allocated_at
        timestamptz decommissioned_at
        bigint allocated_by FK
    }

    battery_recyclings {
        bigint id PK
        bigint battery_id FK,UK
        varchar partner_name
        date handover_date
        varchar handover_manifest_code
        numeric recovered_lithium_kg
        numeric recovered_cobalt_kg
        numeric recovered_nickel_kg
        bigint approved_by FK
    }

    import_batches {
        bigint id PK
        varchar batch_code UK
        varchar original_file_name
        integer total_rows
        integer successful_rows
        integer failed_rows
        import_status status
        bigint imported_by FK
        timestamptz imported_at
    }

    audit_logs {
        bigint id PK
        bigint actor_user_id FK
        varchar actor_email
        varchar actor_role
        varchar client_ip
        audit_action action
        varchar table_name
        varchar record_id
        jsonb old_values_json
        jsonb new_values_json
        timestamptz created_at
    }
```

Tài liệu thiết kế chi tiết cơ sở dữ liệu:
- **Đặc tả mô hình dữ liệu & ràng buộc:** [docs/05-data-model.md](docs/05-data-model.md)
- **Sơ đồ thực thể liên kết, phân nhóm & SQL Indexes:** [docs/DATABASE.md](docs/DATABASE.md)
- **Mã nguồn lược đồ DBML 2.0 chuẩn hóa:** [src/database/schema.dbml](src/database/schema.dbml)

### 4.2 Hợp Đồng Giao Tiếp OpenAPI 3.0.4 (REST API Specifications)

Hợp đồng API xác lập quy chuẩn kết nối giữa giao diện Web/Mobile và tầng máy chủ ASP.NET Core Web API. Toàn bộ 24 endpoints được tổ chức chặt chẽ theo 11 nhóm năng lực nghiệp vụ, bảo mật bằng chuẩn JWT Bearer, phân quyền RBAC (`x-roles`) và phản hồi lỗi chuẩn hóa theo RFC 7807 Problem Details (`application/problem+json`).

| Phân Hệ API (Tag) | Số Endpoint | Các Hoạt Động Cốt Lõi & Đường Dẫn Chính | Phân Quyền (RBAC) |
| :--- | :---: | :--- | :--- |
| **Authentication** | 4 | Đăng nhập (`/auth/login`), Đăng xuất, Lấy Profile (`/auth/me`), Đổi mật khẩu | Tất cả / Public |
| **Dashboard** | 3 | KPIs vòng đời (`/dashboard/metrics`), Biểu đồ SoH, Top cảnh báo lệch áp cell | Admin HQ, Lead, KTV |
| **Batteries** | 5 | Danh mục phân trang (`/batteries`), Khởi tạo hộ chiếu, Chi tiết, Lịch sử xe 1-N, In tem QR | Admin HQ, Lead, KTV |
| **Vehicles** | 2 | Danh sách xe điện (`/vehicles`), Chi tiết xe & tra cứu quả pin đang gắn theo VIN | Admin HQ, Lead, KTV |
| **Inspections** | 3 | Tra cứu nhật ký, Nhập số liệu đo đạc ($C_{\text{measured}}, V_{\text{max}}, V_{\text{min}}$) tự động tính SoH & $\Delta V$ | Lead, KTV |
| **Swaps** | 3 | Khởi tạo lệnh đổi pin, Trưởng xưởng duyệt đổi pin (`/swaps/:id/approve`), Từ chối | Station Lead, KTV |
| **SecondLife** | 3 | Danh sách trạm BESS, Kho pin $55-70\%$, Điều phối pin vào tủ rack container | Admin HQ, Station Lead |
| **Recycling** | 1 | Bàn giao pin $< 55\%$ thu hồi Black Mass, khóa vĩnh viễn Hộ chiếu số | Admin HQ, Station Lead |
| **Imports** | 2 | Xem trước kiểm tra lỗi file Excel (`/imports/preview`), Commit nguyên tử 5,000 pack | Admin HQ |
| **Public Portal** | 2 | Quét QR tra cứu Hộ chiếu Pin di động (`/public/passport/:serial`), Tải PDF chứng nhận | Public (Không cần Login) |
| **Governance** | 3 | Nhật ký kiểm toán bất biến (`/audit-logs`), Quản trị tài khoản nhân sự & xưởng | Admin HQ, Station Lead |

#### Mẫu cURL Quét Mã QR Tra Cứu Hộ Chiếu Pin Công Khai (Mobile QR)
```bash
curl --request GET \
  --url "http://localhost:5000/api/v1/public/passport/VF-BAT-VF8-2026-00892" \
  --header "Accept: application/json"
```

#### Mẫu cURL Kỹ Thuật Viên Nhập Số Liệu Đo Dung Lượng & Phát Hiện Lỗi Cell
```bash
curl --request POST \
  --url http://localhost:5000/api/v1/inspections \
  --header "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "batteryId": 108,
    "measuredCapacityKwh": 60.10,
    "internalResistanceMohm": 24.50,
    "cycleCountReading": 480,
    "vMaxVolts": 4.185,
    "vMinVolts": 4.120,
    "operatingTemperatureC": 28.5
  }'
```

Tài liệu chi tiết kỹ thuật API:
- **Tệp hợp đồng nguồn đầy đủ (57KB):** [docs/api/openapi.yaml](docs/api/openapi.yaml)
- **Hướng dẫn tích hợp & Lệnh cURL mẫu:** [docs/api/README.md](docs/api/README.md)

---

## 5. Cấu Trúc Thư Mục Frontend & Backend (Folder Structures)

Cấu trúc dự án tổ chức theo mô hình phân tách độc lập giữa Tầng Trình Diễn (Frontend) và Tầng Máy Chủ (Backend), tuân thủ nguyên tắc Clean Architecture 3 lớp và cấu trúc Feature-based của React 19.

### 5.1 Bố Cục Thư Mục Toàn Dự Án (Repository Layout)

```text
d:\VSF/
├── compose.yaml                         # Khởi chạy PostgreSQL 16 qua Docker
├── .env.example                         # Cấu hình chuỗi kết nối và JWT Secret
├── README.md                            # Tài liệu tổng quan toàn diện
│
├── docs/                                # Tài liệu kỹ thuật kiến trúc
│   ├── 01-scope.md … 08-invest-requirements.md
│   ├── DATABASE.md                      # Sơ đồ và từ điển dữ liệu
│   ├── api/
│   │   ├── openapi.yaml                 # Hợp đồng OpenAPI 3.0.4 đầy đủ
│   │   └── README.md                    # Hướng dẫn gọi API và mẫu request/response
│   └── architecture/
│       ├── c4/                          # Sơ đồ kiến trúc C1, C2, C3, C4
│       └── uml/                         # Sơ đồ Class Diagram & Sequence Diagram
│
└── src/
    ├── database/
    │   └── schema.dbml                  # Database Markup Language 2.0
    ├── backend/                         # ASP.NET Core Web API (Clean Architecture 3 lớp)
    │   ├── Vsf.Api/                     # Presentation: Controllers, Middleware, DTOs, Swagger
    │   ├── Vsf.Application/             # Core Domain: Services, SoH Calculation, Policy, Interfaces
    │   └── Vsf.Infrastructure/          # Data Access: PostgreSQL Repositories, ClosedXML, QuestPDF
    └── frontend/                        # React 19 + Vite + TailwindCSS
        ├── src/features/                # Phân hệ: auth, dashboard, batteries, inspections, second-life
        └── src/components/              # Shared components: Navbar, Sidebar, Modals, Tables
```

Chi tiết cấu trúc mô-đun và ánh xạ trách nhiệm được duy trì tại [Cấu Trúc Thư Mục (Folder Structure)](docs/07-folder-structure.md).

---

## 6. Thiết Kế Chi Tiết Lớp & Sơ Đồ Tuần Tự (Detailed Class and Sequence Design)

Thiết kế chi tiết cụ thể hóa các khối C4 Component thành các lớp C# thực thi (Controller, Service, Policy, Entity, Repository) và biểu diễn trình tự tương tác thời gian thực giữa các tầng.

### 6.1 C4 Level 4 — Cộng Tác Mã Nguồn (Code Collaboration)

#### L4.1 Luồng Đo Kiểm Chẩn Đoán & Phát Hiện Lỗi Cell (Inspection Pipeline)
```mermaid
flowchart TB
    subgraph inspectionModule["Inspection & Diagnostic Pipeline [Component Level]"]
        direction TB
        ctrl["InspectionsController<br/><i>[ASP.NET Core Controller]</i>"]
        svc["InspectionService<br/><i>[C# Service Class]</i>"]
        val["DiagnosticValidator<br/><i>[FluentValidation]</i>"]
        policy["CellFaultSafetyPolicy<br/><i>[Domain Policy: Delta V > 0.05V]</i>"]
        entity["BatteryInspection<br/><i>[Domain Entity]</i>"]
        battRepo["IBatteryRepository<br/><i>[C# Interface]</i>"]
        inspRepo["IBatteryInspectionRepository<br/><i>[C# Interface]</i>"]
        auditSvc["IAuditService<br/><i>[C# Interface]</i>"]

        ctrl --> val
        ctrl --> svc
        svc --> policy
        svc --> entity
        svc --> battRepo
        svc --> inspRepo
        svc --> auditSvc
    end

    db[("PostgreSQL Database<br/><i>[vsf_core]</i>")]
    battRepo --> db
    inspRepo --> db
    auditSvc --> db

    classDef c4main fill:#0088ff,color:#fff,stroke:#0055b3
    classDef c4core fill:#1b365d,color:#fff,stroke:#00205b
    classDef c4sub fill:#10b981,color:#fff,stroke:#059669
    class ctrl,svc c4core
    class val,policy,entity c4main
    class battRepo,inspRepo,auditSvc c4sub
```

#### L4.2 Luồng Phê Duyệt Đổi Pin Mới 1-N Nguyên Tử (Swap Pipeline)
```mermaid
flowchart TB
    subgraph swapModule["Atomic 1-N Battery Swap Pipeline [Component Level]"]
        direction TB
        swapCtrl["SwapsController<br/><i>[ASP.NET Core Controller]</i>"]
        swapSvc["SwapWorkflowService<br/><i>[C# Service Class]</i>"]
        authPolicy["LeadAuthorizationPolicy<br/><i>[Security Policy Class]</i>"]
        rebinder["VehicleBatteryRebinder<br/><i>[Domain Service: 1-N Rebinding]</i>"]
        uow["IUnitOfWork<br/><i>[Transaction Boundary]</i>"]
        swapRepo["ISwapOrderRepository<br/><i>[C# Interface]</i>"]
        vehRepo["IVehicleRepository<br/><i>[C# Interface]</i>"]

        swapCtrl --> authPolicy
        swapCtrl --> swapSvc
        swapSvc --> rebinder
        swapSvc --> uow
        rebinder --> swapRepo
        rebinder --> vehRepo
    end

    db[("PostgreSQL Database<br/><i>[vsf_core]</i>")]
    uow --> db
    swapRepo --> db
    vehRepo --> db

    classDef c4main fill:#0088ff,color:#fff,stroke:#0055b3
    classDef c4core fill:#1b365d,color:#fff,stroke:#00205b
    classDef c4sub fill:#10b981,color:#fff,stroke:#059669
    class swapCtrl,swapSvc c4core
    class authPolicy,rebinder c4main
    class uow,swapRepo,vehRepo c4sub
```

Đặc tả đầy đủ: [C4 Level 4 — Code](docs/architecture/c4/04-code.md).

### 6.2 Sơ Đồ Lớp Cốt Lõi (Core Class Diagrams)

Sơ đồ lớp chi tiết phân rã các lớp thực thi thuộc 3 phân hệ trọng yếu:

#### Phân Hệ Pack Pin & Hộ Chiếu Số EU
```mermaid
classDiagram
    direction TB

    class BatteriesController {
        +ListAsync(BatteryQueryRequest) Task~IActionResult~
        +GetByIdAsync(long) Task~IActionResult~
        +CreateAsync(CreateBatteryRequest) Task~IActionResult~
        +GetQrLabelAsync(long) Task~IActionResult~
    }

    class IBatteryService {
        <<interface>>
        +RegisterNewPackAsync(CreateBatteryDto) Task~Battery~
        +GenerateQrLabelAsync(long) Task~QrLabelDto~
    }

    class Battery {
        +long Id
        +string SerialNumber
        +VehicleModel ModelName
        +CellChemistry CellChemistry
        +decimal NominalCapacityKwh
        +decimal CurrentSoh
        +LifecycleStatus LifecycleStatus
        +BatteryPassport Passport
        +void UpdateSoh(decimal newSoh, int cycles)
    }

    class BatteryPassport {
        +long Id
        +string PassportId
        +string QrPayloadUrl
        +decimal CarbonFootprintKgCo2ePerKwh
        +decimal RecycledCobaltPercent
        +decimal RecycledLithiumPercent
        +decimal RecycledNickelPercent
        +bool SafetyTestUn38_3Certified
    }

    BatteriesController --> IBatteryService
    Battery --> BatteryPassport
```

Chi tiết đầy đủ 3 sơ đồ lớp phân hệ: [Sơ Đồ Lớp (Class Diagrams)](docs/architecture/uml/01-class-diagrams.md).

### 6.3 Sơ Đồ Tuần Tự Cốt Lõi (Sequence Diagrams)

#### Luồng 1: Đo Kiểm Chẩn Đoán Dung Lượng, Phát Hiện Lệch Áp Cell & Cảnh Báo Đổi Pin

```mermaid
sequenceDiagram
    autonumber
    actor Tech as 👤 Kỹ Thuật Viên
    participant UI as 💻 Web Workshop UI
    participant Ctrl as 🎮 InspectionsController
    participant Svc as ⚙️ InspectionService
    participant Policy as 🛡️ CellFaultSafetyPolicy
    participant Repo as 💾 IBatteryRepository
    participant DB as 🗄️ PostgreSQL

    Tech->>UI: Cắm máy chẩn đoán, nhập C_measured (60.1 kWh), V_max (4.185V), V_min (4.120V)
    Tech->>UI: Bấm "Lưu Kết Quả Đo Kiểm"
    activate UI
    UI->>Ctrl: POST /api/v1/inspections (Payload DTO)
    activate Ctrl

    Ctrl->>Svc: ExecuteInspectionAsync(dto, userContext)
    activate Svc
    Svc->>Repo: GetBatteryByIdAsync(batteryId)
    Repo->>DB: SELECT * FROM batteries WHERE id = @id
    DB-->>Repo: Pack VF8 (Dung lượng định danh = 87.70 kWh)
    Repo-->>Svc: Battery Entity

    Svc->>Svc: Tính SoH = (60.10 / 87.70) * 100 = 68.53%
    Svc->>Policy: EvaluateCellImbalance(4.185V, 4.120V)
    Policy-->>Svc: Delta V = 0.065V > 0.050V (CẢNH BÁO LỆCH ÁP CELL KHẨN CẤP)

    Svc->>Repo: SaveInspectionRecordAsync(inspection)
    Repo->>DB: INSERT INTO battery_inspections (..., calculated_soh=68.53, v_delta=0.065, has_cell_fault=true)
    Svc->>Repo: UpdateBatteryStatusAsync(batteryId, 68.53, RECALL_PENDING)
    Repo->>DB: UPDATE batteries SET current_soh=68.53, lifecycle_status='RECALL_PENDING'

    Svc-->>Ctrl: InspectionResult (Conclusion: FAIL_CELL_VOLTAGE_FAULT, RequiresSwap: true)
    deactivate Svc

    Ctrl-->>UI: HTTP 201 Created (Hiển thị cảnh báo đỏ & mở Modal đổi pin)
    deactivate Ctrl
    UI-->>Tech: Thông báo: "Độ lệch cell 0.065V vượt ngưỡng an toàn! Đã chuyển trạng thái RECALL_PENDING"
    deactivate UI
```

Đặc tả đầy đủ 4 luồng tuần tự tương tác thời gian thực: [Sơ Đồ Tuần Tự (Sequence Diagrams)](docs/architecture/uml/02-sequence-diagrams.md).

---

## 7. Tài Khoản Khởi Tạo Mẫu (Development Seed Users)

Tất cả tài khoản trong hệ thống sử dụng chung mật khẩu phát triển:
> **Mật khẩu chung:** `ChangeMe123!`

| Tài Khoản (Email) | Vai Trò | Trụ Sở / Đơn Vị Công Tác |
|---|:---:|---|
| `admin.hq@vinfast.vn` | **ADMIN_HQ** | Ban Quản Trị Trụ Sở Chính VinFast |
| `lead.longbien@vinfast.vn` | **STATION_LEAD** | Xưởng Dịch Vụ VinFast Center Long Biên - Hà Nội |
| `lead.vgreen@v-green.vn` | **STATION_LEAD** | Cụm Trạm Sạc Tích Điện Đệm V-Green BESS |
| `tech.an@vinfast.vn` | **TECHNICIAN** | Kỹ Thuật Viên Xưởng VinFast Center Long Biên |
| `auditor.tuv@tuv-sud.de` | **AUDITOR_PUBLIC** | Chuyên Viên Kiểm Toán TÜV SÜD (Châu Âu) |

---

## 8. Tiến Độ Dự Án (Project Progress)

- [x] **Bước 1:** Nghiên cứu Top-Down và phân tích quy chuẩn EU Battery Regulation 2023/1542 (`01-scope.md`, Mindmap tổng & phân nhánh)
- [x] **Bước 2:** Lập danh mục tính năng, 16 User Stories INVEST và Sơ đồ Use Cases chuẩn hóa (`02-features.md`, `03-use-cases.md`, `08-invest-requirements.md`)
- [x] **Bước 3:** Thiết kế Kiến trúc Thông tin (IA), sitemap 19 màn hình và hợp đồng 8 trạng thái UI/UX (`04-information-architecture.md`)
- [x] **Bước 4:** Thiết kế Cơ sở Dữ liệu PostgreSQL 16, DBML 2.0 và chiến lược Indexing dưới 50ms (`05-data-model.md`, `DATABASE.md`, `schema.dbml`)
- [x] **Bước 5:** Soạn thảo Hợp đồng API OpenAPI 3.0.4 bao phủ 24 endpoints qua 11 tags (`docs/api/openapi.yaml`, `docs/api/README.md`)
- [x] **Bước 6:** Thiết kế Kiến trúc C4 đầy đủ 4 cấp độ (C1, C2, C3, C4) (`docs/architecture/c4/`)
- [x] **Bước 7:** Thiết kế Sơ đồ Lớp (Class Diagrams) và 4 Sơ đồ Tuần tự (Sequence Diagrams) (`docs/architecture/uml/`)
- [x] **Bước 8:** Hoạch định Cấu trúc Thư mục Clean Architecture 3 lớp và React Feature-based (`07-folder-structure.md`)
- [ ] **Bước 9:** Triển khai mã nguồn Backend ASP.NET Core 9 (Deferred - Chờ lệnh người dùng)
- [ ] **Bước 10:** Triển khai giao diện React 19 + Vite (Deferred - Chờ lệnh người dùng)
