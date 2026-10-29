# Kiến Trúc C4 — VSF (VinFast Battery Passport)

Tài liệu này đặc tả kiến trúc hệ thống VSF theo mô hình C4 (C1 System Context, C2 Container, C3 Component, C4 Code).

## C1 — System Context (Ngữ cảnh Hệ thống)

```mermaid
flowchart LR
    admin(["Quản Trị Viên VinFast"])
    lead(["Trưởng Xưởng Dịch Vụ / Trạm V-Green"])
    tech(["Kỹ Thuật Viên Đo Kiểm"])
    publicUser(["Khách Hàng / Kiểm Toán Viên EU"])

    subgraph VSF["VSF System [Software System]"]
        core["VinFast Battery Passport & Second-Life Platform<br/><i>Quản lý hộ chiếu số, SoH, thu hồi đổi pin và trạm tích điện BESS</i>"]
    end

    vgreen[("Mạng Lưới Trạm Sạc V-Green<br/><i>[Hạ tầng đối tác]</i>")]
    vines[("Nhà Máy Sản Xuất VinES Hải Phòng<br/><i>[Nguồn dữ liệu xuất xưởng]</i>")]

    admin -- "Cấu hình chính sách & giám sát toàn quốc" --> core
    lead -- "Phê duyệt đổi pin & điều phối trạm BESS" --> core
    tech -- "Đo kiểm dung lượng & in tem mã QR" --> core
    publicUser -- "Quét mã QR tra cứu Hộ chiếu Pin" --> core
    core -- "Cung cấp pack pin thứ cấp cho trạm sạc" --> vgreen
    vines -- "Nhập dữ liệu lô pin qua file Excel" --> core

    style core fill:#1b365d,color:#fff
```

## C2 — Container Diagram (Các Khối Thành Phần)

```mermaid
flowchart TB
    operator(["Kỹ thuật viên / Quản lý VinFast"])
    reader(["Người quét mã QR trên điện thoại"])

    subgraph Platform["VSF Software System Boundary"]
        direction TB
        subgraph presentation["Tầng Trình Diễn (Presentation)"]
            web["Web Frontend<br/><i>[Container: React 19 + Vite]</i><br/>Portal quản trị nội bộ & Trang tra cứu QR di động"]
        end
        subgraph application["Tầng Ứng Dụng (Application)"]
            backend[".NET Backend API<br/><i>[Container: ASP.NET Core Web API]</i><br/>Xác thực JWT, RBAC, tính SoH, phân luồng BESS, đọc Excel & xuất PDF"]
        end
        subgraph data["Tầng Dữ Liệu (Data)"]
            database[("PostgreSQL 16<br/><i>[Container: Database]</i><br/>Lưu thông số pin, lịch sử đo kiểm, trạm BESS, user và audit log")]
        end
    end

    workbook[("File Excel Lô Pin<br/><i>[Tệp dữ liệu VinES]</i>")]

    operator --> web
    reader --> web
    web -- "REST / HTTPS / JSON" --> backend
    workbook -.->|"Upload qua giao diện web"| backend
    backend -- "Npgsql / SQL" --> database

    style web fill:#0088ff,color:#fff
    style backend fill:#1b365d,color:#fff
    style database fill:#10b981,color:#fff
```

## C3 — Component Diagram (Cấu Trúc Tầng Backend API)

```mermaid
flowchart TB
    subgraph rt[".NET Backend [Container]"]
        direction TB
        api["Controllers / HTTP API<br/><i>[ASP.NET Core]</i><br/>Định tuyến RESTful, xác thực JWT, map DTO và lỗi RFC 7807"]
        auth["Identity & Access Component<br/><i>Đăng nhập, mã hóa PBKDF2, phân quyền 4 vai trò</i>"]
        battery["Battery Management Component<br/><i>Quản lý danh mục pin, tính toán SoH, tự động kích hoạt bảo hành</i>"]
        secondlife["Second-Life Coordinator<br/><i>Điều phối pin 55-70% vào các trạm tích điện V-Green BESS</i>"]
        importer["Excel Import Engine<br/><i>[ClosedXML] Phân tích file xuất xưởng, preview và batch save</i>"]
        exporter["PDF Document Generator<br/><i>[QuestPDF] Xuất Giấy chứng nhận pin đạt chuẩn EU</i>"]
        audit["Audit Trail Component<br/><i>Ghi vết bất biến mọi hành vi kiểm định và đổi trạng thái</i>"]
        repo["Persistence Layer<br/><i>PostgreSQL Repositories & Unit of Work</i>"]
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
    importer --> battery
    importer --> repo
    audit --> repo
    repo --> db

    style api fill:#1b365d,color:#fff
    style battery fill:#0088ff,color:#fff
```
