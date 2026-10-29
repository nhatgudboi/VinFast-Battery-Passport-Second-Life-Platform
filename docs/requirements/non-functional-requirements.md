# Yêu Cầu Phi Chức Năng (Non-Functional Requirements)

* **NFR-01 (Hiệu năng API):** Thời gian phản hồi 95% các yêu cầu tra cứu danh sách pin và dashboard dưới 250ms với 50.000 bản ghi trong cơ sở dữ liệu.
* **NFR-02 (Tính khả dụng):** Trang tra cứu mã QR công khai có thời gian tải trang (First Contentful Paint) dưới 1.2 giây trên mạng di động 4G.
* **NFR-03 (Bảo mật):** Mật khẩu người dùng được băm bằng thuật toán PBKDF2 với muối ngẫu nhiên (Salt). Token xác thực ký bằng mã bí mật HMAC-SHA256, thời hạn 60 phút.
* **NFR-04 (Tính toàn vẹn dữ liệu):** Thao tác nhập file Excel theo cơ chế Atomic Transaction (Toàn bộ hoặc không có gì). Nếu có lỗi nghiêm trọng, hệ thống tự động Rollback, không để lại dữ liệu rác.
