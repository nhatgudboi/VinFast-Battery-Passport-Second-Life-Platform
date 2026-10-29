-- ============================================================
-- PostgreSQL schema — vsf_battery (VSF: VinFast Battery Passport & Second-Life)
-- He thong Quan ly Ho chieu So & Vong doi Tai sinh Pin Xe Dien VinFast
-- PostgreSQL 15+
-- ============================================================

BEGIN;

CREATE SCHEMA IF NOT EXISTS vsf_battery;
SET search_path TO vsf_battery, public;

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('ADMIN', 'STATION_LEAD', 'TECHNICIAN', 'AUDITOR');
CREATE TYPE battery_chemistry AS ENUM ('LFP', 'NMC', 'NCA', 'SODIUM_ION');
CREATE TYPE battery_status AS ENUM (
    'MANUFACTURED',       -- Moi xuat xuong tai VinES
    'ON_VEHICLE',          -- Dang lap dat va hoat dong tren xe
    'MAINTENANCE_CHECK',   -- Dang duoc bao duong kiem dinh tai xuong
    'RECALL_PENDING',      -- SoH < 70%, kich hoat quy trinh doi pin mien phi
    'SECOND_LIFE_BESS',    -- 55% <= SoH < 70%, tai sinh lam tram tich dien V-Green
    'RECYCLED',            -- SoH < 55% hoac loi cell, chuyen sang nha may tai che
    'DECOMMISSIONED'       -- Da huy va xu ly an toan
);
CREATE TYPE inspection_type AS ENUM ('ROUTINE_SERVICE', 'BATTERY_SWAP_REQUEST', 'POST_ACCIDENT', 'SECOND_LIFE_EVALUATION');
CREATE TYPE audit_action AS ENUM ('INSERT', 'UPDATE', 'DELETE', 'LOGIN', 'INSPECT', 'STATUS_CHANGE', 'IMPORT', 'EXPORT');
CREATE TYPE import_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- 2. USERS
CREATE TABLE app_users (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username        VARCHAR(100) NOT NULL,
    email           VARCHAR(255) NOT NULL,
    password_hash   TEXT NOT NULL,
    full_name       VARCHAR(255) NOT NULL,
    phone           VARCHAR(30),
    avatar_url      TEXT,
    role            user_role NOT NULL DEFAULT 'TECHNICIAN',
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    station_name    VARCHAR(255) DEFAULT 'VinFast Central Service',
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uq_app_users_username_active ON app_users (LOWER(username)) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX uq_app_users_email_active ON app_users (LOWER(email)) WHERE deleted_at IS NULL;

-- 3. BATTERY MODELS (Cac dong xe & Model pin VinFast)
CREATE TABLE battery_models (
    id                      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    model_code              VARCHAR(50) NOT NULL,        -- VF3, VF5, VF6, VF7, VF8, VF9, EVO200
    model_name              VARCHAR(150) NOT NULL,
    chemistry               battery_chemistry NOT NULL DEFAULT 'LFP',
    design_capacity_kwh     NUMERIC(8, 2) NOT NULL,      -- Dung luong dinh danh ban dau (kWh)
    nominal_voltage         NUMERIC(8, 2) NOT NULL,      -- Dien ap danh dinh (V)
    cells_in_series         INT NOT NULL DEFAULT 96,
    weight_kg               NUMERIC(8, 2) NOT NULL,
    manufacturer            VARCHAR(150) NOT NULL DEFAULT 'VinES Hai Phong',
    warranty_soh_threshold  NUMERIC(5, 2) NOT NULL DEFAULT 70.00, -- Nguong doi pin mien phi theo hop dong (70%)
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX uq_battery_models_code ON battery_models (model_code);

-- 4. BATTERY PACKS (Tung qua pin thuc te gan voi Ma Hộ Chiếu QR)
CREATE TABLE battery_packs (
    id                      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    serial_number           VARCHAR(100) NOT NULL,       -- Serial/UUID tren vo pin (QR Code)
    model_id                BIGINT NOT NULL REFERENCES battery_models(id),
    vehicle_vin             VARCHAR(50),                 -- So khung xe dang lap qua pin nay
    vehicle_plate           VARCHAR(20),                 -- Bien so xe (neu co)
    manufacture_date        DATE NOT NULL,
    current_soh_percent     NUMERIC(5, 2) NOT NULL DEFAULT 100.00, -- State of Health hien tai (%)
    cycle_count             INT NOT NULL DEFAULT 0,      -- So chu ky sac xa
    odometer_km             INT NOT NULL DEFAULT 0,      -- So km xe da chay
    status                  battery_status NOT NULL DEFAULT 'ON_VEHICLE',
    current_location        VARCHAR(255) NOT NULL DEFAULT 'VinFast Ha Noi Service Center',
    carbon_footprint_kg_co2 NUMERIC(10, 2) DEFAULT 0.00, -- Phat thai carbon san xuat (theo EU passport)
    qr_code_url             TEXT,
    note                    TEXT,
    created_by              BIGINT REFERENCES app_users(id),
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at              TIMESTAMPTZ
);

CREATE UNIQUE INDEX uq_battery_packs_serial ON battery_packs (serial_number) WHERE deleted_at IS NULL;
CREATE INDEX idx_battery_packs_status ON battery_packs (status);
CREATE INDEX idx_battery_packs_soh ON battery_packs (current_soh_percent);

-- 5. BATTERY INSPECTIONS (Nhat ky do dac kiem dinh tai xuong VinFast)
CREATE TABLE battery_inspections (
    id                          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    pack_id                     BIGINT NOT NULL REFERENCES battery_packs(id) ON DELETE CASCADE,
    inspection_type             inspection_type NOT NULL DEFAULT 'ROUTINE_SERVICE',
    inspection_date             DATE NOT NULL DEFAULT CURRENT_DATE,
    odometer_km                 INT NOT NULL DEFAULT 0,
    cycle_count                 INT NOT NULL DEFAULT 0,
    measured_capacity_kwh       NUMERIC(8, 2) NOT NULL, -- Dung luong thuc do duoc (kWh)
    calculated_soh_percent      NUMERIC(5, 2) NOT NULL, -- (measured / design) * 100
    internal_resistance_mohm    NUMERIC(6, 2) NOT NULL, -- Noi tro cell pin (mOhm)
    max_cell_voltage_v          NUMERIC(5, 3),
    min_cell_voltage_v          NUMERIC(5, 3),
    highest_temperature_c       NUMERIC(5, 2),          -- Nhiet do dinh tung ghi nhan
    physical_integrity_ok       BOOLEAN NOT NULL DEFAULT TRUE, -- Vo pin khong bien dang/ngap nuoc
    station_name                VARCHAR(255) NOT NULL,
    inspector_id                BIGINT REFERENCES app_users(id),
    recommendation              TEXT,
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_battery_inspections_pack ON battery_inspections (pack_id);

-- 6. SECOND LIFE DEPLOYMENTS (Dieu phoi pin vao tram tich dien V-Green BESS)
CREATE TABLE second_life_deployments (
    id                      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    pack_id                 BIGINT NOT NULL REFERENCES battery_packs(id),
    bess_station_code       VARCHAR(100) NOT NULL,       -- Ma tram sac: VGREEN-HANOI-01
    bess_station_name       VARCHAR(255) NOT NULL,
    deployment_date         DATE NOT NULL DEFAULT CURRENT_DATE,
    initial_soh_at_deploy   NUMERIC(5, 2) NOT NULL,
    cluster_position        VARCHAR(50),                 -- Vi tri trong tu rack: RACK-A-03
    expected_years          INT DEFAULT 5,
    approved_by             BIGINT REFERENCES app_users(id),
    notes                   TEXT,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. IMPORT BATCHES (Nhan lo pin tu nha may VinES qua Excel)
CREATE TABLE import_batches (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    batch_code          VARCHAR(100) NOT NULL,
    original_file_name  VARCHAR(500) NOT NULL,
    total_rows          INT NOT NULL DEFAULT 0,
    success_rows        INT NOT NULL DEFAULT 0,
    failed_rows         INT NOT NULL DEFAULT 0,
    error_details       JSONB,
    status              import_status NOT NULL DEFAULT 'PENDING',
    imported_by         BIGINT REFERENCES app_users(id),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at        TIMESTAMPTZ
);

-- 8. AUDIT LOGS (Ghi vet kiem toan bat bien)
CREATE TABLE audit_logs (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    actor_user_id   BIGINT REFERENCES app_users(id) ON DELETE SET NULL,
    action          audit_action NOT NULL,
    entity_name     VARCHAR(100) NOT NULL,
    entity_id       BIGINT,
    details         JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_actor ON audit_logs (actor_user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs (entity_name, entity_id);

-- ============================================================
-- SEED DATA (Du lieu thuc te VinFast)
-- ============================================================

-- 1. Tai khoan nguoi dung (Mat khau mac dinh: ChangeMe123!)
INSERT INTO app_users (username, email, password_hash, full_name, phone, role, station_name)
VALUES
('admin', 'admin@vinfast.vn', 'Ksm3rlVsPVFYushv5dfq7g==.JunPWMEb5UCidp5qJBSBo9dnUKMjinK1m5ZZzCJDZcs=', 'Nguyen Van Quan Tri', '0901234567', 'ADMIN', 'VinFast Headquarters'),
('lead_hanoi', 'lead.hanoi@vinfast.vn', 'Ksm3rlVsPVFYushv5dfq7g==.JunPWMEb5UCidp5qJBSBo9dnUKMjinK1m5ZZzCJDZcs=', 'Tran Dinh Truong Xuong', '0902223333', 'STATION_LEAD', 'VinFast Service Center Pham Van Dong - Ha Noi'),
('tech_nam', 'tech.nam@vinfast.vn', 'Ksm3rlVsPVFYushv5dfq7g==.JunPWMEb5UCidp5qJBSBo9dnUKMjinK1m5ZZzCJDZcs=', 'Le Van Ky Thuat', '0903334444', 'TECHNICIAN', 'VinFast Service Center Pham Van Dong - Ha Noi'),
('auditor_eu', 'auditor@eu-tuv.de', 'Ksm3rlVsPVFYushv5dfq7g==.JunPWMEb5UCidp5qJBSBo9dnUKMjinK1m5ZZzCJDZcs=', 'Hans Gruber (EU TUV Auditor)', '+49 89 123456', 'AUDITOR', 'TUV Rheinland Battery Certification');

-- 2. Cac Model pin va Xe VinFast
INSERT INTO battery_models (model_code, model_name, chemistry, design_capacity_kwh, nominal_voltage, cells_in_series, weight_kg, manufacturer)
VALUES
('VF3', 'VinFast VF 3 (Urban Mini EV)', 'LFP', 18.64, 102.4, 32, 145.00, 'Gotion High-Tech & VinES'),
('VF5', 'VinFast VF 5 Plus', 'LFP', 37.23, 268.8, 84, 272.00, 'VinES Hai Phong'),
('VF6', 'VinFast VF 6 (Base/Plus)', 'LFP', 59.60, 358.4, 112, 410.00, 'VinES Hai Phong'),
('VF7', 'VinFast VF 7 Plus', 'NMC', 75.30, 380.0, 96, 465.00, 'VinES & CATL'),
('VF8', 'VinFast VF 8 Eco/Plus', 'NMC', 87.70, 400.0, 108, 520.00, 'CATL & VinES Hai Phong'),
('VF9', 'VinFast VF 9 Plus Flagship', 'NMC', 123.00, 400.0, 108, 655.00, 'CATL'),
('EVO200', 'Xe May Dien VinFast Evo200', 'LFP', 3.50, 72.0, 24, 28.00, 'VinES Hai Phong');

-- 3. Representative Battery Packs
INSERT INTO battery_packs (serial_number, model_id, vehicle_vin, vehicle_plate, manufacture_date, current_soh_percent, cycle_count, odometer_km, status, current_location, carbon_footprint_kg_co2)
SELECT 
    v.serial_number, m.id, v.vehicle_vin, v.vehicle_plate, v.manufacture_date::DATE, v.current_soh_percent, v.cycle_count, v.odometer_km, v.status::battery_status, v.current_location, v.carbon_footprint_kg_co2
FROM (VALUES
    -- VF8 xe xuat khau dang chay tot
    ('VF8-BAT-2024-00192', 'VF8', 'VF8VN24A00192001', '30K-888.92', '2024-02-15', 94.50, 180, 28500, 'ON_VEHICLE', 'Ha Noi', 5420.00),
    ('VF8-BAT-2024-00193', 'VF8', 'VF8VN24A00193002', '30K-999.11', '2024-02-18', 88.20, 340, 52000, 'ON_VEHICLE', 'Ha Noi', 5420.00),
    -- VF5 chay taxi Xanh SM sap cham nguong doi pin
    ('VF5-BAT-2023-01044', 'VF5', 'VF5VN23B01044122', '29E-044.89', '2023-05-10', 71.50, 890, 142000, 'ON_VEHICLE', 'TP Ho Chi Minh', 2310.00),
    -- VF5 chai duoi 70% -> Kich hoat quy trinh doi pin mien phi
    ('VF5-BAT-2023-00812', 'VF5', 'VF5VN23B00812301', '29E-012.33', '2023-04-02', 68.40, 1050, 168000, 'RECALL_PENDING', 'VinFast Service Pham Van Dong', 2310.00),
    -- VF8 da thu hoi -> Chuyen doi thanh cong sang tram sac V-Green BESS
    ('VF8-BAT-2023-00045', 'VF8', 'VF8VN23A00045999', NULL, '2023-01-20', 66.80, 1120, 175000, 'SECOND_LIFE_BESS', 'Tram Sac V-Green Cao Toc Phap Van', 5420.00),
    -- VF3 moi xuat xuong
    ('VF3-BAT-2024-05501', 'VF3', 'VF3VN24C05501001', '30L-123.45', '2024-08-01', 99.80, 12, 1800, 'ON_VEHICLE', 'Da Nang', 1150.00),
    -- Pin cu duoi 55% dang cho tai che kim loai
    ('VF5-BAT-2022-00019', 'VF5', NULL, NULL, '2022-11-12', 49.50, 1420, 220000, 'RECYCLED', 'VinES Recycling Plant Hai Phong', 2310.00)
) AS v(serial_number, model_code, vehicle_vin, vehicle_plate, manufacture_date, current_soh_percent, cycle_count, odometer_km, status, current_location, carbon_footprint_kg_co2)
JOIN battery_models m ON m.model_code = v.model_code;

-- 4. Representative Inspections
INSERT INTO battery_inspections (pack_id, inspection_type, inspection_date, odometer_km, cycle_count, measured_capacity_kwh, calculated_soh_percent, internal_resistance_mohm, highest_temperature_c, station_name, recommendation)
SELECT
    p.id, 'BATTERY_SWAP_REQUEST', '2026-10-15', 168000, 1050, 25.46, 68.40, 24.50, 48.2, 'VinFast Service Pham Van Dong', 'SoH < 70%. Kich hoat quy trinh doi pack pin moi mien phi cho khach hang Xanh SM theo cam ket hop dong.'
FROM battery_packs p WHERE p.serial_number = 'VF5-BAT-2023-00812';

-- 5. Second-Life Deployment
INSERT INTO second_life_deployments (pack_id, bess_station_code, bess_station_name, deployment_date, initial_soh_at_deploy, cluster_position, notes)
SELECT
    p.id, 'VGREEN-BESS-PV-01', 'Trạm Sạc Cao Tốc Pháp Vân - Cầu Giẽ', '2026-09-01', 66.80, 'RACK-B-04', 'Tái sử dụng làm bộ tích điện đệm giờ cao điểm cho 4 trụ sạc nhanh 150kW.'
FROM battery_packs p WHERE p.serial_number = 'VF8-BAT-2023-00045';

COMMIT;
