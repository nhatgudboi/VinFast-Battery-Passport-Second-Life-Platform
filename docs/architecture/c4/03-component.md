# C3 — Component Diagram (Cấu Trúc Tầng .NET Backend API) — VSF

> **Mục đích:** Zoom vào khối Container **.NET Backend API** để phân rã cấu trúc module, luồng điều hướng nghiệp vụ và sự cộng tác giữa các thành phần dịch vụ nội bộ.

---

## 1. Sơ Đồ Cấu Trúc Thành Phần C3

```mermaid
flowchart TB
    subgraph backend[".NET Backend API [Container Boundary]"]
        direction TB

        subgraph entry["Tầng Giao Tiếp HTTP (Transport & Routing)"]
            api["Controllers / HTTP Endpoints<br/><i>[ASP.NET Core Controllers]</i><br/>Định tuyến 24 endpoints RESTful, xác thực Header,<br/>validate DTOs và chuẩn hóa lỗi RFC 7807"]
        end

        subgraph security["Tầng Xác Thực & Phân Quyền (Security Layer)"]
            identity["Identity & RBAC Component<br/><i>Xác thực JWT Token, kiểm tra thẩm quyền vai trò (x-roles)<br/>và quản lý phiên làm việc</i>"]
        end

        subgraph domain["Tầng Dịch Vụ Nghiệp Vụ Cốt Lõi (Core Domain Services)"]
            direction TB
            batterySvc["Battery & Passport Component<br/><i>Quản lý danh mục pack pin, tạo Hộ chiếu số EU,<br/>quản lý trạng thái vòng đời và sinh tem QR</i>"]
            vehicleSvc["Vehicle & 1-N Binding Component<br/><i>Quản lý danh mục xe điện VinFast, truy vết lịch sử<br/>hoán đổi đa kỳ giữa xe và pin theo thời gian/ODO</i>"]
            diagnosticSvc["Diagnostics & Cell Fault Component<br/><i>Thuật toán tính SoH = (C_measured / C_nominal) * 100,<br/>phát hiện lệch áp cell Delta V > 0.05V, cảnh báo hỏng cell</i>"]
            swapSvc["Swap Workflow Coordinator<br/><i>Quản lý quy trình phê duyệt đổi pin mới,<br/>thực thi hoán đổi quan hệ 1-N nguyên tử</i>"]
            secondLifeSvc["Second-Life BESS Coordinator<br/><i>Điều phối pin 55-70% SoH vào tủ rack trạm sạc V-Green,<br/>theo dõi công suất tích điện đệm</i>"]
            recyclingSvc["Recycling Handover Component<br/><i>Thanh lý pin < 55%, bàn giao thu hồi Black Mass<br/>và khóa vĩnh viễn Hộ chiếu số</i>"]
            importEngine["Excel Batch Import Engine<br/><i>[ClosedXML] Phân tích file xuất xưởng VinES,<br/>preview kiểm tra lỗi và commit hàng loạt</i>"]
            reportEngine["PDF & Compliance Generator<br/><i>[QuestPDF] Xuất Giấy chứng nhận EU Battery Passport<br/>và báo cáo phân tích suy hao dung lượng</i>"]
            auditComponent["Audit Trail Component (SEC-AUDIT-001)<br/><i>Ghi nhận nhật ký kiểm toán bất biến,<br/>tự động lọc bỏ PII nhạy cảm</i>"]
        end

        subgraph persistence["Tầng Truy Xuất Dữ Liệu (Persistence Layer)"]
            repo["Repositories & Unit of Work<br/><i>[EF Core 9 / Npgsql] Quản lý Database Transactions,<br/>thực thi câu lệnh SQL tối ưu và quản lý Connection Pool</i>"]
        end
    end

    web["Web Management Portal<br/><i>[React 19]</i>"]
    mobile["Mobile QR Viewer<br/><i>[Mobile Browser]</i>"]
    db[("PostgreSQL 16<br/><i>[Database]</i>")]

    web --> api
    mobile --> api

    api --> identity
    api --> batterySvc
    api --> vehicleSvc
    api --> diagnosticSvc
    api --> swapSvc
    api --> secondLifeSvc
    api --> recyclingSvc
    api --> importEngine
    api --> reportEngine
    api --> auditComponent

    diagnosticSvc -.->|"SoH < 70% hoặc lỗi cell"| swapSvc
    swapSvc --> vehicleSvc
    swapSvc --> batterySvc
    importEngine --> batterySvc

    batterySvc --> repo
    vehicleSvc --> repo
    diagnosticSvc --> repo
    swapSvc --> repo
    secondLifeSvc --> repo
    recyclingSvc --> repo
    importEngine --> repo
    auditComponent --> repo

    repo --> db

    classDef entryStyle fill:#1e293b,color:#fff,stroke:#0f172a
    classDef secStyle fill:#6366f1,color:#fff,stroke:#4338ca
    classDef domStyle fill:#0088ff,color:#fff,stroke:#0055b3
    classDef repoStyle fill:#10b981,color:#fff,stroke:#059669

    class api entryStyle
    class identity secStyle
    class batterySvc,vehicleSvc,diagnosticSvc,swapSvc,secondLifeSvc,recyclingSvc,importEngine,reportEngine,auditComponent domStyle
    class repo repoStyle
```

---

## 2. Bảng Danh Mục & Trách Nhiệm Các Component

| Tên Component | Trách Nhiệm Sở Hữu (Owns) | Điều Không Thuộc Trách Nhiệm (Does Not Own) |
| :--- | :--- | :--- |
| **Controllers / HTTP API** | Tiếp nhận HTTP Request, xác thực DTOs, chuyển giao cho Service, chuẩn hóa Response và lỗi RFC 7807. | Không chứa logic tính toán nghiệp vụ hay câu lệnh SQL trực tiếp. |
| **Identity & RBAC** | Giải mã JWT token, kiểm tra vai trò (`x-roles`), mã hóa mật khẩu người dùng. | Không hiển thị giao diện hay lưu vết tài chính/pin. |
| **Battery & Passport Component** | Quản lý vòng đời pin, khởi tạo Hộ chiếu số EU, cập nhật SoH hiện tại, sinh mã QR in tem nhiệt. | Không trực tiếp can thiệp vào quy trình thanh lý hay điều phối trạm BESS. |
| **Vehicle & 1-N Binding Component** | Quản lý số VIN xe, kiểm soát quan hệ ràng buộc 1 quả pin trên 1 xe tại một thời điểm, lưu timeline lịch sử hoán đổi. | Không trực tiếp thực hiện đo đạc vật lý ở xưởng. |
| **Diagnostics & Cell Fault** | Thuật toán đánh giá độ chai SoH, phát hiện độ lệch áp cell $\Delta V > 0.05\text{V}$, gán nhãn kết luận kiểm định. | Không trực tiếp phê duyệt thay pin mới (thuộc thẩm quyền Trưởng xưởng). |
| **Swap Workflow Coordinator** | Quản lý luồng phê duyệt lệnh đổi pin mới, điều phối việc tháo pin cũ và lắp pin mới trong 1 transaction nguyên tử. | Không đo đạc kỹ thuật trực tiếp tại cầu nâng. |
| **Second-Life BESS Coordinator** | Phân bổ các pack pin $55-70\%$ vào trạm sạc lưu trữ đệm V-Green, quản lý dung lượng rack container. | Không xử lý pin mới $100\%$ xuất xưởng. |
| **Recycling Handover Component** | Quản lý quy trình bàn giao tiêu hủy pin $< 55\%$, ghi nhận biên bản giao nhận Black Mass và khóa hộ chiếu. | Không tái sử dụng pin đã thanh lý. |
| **Excel Batch Import Engine** | Đọc file Excel xuất xưởng từ VinES (ClosedXML), kiểm tra hợp lệ từng dòng trong bộ nhớ và lưu hàng loạt. | Không bypass qua domain logic khi tạo pack pin. |
| **PDF & Compliance Generator** | Tạo Giấy Chứng Nhận Kiểm Định Pin Đạt Chuẩn EU (QuestPDF) dạng vector có chữ ký số. | Không thay đổi dữ liệu gốc trong cơ sở dữ liệu. |
| **Audit Trail (SEC-AUDIT-001)** | Ghi nhận lịch sử kiểm toán bất biến, tự động che giấu mật khẩu, token và thông tin định danh cá nhân. | Không lưu dữ liệu vận hành chính. |
| **Persistence Layer** | EF Core DbContext, Repositories, Quản lý giao dịch nguyên tử (`IUnitOfWork`), ánh xạ dữ liệu PostgreSQL. | Không chứa logic phân quyền HTTP hay logic giao diện. |

---

**Chuyển tiếp:** Zoom vào chi tiết mã nguồn C# $\rightarrow$ [C4 — Code](04-code.md).
