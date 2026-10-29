# VSF — VinFast Battery Passport & Second-Life Platform

**Hệ thống Hộ chiếu Số & Quản trị Vòng đời Tái sinh Pin Xe Điện VinFast**  
Tuân thủ tiêu chuẩn pin Châu Âu (*EU Battery Regulation 2023/1542*) và chính sách bảo hành đổi pin miễn phí của VinFast.

---

## 1. Yêu Cầu Nghiệp Vụ — INVEST, Use Cases & Phân Quyền

Hệ thống giải quyết bài toán cốt lõi: Quản trị toàn bộ vòng đời của hàng chục nghìn pack pin xe điện VinFast (từ VF 3, VF 5, VF 6, VF 7, VF 8, VF 9) từ lúc xuất xưởng tại nhà máy VinES Hải Phòng, vận hành trên đường, kiểm định đo chai pin (SoH) định kỳ, kích hoạt đổi pin miễn phí khi SoH < 70%, đến khi tái sinh làm trạm tích điện đệm (BESS) cho mạng lưới trạm sạc V-Green.

### 1.1 Product mind map

Hệ thống **VSF** được trực quan hóa toàn diện qua Bản đồ Tư duy Sản phẩm (Product Mind Map), bao gồm sơ đồ tổng quan và hai cụm phân hệ nghiệp vụ chi tiết:

#### A. Bức tranh Tổng quan Toàn hệ thống (High-Level Overview)

![VSF Product mind map - Tổng quan](docs/mindmap.png)

#### B. Phân hệ Cổng Hộ Chiếu QR, Quản Trị Pack Pin & Tái Sinh Second-Life BESS

![Phân hệ Hộ chiếu QR Di động & Quản trị Vòng đời Pin](docs/images/mindmap-passport-lifecycle.png)

#### C. Phân hệ Kiểm Định Dung Lượng SoH, Báo Cáo Excel & Quản Trị Hệ Thống

![Phân hệ Kiểm định & Quản trị Hệ thống](docs/images/mindmap-inspection-ops.png)

### 1.2 Sơ đồ Ca Sử Dụng (Use Cases)

```mermaid
flowchart TB
    subgraph roles["Các Tác Nhân (Actors)"]
        direction LR
        admin(["Quản Trị Viên (Admin)"])
        lead(["Trưởng Xưởng Dịch Vụ / Trạm V-Green"])
        tech(["Kỹ Thuật Viên Đo Kiểm"])
        viewer(["Kiểm Toán Viên / Khách Quét QR"])
    end

    subgraph system["VSF — Ranh Giới Hệ Thống"]
        direction LR
        adminCases["<b>Quản Trị Viên</b><br/><br/>UC01 Đăng nhập · UC02 Đăng xuất<br/>UC03 Xem Dashboard Vòng đời Pin<br/>UC14 Quản lý Nhân sự & Phân quyền<br/>UC15 Xem Nhật ký Kiểm toán (Audit Log)<br/>UC16 Cấu hình Ngưỡng Bảo hành Pin"]
        leadCases["<b>Trưởng Xưởng Dịch Vụ</b><br/><br/>UC03 Xem Dashboard Vòng đời Pin<br/>UC04 Xem Danh sách Pack Pin Toàn quốc<br/>UC08 Phê duyệt Đổi Pin mới (SoH < 70%)<br/>UC09 Điều phối Pin vào Trạm sạc BESS<br/>UC10 Phê duyệt Thanh lý Tái chế (Recycle)<br/>UC11 Import Lô Pin mới từ Excel<br/>UC12 Xuất Báo cáo Chứng nhận PDF"]
        techCases["<b>Kỹ Thuật Viên</b><br/><br/>UC03 Xem Dashboard Vòng đời Pin<br/>UC04 Xem Danh sách Pack Pin<br/>UC05 Tra cứu Hồ sơ Pin qua Serial / QR<br/>UC06 Nhập Số liệu Đo đạc & Tính SoH<br/>UC07 In Tem Nhãn QR dán lên Vỏ Pin"]
        viewerCases["<b>Kiểm Toán Viên / Khách Hàng</b><br/><br/>UC05 Tra cứu Hồ sơ Pin qua Serial / QR<br/>UC13 Quét Mã QR xem Hộ chiếu Pin Công khai<br/>UC12 Tải Chứng chỉ Sức khỏe Pin (PDF)"]
    end

    admin --> adminCases
    lead --> leadCases
    tech --> techCases
    viewer --> viewerCases

    classDef actor fill:#333,color:#fff,stroke:#000
    classDef primary fill:#1b365d,color:#fff,stroke:#00205b
    classDef techStyle fill:#0088ff,color:#fff,stroke:#0055b3
    classDef auditStyle fill:#10b981,color:#fff,stroke:#059669
    class admin,lead,tech,viewer actor
    class adminCases,leadCases primary
    class techCases techStyle
    class viewerCases auditStyle
```

### 1.3 Ma Trận Phân Quyền (Roles & Permissions)

| Chức Năng Nghiệp Vụ | Admin | Station Lead | Technician | Viewer / Public |
|---|:---:|:---:|:---:|:---:|
| **Xem Dashboard & Danh sách Pin** | Có | Có | Có | Có (Chỉ xem) |
| **Nhập kết quả kiểm định & Đo SoH** | Có | Có | Có | Không |
| **Phê duyệt Đổi pin miễn phí (<70%)** | Có | Có | Không | Không |
| **Điều phối Pin vào Trạm sạc BESS** | Có | Có | Không | Không |
| **Import lô pin từ Excel (VinES)** | Có | Có | Không | Không |
| **In tem nhãn QR & Xuất PDF** | Có | Có | Có | Có |
| **Xem Nhật ký hoạt động (Audit log)** | Có | Có | Không | Không |
| **Quản trị người dùng & Phân vai trò** | **Có** | Không | Không | Không |

---

## 2. Kiến Trúc Thông Tin & Giao Diện Người Dùng

```text
Public Gateway (Không cần login)
├── /login                         [Đăng nhập xác thực nội bộ]
└── /passport/:serialNumber        [Tra cứu Hộ chiếu Pin QR dành cho Mobile]

Authenticated Workspace
├── /dashboard                     [KPIs vòng đời & Biểu đồ phân bố SoH]
├── /batteries                     [Sổ Quản lý Pack Pin toàn hệ thống]
├── /inspections                   [Nhật ký Đo đạc & Lịch sử Kiểm định]
├── /second-life                   [Phân luồng Tái sinh Trạm sạc V-Green BESS]
├── /import                        [Nhập lô Pin mới từ Excel]
├── /reports                       [Xuất Báo cáo & Chứng nhận Kiểm định PDF]
├── /audit                         [Nhật ký Kiểm toán Toàn hệ thống]
├── /users                         [Quản trị Tài khoản & Phân quyền Xưởng]
└── /profile                       [Hồ sơ Cá nhân & Đổi Mật khẩu]
```

---

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

---

## 4. Mô Hình Cơ Sở Dữ Liệu & Hợp Đồng OpenAPI 3.0

### 4.1 Sơ Đồ Thực Thể (ERD)

```mermaid
erDiagram
    app_users ||--o{ battery_inspections : inspects
    app_users ||--o{ second_life_deployments : approves
    app_users ||--o{ import_batches : imports
    app_users ||--o{ audit_logs : triggers

    battery_models ||--o{ battery_packs : classifies
    battery_packs ||--o{ battery_inspections : records
    battery_packs ||--o{ second_life_deployments : repurposes

    battery_models {
        bigint id PK
        varchar model_code UK "VF3, VF5, VF8, VF9"
        varchar model_name
        battery_chemistry chemistry "LFP, NMC"
        numeric design_capacity_kwh
        numeric nominal_voltage
        numeric warranty_soh_threshold "70.00%"
    }

    battery_packs {
        bigint id PK
        varchar serial_number UK "Mã QR Hộ chiếu số"
        bigint model_id FK
        varchar vehicle_vin
        varchar vehicle_plate
        date manufacture_date
        numeric current_soh_percent "Điểm sức khỏe SoH"
        int cycle_count "Số chu kỳ sạc"
        battery_status status "ON_VEHICLE, RECALL_PENDING..."
        numeric carbon_footprint_kg_co2
    }

    battery_inspections {
        bigint id PK
        bigint pack_id FK
        date inspection_date
        numeric measured_capacity_kwh
        numeric calculated_soh_percent
        numeric internal_resistance_mohm
        varchar station_name
        bigint inspector_id FK
    }

    second_life_deployments {
        bigint id PK
        bigint pack_id FK
        varchar bess_station_code "Trạm sạc V-Green"
        date deployment_date
        numeric initial_soh_at_deploy
        varchar cluster_position "Vị trí tủ rack"
        bigint approved_by FK
    }

    audit_logs {
        bigint id PK
        bigint actor_user_id FK
        audit_action action
        varchar entity_name
        bigint entity_id
        jsonb details
        timestamptz created_at
    }
```

- File DDL chi tiết: [src/database/vsf_battery.sql](src/database/vsf_battery.sql)
- DBML quan hệ: [src/database/vsf_battery.dbml](src/database/vsf_battery.dbml)
- Hợp đồng API: [docs/api/openapi.yaml](docs/api/openapi.yaml)

---

## 5. Sơ Đồ Tuần Tự Cốt Lõi (Sequence Diagrams)

### Luồng Kiểm Định Pin & Tự Động Kích Hoạt Đổi Pin Miễn Phí (< 70%)

```mermaid
sequenceDiagram
    actor Tech as Kỹ Thuật Viên (Technician)
    participant UI as Giao diện Xưởng VinFast
    participant API as InspectionsController
    participant Svc as BatteryService
    participant Repo as IBatteryRepository
    participant Audit as IAuditService
    participant DB as PostgreSQL

    Tech->>UI: Nhập dung lượng đo thực tế (25.46 kWh), Odo, chu kỳ
    Tech->>UI: Bấm "Lưu kết quả kiểm định"
    activate UI
    UI->>API: POST /api/v1/inspections (Payload kiểm định)
    activate API

    API->>Svc: ProcessInspectionAsync(draft, actorContext)
    activate Svc

    Svc->>Repo: GetBatteryWithModelAsync(serialNumber)
    Repo->>DB: SELECT pack, model WHERE serial_number = @serial
    DB-->>Repo: Trả về pack VF 5 Plus (Dung lượng gốc = 37.23 kWh)
    Repo-->>Svc: BatteryPack & Model

    Svc->>Svc: CalculateSoh: (25.46 / 37.23) * 100 = 68.39%
    Svc->>Svc: DetermineLifecycleStatus: 68.39% < 70.00% -> RECALL_PENDING

    Svc->>Repo: AddInspectionAsync(inspectionRecord)
    Svc->>Repo: UpdateBatteryStatusAsync(packId, 68.39%, RECALL_PENDING)
    Repo->>DB: INSERT inspection & UPDATE battery_packs

    Svc->>Audit: LogActionAsync("STATUS_CHANGE", "Kích hoạt bảo hành đổi pin miễn phí cho khách hàng")
    Audit->>DB: INSERT audit_logs

    Svc-->>API: InspectionResult (SoH: 68.39%, Status: RECALL_PENDING)
    deactivate Svc

    API-->>UI: HTTP 201 Created (Kèm cảnh báo đổi pin màu đỏ)
    deactivate API
    UI-->>Tech: Hiển thị thông báo: "Đã kích hoạt lệnh đổi pin mới VinFast!"
    deactivate UI
```

---

## 6. Tài Khoản Khởi Tạo Mẫu (Development Seed Users)

Tất cả tài khoản trong hệ thống sử dụng chung mật khẩu phát triển:
> **Mật khẩu chung:** `ChangeMe123!`

| Tài Khoản (Email) | Vai Trò | Trụ Sở / Đơn Vị |
|---|:---:|---|
| `admin@vinfast.vn` | **ADMIN** | Trụ sở chính VinFast |
| `lead.hanoi@vinfast.vn` | **STATION_LEAD** | VinFast Service Center Phạm Văn Đồng - Hà Nội |
| `tech.nam@vinfast.vn` | **TECHNICIAN** | VinFast Service Center Phạm Văn Đồng - Hà Nội |
| `auditor@eu-tuv.de` | **AUDITOR** | TÜV Rheinland Battery Certification (Châu Âu) |

---

## 7. Tiến Độ Dự Án (Project Progress)

- [x] Nghiên cứu đề bài và phân tích quy chuẩn EU Battery Regulation 2023/1542
- [x] Xác định phạm vi và chính sách bảo hành đổi pin miễn phí của VinFast (<70%)
- [x] Lập danh sách tính năng và 16 User Stories chuẩn INVEST
- [x] Thiết kế ma trận phân quyền 4 Roles (Admin, Station Lead, Technician, Auditor)
- [x] Thiết kế Kiến trúc Thông tin (IA) và phân cấp màn hình
- [x] Thiết kế Sơ đồ Kiến trúc C4 (C1 System Context, C2 Container, C3 Component)
- [x] Thiết kế Mô hình Dữ liệu PostgreSQL DDL, DBML, Triggers và Seeds
- [x] Soạn thảo Hợp đồng API OpenAPI 3.0.4
- [x] Thiết kế Class Diagrams và Sequence Diagrams cho các luồng nghiệp vụ cốt lõi
- [x] Tạo cấu trúc thư mục dự án và thiết lập môi trường Docker Compose
- [ ] Xây dựng tầng Backend API ASP.NET Core (.NET 9) ba lớp
- [ ] Xây dựng giao diện React 19 + Vite (Portal quản trị & Trang QR di động)
- [ ] Tích hợp tính năng Import Excel và xuất file Chứng chỉ PDF
- [ ] Viết Unit Tests và Integration Tests
