# Cấu Trúc Thư Mục Chuẩn Công Nghiệp (Folder Structure)

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
│   │   ├── openapi.yaml                 # Hợp đồng OpenAPI 3.0 đầy đủ
│   │   └── README.md                    # Hướng dẫn gọi API và mẫu request/response
│   ├── architecture/
│   │   ├── c4/                          # Sơ đồ kiến trúc C1, C2, C3, C4
│   │   └── uml/                         # Sơ đồ Class Diagram & Sequence Diagram
│   └── requirements/                    # Quy tắc nghiệp vụ và tiêu chuẩn phi chức năng
│
└── src/
    ├── database/
    │   ├── vsf_battery.sql              # Schema DDL, Triggers, Views, Dữ liệu mẫu VinFast
    │   └── vsf_battery.dbml             # Database Markup Language
    ├── backend/                         # ASP.NET Core Web API (Clean Architecture 3 lớp)
    │   ├── Vsf.Api/                     # Controllers, Middleware, DTOs, Swagger
    │   ├── Vsf.Application/             # Business Logic, SoH Calculation, Policy, Interfaces
    │   └── Vsf.Infrastructure/          # PostgreSQL Repositories, Excel Reader, QuestPDF
    └── frontend/                        # React 19 + Vite + Lucide Icons + Chart.js
        ├── src/
        │   ├── components/              # Shell, Navbar, Sidebar, QR Card
        │   ├── features/                # Dashboard, Batteries, Inspections, SecondLife
        │   ├── pages/                   # PublicPassportPage, LoginPage, UsersPage
        │   └── lib/                     # API Client, Auth Store, Formatters
        └── public/
            └── samples/                 # File Excel mẫu lô pin VinFast xuất xưởng
```
