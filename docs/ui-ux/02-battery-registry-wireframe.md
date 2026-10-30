# Bản Vẽ Giao Diện: Sổ Quản Lý Pack Pin & Modal Đo Kiểm Chẩn Đoán (SCR-20 & SCR-22)

> **Mã màn hình:** `SCR-20` (Sổ quản lý danh sách pin) & `SCR-22` (Modal Kỹ thuật viên đo kiểm)  
> **Người dùng chính:** Kỹ thuật viên bảo dưỡng (Technician), Trưởng xưởng (Station Lead)  
> **Mục tiêu:** Quản lý toàn bộ thông tin quả pin, thực hiện đo đạc tự động tính toán SoH, phát hiện lỗi cell và kích hoạt đổi pin.

---

## 1. Màn Hình Danh Sách: Sổ Quản Lý Pack Pin (SCR-20)

```text
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [V] SỔ QUẢN LÝ PACK PIN TOÀN QUỐC                                           [+ Nhập Lô Excel]  [+ Đăng Ký Pin Mới]     │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ BỘ LỌC ĐA CHIỀU:                                                                                                       │
│ [🔍 Nhập Serial hoặc mã VIN...         ] [Dòng xe: Tất cả ▼] [Trạng thái: Tất cả ▼] [Kho/Xưởng: VinFast Ocean Park ▼]   │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ TÌM THẤY: 5 PACK PIN TIÊU BIỂU (TRANG 1/1)                                                        [Tùy chọn hiển thị ▼]│
├──────────────────────┬─────────────┬──────────┬────────┬────────┬──────────────────┬─────────────────┬─────────────────┤
│ MÃ SERIAL PIN        │ DÒNG XE     │ LOẠI PIN │ SOH    │ CELL ΔV│ TRẠNG THÁI       │ XE / VỊ TRÍ GẮN │ THAO TÁC        │
├──────────────────────┼─────────────┼──────────┼────────┼────────┼──────────────────┼─────────────────┼─────────────────┤
│ VF-BAT-VF8-2023-00912│ VF 8 Plus   │ NMC 87.7k│ 67.5%  │ 0.024V │ [RECALL_PENDING] │ VNF8A... (29E)  │ [⚡ Đo kiểm]    │
│                      │ 240Ah-VinES │          │ [ĐỎ]   │ [TỐT]  │ Chờ đổi bảo hành │ Xanh SM Taxi    │ [QR] [Đổi Pin]  │
├──────────────────────┼─────────────┼──────────┼────────┼────────┼──────────────────┼─────────────────┼─────────────────┤
│ VF-BAT-VF5-2024-03120│ VF 5 Plus   │ LFP 37.2k│ 93.5%  │ 0.015V │ [ON_VEHICLE]     │ VNF5B... (30K)  │ [⚡ Đo kiểm]    │
│                      │ 105Ah-VinES │          │ [XANH] │ [TỐT]  │ Đang lăn bánh    │ Xe cá nhân      │ [QR] [Chi tiết] │
├──────────────────────┼─────────────┼──────────┼────────┼────────┼──────────────────┼─────────────────┼─────────────────┤
│ VF-BAT-VF9-2023-00108│ VF 9 Plus   │ NMC 123k │ 89.0%  │ 0.072V │ [RECALL_PENDING] │ VNF9C... (51K)  │ [⚡ Đo kiểm]    │
│                      │ 330Ah-CATL  │          │ [XANH] │ [BÁO ĐỎ│ Lỗi cell nguy cấp│ Xe cá nhân      │ [QR] [ĐỔI GẤP]  │
├──────────────────────┼─────────────┼──────────┼────────┼────────┼──────────────────┼─────────────────┼─────────────────┤
│ VF-BAT-VF8-2022-00411│ VF 8 Plus   │ NMC 87.7k│ 63.0%  │ 0.031V │ [SECOND_LIFE]    │ Trạm Sạc Cao Tốc│ [QR] [Lịch sử]  │
│                      │ 240Ah-VinES │          │ [VÀNG] │ [TỐT]  │ Tủ BESS Rack #B04│ Pháp Vân Cầu Giẽ│ [Chuyển vị trí] │
├──────────────────────┼─────────────┼──────────┼────────┼────────┼──────────────────┼─────────────────┼─────────────────┤
│ VF-BAT-VF3-2024-00055│ VF 3        │ LFP 18.6k│ 47.1%  │ 0.085V │ [RECYCLED]       │ NM Thủy Luyện   │ [QR] [Chứng nhận│
│                      │ 52Ah-Gotion │          │ [XÁM]  │ [HỎNG] │ Đã thu hồi khoáng│ Hải Phòng       │  Tái chế EU]    │
└──────────────────────┴─────────────┴──────────┴────────┴────────┴──────────────────┴─────────────────┴─────────────────┘
```

---

## 2. Modal Kỹ Thuật Viên Đo Kiểm & Chẩn Đoán SoH Tự Động (SCR-22)
*Khi Kỹ thuật viên bấm nút **"[⚡ Đo kiểm]"**, cửa sổ Modal mở ra với thiết kế 2 cột chuẩn xưởng:*

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ PHIẾU ĐO KIỂM & ĐÁNH GIÁ SỨC KHỎE PACK PIN                                         [X] │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Thông tin pack: VF-BAT-VF8-2023-00912  |  Model: VF 8 Plus  |  Dung lượng chuẩn: 240 Ah│
│ Xe đang gắn: VinFast VF 8 (VIN: VNF8A21P5PA004312 - Biển số: 29E-882.14 Xanh SM)       │
├───────────────────────────────────────────┬────────────────────────────────────────────┤
│ CỘT 1: NHẬP SỐ ĐO TỪ MÁY CHẨN ĐOÁN        │ CỘT 2: KẾT QUẢ TÍNH TOÁN TỰ ĐỘNG (REALTIME)│
│                                           │                                            │
│ 1. Dung lượng đo được thực tế (Ah): *     │ [ BIỂU ĐỒ TRÒN GAUGE ĐỘ KHỎE PIN ]         │
│    [ 162.00                       ] Ah    │                    ╭─────╮                 │
│    (Tương đương 59.20 kWh thực tế)        │                 ╭──╯ 67.5% ╰──╮             │
│                                           │                 │    [ĐỎ]     │             │
│ 2. Điện áp cell cao nhất (V_max): *       │                 ╰─────────────╯             │
│    [ 3.652                        ] Volt  │ Điểm SoH: 67.50% (Đã chai 32.50%)          │
│                                           │                                            │
│ 3. Điện áp cell thấp nhất (V_min): *      │ Độ lệch cell: ΔV = 3.652 - 3.628 = 0.024V  │
│    [ 3.628                        ] Volt  │ Trạng thái cell: [AN TOÀN] (24mV <= 50mV)  │
│                                           │                                            │
│ 4. Nội trở Pack pin (mΩ):                 │ ------------------------------------------ │
│    [ 14.2                         ] mΩ    │ KẾT LUẬN CỦA HỆ THỐNG:                     │
│                                           │ ⚠️ ĐỦ ĐIỀU KIỆN ĐỔI PIN BẢO HÀNH MIỄN PHÍ   │
│ 5. Nhiệt độ đỉnh khi sạc/xả (°C):         │ (Do SoH = 67.5% < 70% theo cam kết VinFast)│
│    [ 34.5                         ] °C    │ Đề xuất: Điều phối pin cũ sang trạm BESS   │
├───────────────────────────────────────────┴────────────────────────────────────────────┤
│ [Hủy bỏ]                   [Lưu Kết Quả Đo Kiểm]        [⚡ TẠO LỆNH ĐỔI PIN BẢO HÀNH NGAY]│
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Quy Tắc Phản Hồi Tức Thì Tại Modal Đo Kiểm
1. Khi KTV gõ số `162.00` vào ô dung lượng đo:
   * Hệ thống tự động lấy $162.00 / 240.00 \times 100\% = \mathbf{67.50\%}$.
   * Kim đồng hồ Gauge bên phải quay ngay lập tức về mức $67.5\%$ và đổi sang màu cam đỏ.
2. Khi KTV gõ số $V_{\max}$ và $V_{\min}$:
   * Hệ thống tự động trừ: $\Delta V = 3.652 - 3.628 = 0.024\text{V}$.
   * Nhãn `AN TOÀN` màu xanh lá hiện ra bên cạnh vì $24\text{mV} < 50\text{mV}$.
3. Nút bấm **"[⚡ TẠO LỆNH ĐỔI PIN BẢO HÀNH NGAY]"** tự động kích hoạt từ trạng thái mờ (Disabled) sang sáng xanh đậm (Enabled), cho phép bấm để chuyển tiếp sang màn hình hoán đổi pin 1 - N cho xe.
