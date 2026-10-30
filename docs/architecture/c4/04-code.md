# C4 Level 4 — Code (Thiết Kế Cộng Tác Mã Nguồn C#) — VSF

> **Mục đích:** Zoom vào cấu trúc mã nguồn C# nội bộ bên trong 2 phân hệ nghiệp vụ cốt lõi nhất của hệ thống: **Đo kiểm Chẩn đoán Sức khỏe Cell** và **Quy trình Phê duyệt Đổi Pin Mới 1-N Nguyên Tử**.

---

## L4.1 Luồng Đo Kiểm Chẩn Đoán & Phát Hiện Lỗi Cell (Inspection & Diagnostic Pipeline)

```mermaid
flowchart TB
    subgraph inspectionModule["Inspection & Diagnostic Pipeline [Component Level]"]
        direction TB

        ctrl["InspectionsController<br/><i>[ASP.NET Core Controller]</i><br/>+CreateInspectionAsync(dto): Task&lt;IActionResult&gt;<br/>+GetByIdAsync(id): Task&lt;IActionResult&gt;"]
        svc["InspectionService<br/><i>[C# Service Class]</i><br/>+ExecuteInspectionAsync(dto, userContext): Task&lt;InspectionResult&gt;<br/>+CalculateSoh(measured, nominal): decimal"]
        val["DiagnosticValidator<br/><i>[FluentValidation Class]</i><br/>Kiểm tra C_measured > 0, V_max >= V_min,<br/>nội trở và chu kỳ hợp lệ"]
        policy["CellFaultSafetyPolicy<br/><i>[Domain Policy Class]</i><br/>Kiểm tra Delta V = V_max - V_min.<br/>Nếu Delta V > 0.050V -> Gán cờ CellFault khẩn cấp"]
        entity["BatteryInspection<br/><i>[Domain Entity]</i><br/>Lưu thông số đo đạc, SoH tính toán & kết luận"]
        battRepo["IBatteryRepository<br/><i>[C# Interface]</i><br/>+GetByIdAsync(id): Task&lt;Battery&gt;<br/>+UpdateSohAndStatusAsync(id, soh, status)"]
        inspRepo["IBatteryInspectionRepository<br/><i>[C# Interface]</i><br/>+AddAsync(inspection): Task"]
        auditSvc["IAuditService<br/><i>[C# Service Interface]</i><br/>+LogActionAsync(action, table, id, diff): Task"]

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

---

## L4.2 Luồng Phê Duyệt Đổi Pin Mới 1-N Nguyên Tử (Atomic 1-N Battery Swap Pipeline)

```mermaid
flowchart TB
    subgraph swapModule["Atomic 1-N Battery Swap Pipeline [Component Level]"]
        direction TB

        swapCtrl["SwapsController<br/><i>[ASP.NET Core Controller]</i><br/>+ApproveSwapAsync(id): Task&lt;IActionResult&gt;<br/>+RejectSwapAsync(id, reason): Task&lt;IActionResult&gt;"]
        swapSvc["SwapWorkflowService<br/><i>[C# Service Class]</i><br/>+ApproveAndRebindAsync(swapOrderId, leadUserContext)"]
        authPolicy["LeadAuthorizationPolicy<br/><i>[Security Policy Class]</i><br/>Xác thực vai trò STATION_LEAD & xưởng phụ trách"]
        rebinder["VehicleBatteryRebinder<br/><i>[Domain Domain Service]</i><br/>1. Gỡ pin cũ khỏi xe (set removed_at = NOW())<br/>2. Gán pin mới vào xe (vehicles.current_battery_id)<br/>3. Tạo bản ghi mới trong vehicle_battery_histories"]
        uow["IUnitOfWork<br/><i>[C# Interface]</i><br/>+BeginTransactionAsync(): Task<br/>+CommitAsync(): Task<br/>+RollbackAsync(): Task"]
        swapRepo["ISwapOrderRepository<br/><i>[C# Interface]</i>"]
        vehRepo["IVehicleRepository<br/><i>[C# Interface]</i>"]
        historyRepo["IVehicleBatteryHistoryRepository<br/><i>[C# Interface]</i>"]

        swapCtrl --> authPolicy
        swapCtrl --> swapSvc
        swapSvc --> rebinder
        swapSvc --> uow
        rebinder --> swapRepo
        rebinder --> vehRepo
        rebinder --> historyRepo
    end

    db[("PostgreSQL Database<br/><i>[vsf_core]</i>")]
    uow --> db
    swapRepo --> db
    vehRepo --> db
    historyRepo --> db

    classDef c4main fill:#0088ff,color:#fff,stroke:#0055b3
    classDef c4core fill:#1b365d,color:#fff,stroke:#00205b
    classDef c4sub fill:#10b981,color:#fff,stroke:#059669

    class swapCtrl,swapSvc c4core
    class authPolicy,rebinder c4main
    class uow,swapRepo,vehRepo,historyRepo c4sub
```
