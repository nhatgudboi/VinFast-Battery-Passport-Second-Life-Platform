# Tài Liệu Hướng Dẫn Gọi API (VSF OpenAPI Contract)

Đặc tả hợp đồng API đầy đủ được duy trì tại file [openapi.yaml](openapi.yaml).

## Xác Thực (Authentication)
Mọi endpoint nội bộ yêu cầu truyền kèm Header:
```http
Authorization: Bearer <access_token>
```

## Các Endpoint Chính
* `POST /api/v1/auth/login`: Đăng nhập, nhận token JWT.
* `GET /api/v1/dashboard/metrics`: Lấy số liệu KPI tổng.
* `GET /api/v1/batteries`: Danh sách pack pin có phân trang và bộ lọc.
* `POST /api/v1/inspections`: Ghi nhận kiểm định dung lượng SoH.
* `GET /api/v1/public/passport/{serial}`: Cổng quét QR công khai.
