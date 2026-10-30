# Sơ Đồ Cơ Sở Dữ Liệu & Thực Thể Liên Kết (Data Diagram & ERD) — VSF

> **Dự án:** VSF — VinFast Battery Passport & Second-Life Platform  
> **Hệ quản trị CSDL:** PostgreSQL 16 (Schema: `vsf_core`)  
> **Trạng thái:** TARGET V1  
> **Mã nguồn thiết kế:** [schema.dbml](../src/database/schema.dbml) · [05-data-model.md](05-data-model.md)

---

## 1. Sơ Đồ Phân Nhóm Thực Thể (High-Level Entity Groups)

Sơ đồ phân rã 13 bảng thực thể thành 6 phân hệ cốt lõi: Phân hệ Định danh & Xưởng, Phân hệ Pack Pin & Hộ Chiếu EU, Phân hệ Xe Điện & Lịch sử 1-N, Phân hệ Đo Kiểm & Đổi Pin, Phân hệ Tái Sinh BESS & Tái Chế, và Phân hệ Quản Trị & Kiểm Toán.

```mermaid
flowchart TB
    subgraph group1["1. Dinh Danh & Xuong Dich Vu"]
        direction LR
        WS["workshops<br/><i>(Xuong DV / Tram V-Green)</i>"]
        USR["app_users<br/><i>(Admin HQ / Lead / KTV)</i>"]
        WS --> USR
    end

    subgraph group2["2. Quan Ly Pack Pin & Ho Chieu EU"]
        direction LR
        BAT["batteries<br/><i>(Pack Pin Vat Ly)</i>"]
        PAS["battery_passports<br/><i>(Ho Chieu So EU 2023/1542)</i>"]
        BAT --- PAS
    end

    subgraph group3["3. Xe Dien & Quan He 1-N Hoan Doi"]
        direction LR
        VEH["vehicles<br/><i>(Xe Dien VinFast)</i>"]
        VBH["vehicle_battery_histories<br/><i>(Lich Su Thao Lap 1-N)</i>"]
        VEH --> VBH
    end

    subgraph group4["4. Do Kiem Suc Khoe & Lenh Doi Pin"]
        direction LR
        INS["battery_inspections<br/><i>(Do Dung Luong & SoH)</i>"]
        SWP["battery_swap_orders<br/><i>(Phe Duyet Doi Pin)</i>"]
        INS --> SWP
    end

    subgraph group5["5. Second-Life BESS & Tai Che"]
        direction LR
        BESS["bess_stations<br/><i>(Cum Tram Sac BESS)</i>"]
        ALLOC["bess_allocations<br/><i>(Ghep Noi Pin 55-70%)</i>"]
        REC["battery_recyclings<br/><i>(Thu Hoi Black Mass)</i>"]
        BESS --> ALLOC
        BAT --> REC
    end

    subgraph group6["6. Tich Hop & Kiem Toan Bat Bien"]
        direction LR
        IMP["import_batches<br/><i>(Lo Pin Excel VinES)</i>"]
        AUD["audit_logs<br/><i>(Nhat Ky Audit Trail)</i>"]
    end

    group1 --> group2
    group2 --> group3
    group2 --> group4
    group2 --> group5
    group1 --> group6

    classDef g1 fill:#f8fafc,stroke:#64748b,color:#0f172a
    classDef g2 fill:#eff6ff,stroke:#0088ff,color:#0055b3
    classDef g3 fill:#f0fdf4,stroke:#10b981,color:#047857
    classDef g4 fill:#fffbeb,stroke:#f59e0b,color:#b45309
    classDef g5 fill:#fdf2f8,stroke:#ec4899,color:#be185d
    classDef g6 fill:#f5f3ff,stroke:#8b5cf6,color:#6d28d9

    class WS,USR g1
    class BAT,PAS g2
    class VEH,VBH g3
    class INS,SWP g4
    class BESS,ALLOC,REC g5
    class IMP,AUD g6
```

---

## 2. Sơ Đồ Thực Thể Liên Kết Chi Tiết (Detailed ER Diagram)

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

---

## 3. Danh Mục Các Kiểu Liệt Kê (Enums Dictionary)

| Tên Enum | Giá Trị Hợp Lệ | Mô Tả & Vị Trí Sử Dụng Trong Nghiệp Vụ |
| :--- | :--- | :--- |
| `user_role` | `ADMIN_HQ`, `STATION_LEAD`, `TECHNICIAN`, `AUDITOR_PUBLIC` | Phân quyền RBAC nội bộ VinFast và kiểm toán độc lập |
| `vehicle_model` | `VF3`, `VF5`, `VF6`, `VF7`, `VF8`, `VF9`, `VFe34` | Dòng xe điện VinFast thương mại tương thích |
| `cell_chemistry` | `LFP`, `NMC` | Hóa học tế bào pin (Lithium Iron Phosphate / Nickel Manganese Cobalt) |
| `lifecycle_status`| `NEW_MANUFACTURED`, `FIRST_LIFE_VEHICLE`, `RECALL_PENDING`, `RETIRED_FROM_VEHICLE`, `SECOND_LIFE_BESS`, `RECYCLED` | 6 nấc trạng thái vòng đời quả pin |
| `passport_status` | `ACTIVE`, `SUSPENDED`, `EXPIRED_RECYCLED` | Trạng thái chứng nhận Hộ chiếu pin EU 2023/1542 |
| `swap_action` | `INITIAL_INSTALL`, `MAINTENANCE_SWAP`, `WARRANTY_REPLACEMENT`, `RETIRE_TO_BESS` | Hành động ghi nhận lịch sử tháo/lắp quan hệ 1-N |
| `inspection_conclusion` | `PASS_FIRST_LIFE`, `FAIL_DEGRADED_SOH`, `FAIL_CELL_VOLTAGE_FAULT`, `SCHEDULE_SWAP` | Kết luận tự động từ thuật toán đo kiểm SoH và $\Delta V$ |
| `swap_order_status` | `PENDING_LEAD_APPROVAL`, `APPROVED`, `REJECTED`, `COMPLETED` | Luồng phê duyệt lệnh đổi pin mới của Trưởng Xưởng |
| `import_status` | `PENDING`, `VALIDATING`, `COMPLETED`, `FAILED` | Trạng thái tiến trình import Excel lô pin từ VinES |
| `audit_action` | `CREATE`, `UPDATE`, `SOFT_DELETE`, `SWAP_BATTERY`, `ALLOCATE_BESS`, `RECYCLE_DISPOSAL`, `EXPORT_PDF`, `IMPORT_EXCEL`, `LOGIN` | Danh mục hành động ghi vết kiểm toán bất biến |

---

## 4. Báo Cáo Phân Tích Thông Qua SQL Views

Hệ thống không lưu trữ các bảng thống kê cứng mà tính toán động thông qua các PostgreSQL Materialized Views / Standard Views để đảm bảo tính thời gian thực:

```mermaid
flowchart LR
    B[batteries] --> V1[vw_battery_active_fleet]
    B --> V2[vw_soh_distribution_kpi]
    I[battery_inspections] --> V3[vw_cell_fault_alerts]
    VBH[vehicle_battery_histories] --> V4[vw_vehicle_swap_lifecycle]
    BESS[bess_allocations] --> V5[vw_bess_capacity_utilization]

    classDef src fill:#eff6ff,stroke:#0088ff,color:#0055b3
    classDef vw fill:#f0fdf4,stroke:#10b981,color:#047857
    class B,I,VBH,BESS src
    class V1,V2,V3,V4,V5 vw
```

1. `vw_battery_active_fleet`: Danh sách pack pin đang hoạt động thực tế trên xe điện thương mại.
2. `vw_soh_distribution_kpi`: Tỷ lệ % phân bổ sức khỏe pin theo 4 dải ($ge 80%$, $70-80%$, $55-70%$, $<55%$).
3. `vw_cell_fault_alerts`: Danh sách khẩn cấp các pack pin có độ lệch điện áp cell $\Delta V > 0.05V$.
4. `vw_vehicle_swap_lifecycle`: Tổng hợp vòng đời xe điện và số lần thay đổi pack pin theo km lăn bánh.
5. `vw_bess_capacity_utilization`: Thống kê tổng công suất đệm tích điện đang lưu trữ tại các trạm sạc V-Green BESS.

---

## 5. Chiến Lược Đánh Chỉ Mục & Tối Ưu Hóa Truy Vấn (Indexing Strategy)

Để đảm bảo hiệu năng quét mã QR trên di động và tìm kiếm tại xưởng dịch vụ đạt chuẩn **dưới 50ms**:

```sql
-- 1. Index tra cứu nhanh Hộ chiếu công khai qua mã Serial Number (< 50ms)
CREATE UNIQUE INDEX idx_batteries_serial_number ON batteries (serial_number) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX idx_battery_passports_passport_id ON battery_passports (passport_id);
CREATE UNIQUE INDEX idx_battery_passports_battery_id ON battery_passports (battery_id);

-- 2. Index quản lý xe và số VIN 17 ký tự
CREATE UNIQUE INDEX idx_vehicles_vin ON vehicles (vin);
CREATE UNIQUE INDEX idx_vehicles_current_battery ON vehicles (current_battery_id) WHERE current_battery_id IS NOT NULL;

-- 3. Composite Index truy vấn lịch sử 1-N xe & pin theo thời gian
CREATE INDEX idx_vbh_vehicle_installed ON vehicle_battery_histories (vehicle_id, installed_at DESC);
CREATE INDEX idx_vbh_battery_installed ON vehicle_battery_histories (battery_id, installed_at DESC);

-- 4. Index phát hiện nhanh cảnh báo lệch áp cell khẩn cấp và SoH dưới ngưỡng
CREATE INDEX idx_inspections_cell_fault ON battery_inspections (has_cell_fault, inspection_date DESC) WHERE has_cell_fault = true;
CREATE INDEX idx_batteries_soh_status ON batteries (lifecycle_status, current_soh);

-- 5. Index tìm kiếm Audit Trail theo Actor và thời gian
CREATE INDEX idx_audit_logs_actor_time ON audit_logs (actor_user_id, created_at DESC);
CREATE INDEX idx_audit_logs_table_record ON audit_logs (table_name, record_id, created_at DESC);
```
