# Sơ Đồ Tuần Tự Cốt Lõi (Core Sequence Diagrams) — VSF

> **Dự án:** VSF — VinFast Battery Passport & Second-Life Platform  
> **Trạng thái:** TARGET V1  
> **Mục đích:** Đặc tả chi tiết trình tự tương tác giữa Tác nhân, Giao diện Web/Mobile, Tầng điều hướng Controllers, Dịch vụ nghiệp vụ Domain Services và Tầng lưu trữ PostgreSQL cho 4 kịch bản vận hành trọng yếu.

---

## 1. Luồng 1: Đo Kiểm Chẩn Đoán Dung Lượng, Phát Hiện Lệch Áp Cell & Tạo Lệnh Đổi Pin

Kỹ thuật viên cắm máy chẩn đoán vào pack pin tại cầu nâng xưởng. Hệ thống tự động tính SoH và kiểm tra độ lệch điện áp cell $\Delta V = V_{\text{max}} - V_{\text{min}}$. Nếu $\text{SoH} < 70\%$ hoặc $\Delta V > 0.050\text{V}$, hệ thống lập tức gắn cờ cảnh báo nguy hiểm và tạo Lệnh đổi pin mới chờ Trưởng xưởng duyệt.

```mermaid
sequenceDiagram
    autonumber
    actor Tech as 👤 Kỹ Thuật Viên
    participant UI as 💻 Web Workshop UI
    participant Ctrl as 🎮 InspectionsController
    participant Svc as ⚙️ InspectionService
    participant Policy as 🛡️ CellFaultSafetyPolicy
    participant Repo as 💾 IBatteryRepository
    participant Audit as 📝 IAuditService
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
    DB-->>Repo: Trả về pack VF8 (Dung lượng định danh = 87.70 kWh)
    Repo-->>Svc: Battery Entity

    Svc->>Svc: Tính SoH = (60.10 / 87.70) * 100 = 68.53%
    Svc->>Policy: EvaluateCellImbalance(4.185V, 4.120V)
    Policy-->>Svc: Delta V = 0.065V > 0.050V (CẢNH BÁO LỆCH ÁP CELL KHẨN CẤP)

    Svc->>Repo: SaveInspectionRecordAsync(inspection)
    Repo->>DB: INSERT INTO battery_inspections (..., calculated_soh=68.53, v_delta=0.065, has_cell_fault=true)
    
    Svc->>Repo: UpdateBatteryStatusAsync(batteryId, 68.53, RECALL_PENDING)
    Repo->>DB: UPDATE batteries SET current_soh=68.53, lifecycle_status='RECALL_PENDING'

    Svc->>Audit: LogActionAsync("INSPECTION_CELL_FAULT", "batteries", batteryId, diffJson)
    Audit->>DB: INSERT INTO audit_logs

    Svc-->>Ctrl: InspectionResult (Conclusion: FAIL_CELL_VOLTAGE_FAULT, RequiresSwap: true)
    deactivate Svc

    Ctrl-->>UI: HTTP 201 Created (Hiển thị cảnh báo đỏ & mở Modal đổi pin)
    deactivate Ctrl
    UI-->>Tech: Thông báo: "Độ lệch cell 0.065V vượt ngưỡng an toàn! Đã chuyển trạng thái RECALL_PENDING"
    deactivate UI
```

---

## 2. Luồng 2: Trưởng Xưởng Phê Duyệt Đổi Pin Mới & Hoán Đổi Quan Hệ 1-N Nguyên Tử

Trưởng Xưởng Dịch Vụ kiểm tra thông số pack pin cũ bị lỗi cell/chai dung lượng, lựa chọn pack pin mới từ kho xưởng và thực thi giao dịch hoán đổi quan hệ 1-N nguyên tử (Atomic Database Transaction).

```mermaid
sequenceDiagram
    autonumber
    actor Lead as 👤 Trưởng Xưởng Dịch Vụ
    participant UI as 💻 Web Workshop UI
    participant Ctrl as 🎮 SwapsController
    participant Svc as ⚙️ SwapWorkflowService
    participant Rebinder as 🔄 VehicleBatteryRebinder
    participant UoW as 🏛️ IUnitOfWork
    participant DB as 🗄️ PostgreSQL

    Lead->>UI: Xem xét lệnh đổi pin, chọn Pack mới (VF-BAT-VF8-2026-01042)
    Lead->>UI: Bấm "Phê Duyệt Đổi Pin & Cập Nhật Hồ Sơ Xe"
    activate UI
    UI->>Ctrl: POST /api/v1/swaps/{id}/approve (Bearer JWT)
    activate Ctrl

    Ctrl->>Svc: ApproveAndRebindAsync(swapOrderId, leadUserContext)
    activate Svc

    Svc->>UoW: BeginTransactionAsync()
    activate UoW

    Svc->>Rebinder: ExecuteRebindAsync(vehicleId, oldBatteryId, newBatteryId)
    activate Rebinder

    Rebinder->>DB: 1. UPDATE vehicle_battery_histories SET removed_at = NOW() WHERE battery_id = oldBatt
    Rebinder->>DB: 2. UPDATE vehicles SET current_battery_id = newBatteryId WHERE id = vehicleId
    Rebinder->>DB: 3. INSERT INTO vehicle_battery_histories (vehicle_id, battery_id=newBatt, installed_at=NOW())
    Rebinder->>DB: 4. UPDATE batteries SET lifecycle_status = 'SECOND_LIFE_BESS' WHERE id = oldBatt
    Rebinder->>DB: 5. UPDATE batteries SET lifecycle_status = 'FIRST_LIFE_VEHICLE' WHERE id = newBatt
    Rebinder-->>Svc: Rebinding Completed
    deactivate Rebinder

    Svc->>DB: UPDATE battery_swap_orders SET status = 'APPROVED', approved_at = NOW()
    Svc->>DB: INSERT INTO audit_logs (action='SWAP_BATTERY', ...)

    Svc->>UoW: CommitAsync()
    UoW-->>Svc: Transaction Committed Successfully
    deactivate UoW

    Svc-->>Ctrl: SwapApprovalResponse (Status: APPROVED, NewVinBindingConfirmed)
    deactivate Svc

    Ctrl-->>UI: HTTP 200 OK (Cập nhật giao diện & đóng modal)
    deactivate Ctrl
    UI-->>Lead: Hiển thị Toast xanh: "Đã phê duyệt đổi pin thành công! Hồ sơ xe đã liên kết pack mới"
    deactivate UI
```

---

## 3. Luồng 3: Quét Mã QR Tra Cứu Hộ Chiếu Pin Công Khai Trên Di Động (< 50ms)

Khách hàng hoặc kiểm toán viên EU dùng camera quét tem mã QR dán trên vỏ quả pin. Yêu cầu gửi tới cổng Public Gateway không cần Token, truy vấn qua Partial Unique Index và trả về đầy đủ hồ sơ Hộ chiếu số bảo mật GDPR trong vòng dưới **50ms**.

```mermaid
sequenceDiagram
    autonumber
    actor User as 👤 Người Dùng / Thanh Tra EU
    participant Phone as 📱 Camera / Mobile Browser
    participant Gateway as 🌐 Public API Gateway
    participant Svc as ⚙️ PublicPassportService
    participant DB as 🗄️ PostgreSQL

    User->>Phone: Quét mã QR trên thân quả pin
    Phone->>Phone: Đọc URL: https://passport.vinfast.vn/passport/VF-BAT-VF8-2026-00892
    Phone->>Gateway: GET /api/v1/public/passport/VF-BAT-VF8-2026-00892 (Không cần Token)
    activate Gateway

    Gateway->>Svc: GetPublicPassportAsync(serialNumber)
    activate Svc

    Svc->>DB: SELECT b.*, p.* FROM batteries b JOIN battery_passports p ON ... WHERE serial_number = @serial
    Note over DB: Sử dụng Index idx_batteries_serial_number (Thời gian truy vấn < 5ms)
    DB-->>Svc: Dữ liệu Pin, Hộ chiếu, Dấu chân Carbon & Tỷ lệ tái chế

    Svc->>DB: SELECT event_date, event_type, workshop_city, soh FROM inspections WHERE ... (Anonymized)
    DB-->>Svc: Lịch sử dịch vụ đã ẩn danh hóa GDPR (Không có VIN/Tên chủ xe)

    Svc->>Svc: Đóng gói PublicPassportResponse (SoH Rating, Carbon Class, Recycled %)
    Svc-->>Gateway: DTO Response
    deactivate Svc

    Gateway-->>Phone: HTTP 200 OK (JSON phản hồi hoàn tất trong < 50ms)
    deactivate Gateway

    Phone-->>User: Hiển thị giao diện Mobile-First: Thanh Gauge SoH 92.4%, Dấu chân Carbon 72.5 kg CO2e, Nút tải PDF
```

---

## 4. Luồng 4: Nhập Lô Dữ Liệu Pin Xuất Xưởng Từ File Excel Nhà Máy VinES

Quản trị viên HQ tải lên tệp Excel danh sách pack pin mới xuất xưởng từ VinES. Hệ thống kiểm tra hợp lệ toàn bộ file trong bộ nhớ (ClosedXML), nếu có lỗi sẽ báo chi tiết từng dòng; nếu hợp lệ sẽ thực thi giao dịch nguyên tử lưu hàng loạt tối đa 5,000 pack pin.

```mermaid
sequenceDiagram
    autonumber
    actor Admin as 👤 Quản Trị Viên HQ
    participant UI as 💻 Web Admin Portal
    participant Ctrl as 🎮 ImportsController
    participant Parser as 📑 ClosedXmlExcelParser
    participant Validator as 🛡️ BatchImportValidator
    participant Svc as ⚙️ ImportBatchService
    participant DB as 🗄️ PostgreSQL

    Admin->>UI: Kéo thả file VinES_Batch_202610.xlsx (150 dòng)
    Admin->>UI: Bấm "Kiểm Tra File"
    activate UI
    UI->>Ctrl: POST /api/v1/imports/preview (multipart/form-data)
    activate Ctrl

    Ctrl->>Parser: ParseWorkbookInMemory(fileStream)
    activate Parser
    Parser-->>Ctrl: Danh sách 150 Rows
    deactivate Parser

    Ctrl->>Validator: ValidateAllRowsAsync(rows)
    activate Validator
    Validator->>DB: Kiểm tra trùng lặp serial_number trong bảng batteries
    DB-->>Validator: Không có dòng nào trùng lặp
    Validator-->>Ctrl: Kết quả: 150/150 Rows hợp lệ
    deactivate Validator

    Ctrl-->>UI: HTTP 200 OK (Hiển thị bảng xem trước & nút "Tiến Hành Nhập")
    deactivate Ctrl
    UI-->>Admin: "File hợp lệ 100%! Sẵn sàng nhập 150 pack pin vào hệ sinh thái"

    Admin->>UI: Bấm "Tiến Hành Nhập"
    UI->>Ctrl: POST /api/v1/imports/commit (file, batchCode)
    activate Ctrl

    Ctrl->>Svc: CommitBatchAsync(file, batchCode, adminContext)
    activate Svc

    Svc->>DB: BEGIN TRANSACTION
    Svc->>DB: 1. INSERT INTO import_batches (batch_code, total_rows=150, status='COMPLETED')
    Svc->>DB: 2. BULK INSERT INTO batteries (150 bản ghi pack pin mới)
    Svc->>DB: 3. BULK INSERT INTO battery_passports (150 bản ghi hộ chiếu số kèm mã QR)
    Svc->>DB: 4. INSERT INTO audit_logs (action='IMPORT_EXCEL', ...)
    Svc->>DB: COMMIT TRANSACTION

    Svc-->>Ctrl: ImportCommitResponse (TotalImported: 150, Status: COMPLETED)
    deactivate Svc

    Ctrl-->>UI: HTTP 201 Created (Hiển thị thông báo thành công)
    deactivate Ctrl
    UI-->>Admin: Toast xanh: "Đã nhập thành công 150 pack pin từ nhà máy VinES!"
    deactivate UI
```
