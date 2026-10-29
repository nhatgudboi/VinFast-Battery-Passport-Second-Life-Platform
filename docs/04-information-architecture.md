# Kiến Trúc Thông Tin & Phân Cấp Giao Diện (Information Architecture)

## 1. Cây Phân Cấp Màn Hình (Screen Hierarchy)

```text
Public Gateway
├── /login                         [Màn hình Đăng nhập 2 cột phong cách VinFast]
└── /passport/:serialNumber        [Màn hình Tra cứu Hộ chiếu Pin QR dành cho Mobile]

Authenticated Workspace
├── /dashboard                     [Dashboard KPI vòng đời & Biểu đồ phân bố SoH]
├── /batteries                     [Sổ Quản lý Pack Pin toàn hệ thống]
│   ├── Modal: Chi tiết Hộ chiếu Pin
│   ├── Modal: Đăng ký Pin mới
│   └── Modal: In Tem Nhãn Mã QR
├── /inspections                   [Nhật ký Kiểm định & Lịch sử Đo đạc]
│   └── Modal: Thực hiện Kiểm định Đo dung lượng
├── /second-life                   [Phân luồng Tái sinh Trạm sạc V-Green BESS]
│   └── Modal: Ghép nối Pin vào Cụm Trạm sạc
├── /import                        [Nhập lô Pin từ Nhà máy VinES qua Excel]
├── /reports                       [Xuất Báo cáo & Chứng nhận Kiểm định PDF]
├── /audit                         [Nhật ký Kiểm toán Toàn hệ thống]
├── /users                         [Quản trị Tài khoản & Phân quyền Xưởng]
├── /profile                       [Hồ sơ Cá nhân & Đổi Mật khẩu]
└── /403                           [Màn hình Từ chối Truy cập]
```

## 2. Các Trạng Thái Giao Diện Chuẩn Hóa
Mọi màn hình đều áp dụng nhất quán 6 trạng thái UI:
1. **Loading State**: Hiệu ứng Skeleton loader mượt mà khi nạp dữ liệu.
2. **Empty State**: Hình ảnh minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
3. **Validation State**: Báo lỗi đỏ dưới từng ô nhập liệu kèm thông điệp nghiệp vụ cụ thể.
4. **Saving State**: Vô hiệu hóa nút bấm và hiển thị spinner khi đang gửi request lên API.
5. **Success State**: Toast notification tự động biến mất sau 3 giây.
6. **Error State**: Banner cảnh báo hoặc Toast đỏ kèm mã lỗi ổn định (RFC 7807).
