# Danh Mục Tính Năng Sản Phẩm (Feature Catalog) — VSF

> **Trạng thái:** TARGET V1  
> **Cấu trúc:** Phân rã 6 Phân hệ Sản phẩm thành 12 Feature Groups (F01 – F12) và 28 Sub-features cụ thể.

---

## 1. Bảng Tổng Hợp Danh Mục Tính Năng

| Mã | Tên Tính Năng (Feature Group) | Phân Hệ Sản Phẩm | Vai Trò Chính | Trạng Thái V1 |
|---|---|---|---|:---:|
| **F01** | Xác thực & Quản lý Phiên (Authentication) | Bảo Mật & Quản Trị | Toàn bộ 4 roles | Hoàn chỉnh |
| **F02** | Dashboard Phân Tích Vòng Đời & SoH | Báo Cáo & Tích Hợp | Admin, Station Lead | Hoàn chỉnh |
| **F03** | Quản Lý Danh Mục Model Pin VinFast | Quản Trị Pack Pin | Admin | Hoàn chỉnh |
| **F04** | Sổ Quản Lý Pack Pin & Gắn Kết Xe 1-N | Quản Trị Pack Pin | Admin, Lead, Tech | Hoàn chỉnh |
| **F05** | Sinh Mã & In Tem Nhãn QR Hộ Chiếu | Quản Trị Pack Pin | Lead, Tech | Hoàn chỉnh |
| **F06** | Đo Kiểm & Tính Toán SoH Tự Động | Kiểm Định & Chẩn Đoán | Lead, Tech | Hoàn chỉnh |
| **F07** | Kích Hoạt Bảo Hành Đổi Pin (<70% / Lỗi Cell) | Kiểm Định & Chẩn Đoán | Lead, Tech | Hoàn chỉnh |
| **F08** | Điều Phối Tái Sinh Trạm Sạc V-Green BESS | Tái Sinh Second-Life | Admin, Station Lead | Hoàn chỉnh |
| **F09** | Thanh Lý & Chuyển Giao Tái Chế Phế Liệu | Tái Sinh Second-Life | Admin, Station Lead | Hoàn chỉnh |
| **F10** | Nhập Lô Pin Xuất Xưởng Qua File Excel | Báo Cáo & Tích Hợp | Admin, Station Lead | Hoàn chỉnh |
| **F11** | Cổng Tra Cứu Hộ Chiếu QR Công Khai | Cổng QR Di Động | Public, Auditor | Hoàn chỉnh |
| **F12** | Xuất Báo Cáo & Chứng Nhận PDF Chuẩn EU | Báo Cáo & Tích Hợp | Lead, Auditor | Hoàn chỉnh |

---

## 2. Chi Tiết Từng Tính Năng

### F01: Xác thực & Phân quyền Hệ thống (Authentication & RBAC)
* **F01.1:** Đăng nhập an toàn qua REST API, trả về Bearer JWT Token thời hạn 60 phút. Mật khẩu băm bằng PBKDF2 muối ngẫu nhiên.
* **F01.2:** Đăng xuất phía máy trạm (Client-side token discard) và ghi nhận sự kiện vào Audit Log.
* **F01.3:** Route Guard & Role Guard tại Frontend: Điều hướng tự động theo quyền hạn; chặn truy cập trái phép chuyển về trang `/403 Forbidden`.
* **F01.4:** Phân quyền 4 nhóm vai trò độc lập: `ADMIN`, `STATION_LEAD`, `TECHNICIAN`, `AUDITOR`.

### F02: Dashboard Phân Tích Sức Khỏe Pin Toàn Mạng Lưới
* **F02.1:** Thẻ KPIs tức thời: Tổng số pack pin quản lý, số pin đang vận hành trên xe, số pin chờ đổi mới, số pin đang hoạt động tại trạm BESS.
* **F02.2:** Biểu đồ phân bố độ chai pin (SoH Distribution Chart): Phân nhóm $>85\%$ (Tốt), $70-85\%$ (Trung bình), $<70\%$ (Chai - Cần thu hồi).
* **F02.3:** Biểu đồ tỷ lệ pin theo dòng xe VinFast (VF 3, VF 5, VF 6, VF 7, VF 8, VF 9).
* **F02.4:** Danh sách cảnh báo sớm: Hiển thị các pack pin suy giảm dung lượng bất thường hoặc có độ lệch cell lớn.

### F03 & F04: Quản Trị Pack Pin & Gắn Kết Xe (Asset Tracking)
* **F03.1:** Quản lý danh mục Model xe và thông số pin chuẩn hóa ($C_{\text{nominal}}$, loại cell LFP/NMC, nhà sản xuất VinES/CATL/Gotion).
* **F04.1:** Sổ theo dõi toàn bộ pack pin VinFast toàn quốc với mã định danh duy nhất (Serial/UUID).
* **F04.2:** Quản lý quan hệ 1-N theo thời gian giữa Xe (VIN / Biển số) và Quả pin (Serial), lưu vết lịch sử đổi pin.
* **F04.3:** Bộ lọc đa chiều: Lọc theo dòng xe, khoảng SoH, trạng thái vòng đời, xưởng dịch vụ quản lý.

### F05: Sinh Mã & In Tem Nhãn QR Code
* **F05.1:** Tự động sinh mã QR liên kết động tới URL tra cứu công khai: `https://vsf.vinfast.vn/passport/{serial}`.
* **F05.2:** Trình xuất tem nhãn vector kích thước tiêu chuẩn công nghiệp (50x30mm hoặc 70x40mm) chống nước dán lên vỏ pack pin.

### F06 & F07: Kiểm Định Đo Đạc & Kích Hoạt Bảo Hành Đổi Pin
* **F06.1:** Modal nhập thông số đo kiểm tại xưởng: Dung lượng đo thực tế ($C_{\text{measured}}$), Nội trở ($m\Omega$), Độ lệch điện áp cell ($\Delta V$), Nhiệt độ đỉnh.
* **F06.2:** Thuật toán tính SoH tự động: Hệ thống tự động khóa dung lượng gốc theo Model xe, tính chính xác $\text{SoH} = (C_{\text{measured}} / C_{\text{nominal}}) \times 100\%$.
* **F06.3:** Tự động bắt lỗi an toàn: Bắt cờ cảnh báo lỗi cell/nguy cơ thoát nhiệt ($\Delta V > 100\text{mV}$, pin ngập nước, nứt vỏ).
* **F07.1:** Tự động kích hoạt quy trình bảo hành: Chuyển trạng thái pin sang `RECALL_PENDING` khi $\text{SoH} < 70\%$ hoặc có lỗi cell nghiêm trọng, gửi cảnh báo đến Trưởng xưởng để xuất kho pin mới.

### F08 & F09: Điều Phối Tái Sinh Second-Life & Tái Chế
* **F08.1:** Quản lý danh sách pin thu hồi đạt chuẩn tái sinh ($55\% \le \text{SoH} < 70\%$ và cell an toàn).
* **F08.2:** Phân bổ pack pin vào các tủ rack container của Trạm sạc tích điện V-Green BESS (lưu mã trạm, vị trí Rack ID).
* **F09.1:** Lập lệnh thanh lý chuyển giao nhà máy thủy luyện VinES đối với pin chai $<55\%$ hoặc hỏng vỏ để thu hồi kim loại quý Lithium/Cobalt.

### F10: Nhập Lô Pin Xuất Xưởng Từ Excel (VinES Batch Import)
* **F10.1:** Tải file Excel mẫu gồm các trường: Serial, ModelCode, ManufactureDate, CarbonFootprint, RecycledContent.
* **F10.2:** Kéo-thả file Excel, xem trước (Preview) 100% dữ liệu trước khi lưu.
* **F10.3:** Báo lỗi chi tiết từng dòng (dòng nào trùng Serial, dòng nào sai Model) và thực thi lưu nguyên tử (Atomic All-or-Nothing).

### F11 & F12: Cổng Tra Cứu QR Di Động & Xuất Chứng Nhận PDF Chuẩn EU
* **F11.1:** Cổng tra cứu Hộ chiếu Pin QR di động (Mobile Web) công khai, không cần đăng nhập.
* **F11.2:** Hiển thị minh bạch: Nguồn gốc cell, dung lượng ban đầu, dung lượng hiện tại, số chu kỳ sạc, Dấu chân Carbon ($gCO_2eq/kWh$) và Tỷ lệ vật liệu tái chế (%), tuyệt đối không lộ thông tin cá nhân chủ xe.
* **F12.1:** Xuất file Giấy chứng nhận Sức khỏe Pin (EU Battery Health Certificate) định dạng PDF có mã QR xác thực và chữ ký số.
