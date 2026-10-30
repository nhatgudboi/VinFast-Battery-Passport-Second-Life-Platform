# Hệ Thống Thiết Kế UI/UX Chuẩn VinFast (VinFast Design System & Guidelines) — VSF

> **Hệ thống:** Nền tảng Hộ chiếu Số & Quản trị Vòng đời Pin Xe Điện VinFast (VSF)  
> **Ngôn ngữ thiết kế:** VinFast Automotive High-Tech Design Language (Hiện đại, Đẳng cấp công nghiệp, Tinh gọn, Trực quan)  
> **Tuân thủ chuẩn:** EU Battery Regulation (EU 2023/1542), WCAG 2.1 AA (Trợ năng), Mobile-First cho Cổng QR tra cứu.

---

## 1. Bảng Mã Màu Thương Hiệu & Trạng Thái Kỹ Thuật (Design Tokens)

Hệ màu được xây dựng dựa trên nhận diện thương hiệu VinFast Electric, kết hợp với các dải màu trạng thái công nghiệp đạt chuẩn hiển thị cao:

### 1.1 Màu Thương Hiệu & Nền (Brand & Base)
| Token Name | Mã Hex | Ý Nghĩa / Mục Đích Sử Dụng |
|---|---|---|
| `--vf-blue-primary` | `#1462D2` | Màu xanh VinFast Electric — Nút hành động chính (Primary Button), Active Tab, Brand Logo |
| `--vf-blue-hover` | `#0F4FB0` | Trạng thái hover của các nút hành động chính |
| `--vf-blue-light` | `#EBF3FC` | Nền của các thẻ thông tin nổi bật, badge thông báo nhẹ |
| `--vf-navy-dark` | `#0B192C` | Màu nền Sidebar, Header của khối quản trị hoặc Dark Theme nền xe |
| `--vf-surface-bg` | `#F8FAFC` | Nền chung toàn màn hình ứng dụng Web (Sạch sẽ, độ tương phản cao) |
| `--vf-card-bg` | `#FFFFFF` | Nền của các khối Card, Table, Modal (Đổ bóng mềm 0 4px 20px rgba(0,0,0,0.06)) |
| `--vf-border` | `#E2E8F0` | Đường viền ngăn cách giữa các cột bảng, thẻ card |

### 1.2 Màu Trạng Thái Độ Chai Pin (SoH) & Cảnh Báo An Toàn (Battery Status)
| Mức Sức Khỏe SoH / Lỗi | Mã Hex | Tên Màu | Ý Nghĩa & Quy Chuẩn Nghiệp Vụ |
|---|---|---|---|
| **SoH >= 85%** | `#10B981` | Emerald Green | **PIN TỐT:** Pack pin hoạt động tối ưu, dung lượng dồi dào, an toàn tuyệt đối. |
| **70% <= SoH < 85%** | `#F59E0B` | Amber Orange | **PIN TRUNG BÌNH:** Có dấu hiệu lão hóa tự nhiên, tiếp tục theo dõi chu kỳ sạc. |
| **SoH < 70%** | `#EF4444` | Crimson Red | **PIN CHAI:** Chạm ngưỡng cam kết bảo hành của VinFast $\rightarrow$ Đổi pin miễn phí. |
| **Delta V > 0.05V** | `#DC2626` | Dark Red | **LỖI LỆCH CELL NGUY HIỂM:** Nguy cơ cháy nổ / Thoát nhiệt $\rightarrow$ Cách ly pin gấp. |
| **Second-Life BESS** | `#06B6D4` | Cyan Teal | **TÁI SINH TRẠM SẠC:** Pin được gán vào cụm lưu trữ BESS V-Green Marubeni. |
| **Recycled Material** | `#64748B` | Slate Gray | **TÁI CHẾ KIM LOẠI:** Đã thanh lý chuyển về nhà máy thủy luyện Hải Phòng. |

---

## 2. Hệ Thống Kiểu Chữ (Typography)
* **Font chữ chính:** `Inter`, `Be Vietnam Pro`, sans-serif (Độ đọc tối ưu cho cả giao diện tiếng Việt và tiếng Anh).
* **Font chữ hiển thị thông số đo (Số đo điện áp, dung lượng, SoH):** Sử dụng thuộc tính `font-feature-settings: "tnum"` (Tabular Numbers) để các con số nhảy không bị rung lắc layout.
* **Cấp bậc văn bản:**
  * **H1 / Page Title:** 24px - Bold (700) - `#0F172A`
  * **H2 / Section Title:** 18px - SemiBold (600) - `#1E293B`
  * **H3 / Card Header:** 15px - SemiBold (600) - `#334155`
  * **Body / Data Table:** 13px/14px - Regular (400) - `#475569`
  * **KPI Large Numbers:** 28px/32px - Bold (700) - `#0F172A`
  * **Badge & Tooltips:** 11px/12px - Medium (500) - Caps/Uppercase

---

## 3. Hợp Đồng 8 Trạng Thái Giao Diện (8-State UI Contract)
Tất cả các màn hình trong hệ thống đều phải đáp ứng đầy đủ 8 trạng thái hiển thị để đảm bảo trải nghiệm người dùng không bị gián đoạn:

```text
┌─────────────────┐    Truy vấn dữ liệu     ┌─────────────────┐    Có bản ghi     ┌─────────────────┐
│   1. IDLE       │ ──────────────────────> │   2. LOADING    │ ────────────────> │   3. SUCCESS    │
│ (Trạng thái chờ)│                         │ (Skeleton/Spin) │                   │ (Bảng dữ liệu)  │
└─────────────────┘                         └────────┬────────┘                   └─────────────────┘
                                                     │              Không có data ┌─────────────────┐
                                                     ├──────────────────────────> │   4. EMPTY      │
                                                     │                            │ (Hình minh họa) │
                                                     │              Lỗi mạng/500  └─────────────────┘
                                                     ├──────────────────────────> ┌─────────────────┐
                                                     │                            │   5. ERROR      │
                                                     │                            │ (Nút Thử lại)   │
                                                     │              Dữ liệu sai   └─────────────────┘
                                                     ├──────────────────────────> ┌─────────────────┐
                                                     │                            │  6. VALIDATION  │
                                                     │                            │ (Báo đỏ ô input)│
                                                     │              Pin chai <70% └─────────────────┘
                                                     ├──────────────────────────> ┌─────────────────┐
                                                     │                            │   7. WARNING    │
                                                     │                            │ (Còi cờ báo đỏ) │
                                                     │              Không đủ quyền└─────────────────┘
                                                     └──────────────────────────> ┌─────────────────┐
                                                                                  │ 8. PERM_DENIED  │
                                                                                  │ (403 Forbidden) │
                                                                                  └─────────────────┘
```

---

## 4. Mục Lục 3 Màn Hình Cốt Lõi Được Chi Tiết Hóa
1. [Màn hình 1: Dashboard Sức Khỏe Pin & Giám Sát Mạng Lưới (SCR-10)](01-dashboard-wireframe.md)
2. [Màn hình 2: Sổ Quản Lý Pack Pin & Modal Đo Kiểm Chẩn Đoán (SCR-20 & SCR-22)](02-battery-registry-wireframe.md)
3. [Màn hình 3: Cổng Hộ Chiếu Pin QR Di Động Chuẩn EU 2023/1542 (SCR-02)](03-mobile-qr-portal-wireframe.md)
4. [Tập Dữ Liệu Mẫu Đầy Đủ (Mock Data JSON)](mock-data.json)
