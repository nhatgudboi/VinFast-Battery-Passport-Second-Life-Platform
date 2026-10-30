# Sơ Đồ Lớp Cốt Lõi (Core Class Diagrams) — VSF

> **Dự án:** VSF — VinFast Battery Passport & Second-Life Platform  
> **Trạng thái:** TARGET V1 Clean Architecture Baseline  
> **Kiến trúc:** 3 tầng phân rã chuẩn hóa (Presentation API $\rightarrow$ Application Domain $\rightarrow$ Infrastructure Persistence)

Các sơ đồ lớp sử dụng quy ước bố cục từ trên xuống (`direction TB`) để tối ưu độ rộng hiển thị. Mỗi khối lớp định nghĩa rõ ràng kiểu dữ liệu C#, tính đóng gói (`+` public, `-` private), các interface (`<<interface>>`) và quan hệ thực thi (`..|>`).

---

## 1. Phân Hệ Xác Thực & Quản Trị Nhân Sự (Authentication & User Administration)

Quản lý đăng nhập JWT, kiểm tra quyền hạn RBAC và gán nhân sự trực thuộc xưởng dịch vụ:

```mermaid
classDiagram
    direction TB

    class AuthController {
        +LoginAsync(LoginRequest, CancellationToken) Task~IActionResult~
        +LogoutAsync(CancellationToken) Task~IActionResult~
        +GetMeAsync(CancellationToken) Task~IActionResult~
        +ChangePasswordAsync(ChangePasswordRequest, CancellationToken) Task~IActionResult~
    }

    class UsersController {
        +ListUsersAsync(UserQueryRequest, CancellationToken) Task~IActionResult~
        +CreateUserAsync(CreateUserRequest, CancellationToken) Task~IActionResult~
        +UpdateStatusAsync(long, bool, CancellationToken) Task~IActionResult~
    }

    class LoginRequest {
        +string Email
        +string Password
    }

    class LoginResponse {
        +string AccessToken
        +string TokenType
        +int ExpiresInSeconds
        +UserProfileDto User
    }

    class IAuthService {
        <<interface>>
        +LoginAsync(string email, string password) Task~AuthResult~
        +LogoutAsync(long userId) Task
        +ChangePasswordAsync(long userId, string oldPass, string newPass) Task
    }

    class IUserService {
        <<interface>>
        +GetByIdAsync(long id) Task~AppUser~
        +CreateUserAsync(CreateUserDto dto) Task~AppUser~
        +SetStatusAsync(long id, bool isActive) Task
    }

    class AuthService {
        -IUserRepository _userRepo
        -IPasswordHasher _hasher
        -IJwtTokenGenerator _jwtGen
        +LoginAsync(string email, string password) Task~AuthResult~
    }

    class AppUser {
        +long Id
        +long? WorkshopId
        +string Email
        +string PasswordHash
        +string FullName
        +string StaffCode
        +UserRole Role
        +bool IsActive
        +DateTimeOffset? LastLoginAt
        +DateTimeOffset? DeletedAt
        +bool CheckPassword(string password, IPasswordHasher hasher)
        +void RecordLogin()
    }

    class Workshop {
        +long Id
        +string Code
        +string Name
        +string City
        +bool IsActive
    }

    class IUserRepository {
        <<interface>>
        +FindByEmailAsync(string email) Task~AppUser~
        +FindByIdAsync(long id) Task~AppUser~
        +AddAsync(AppUser user) Task
        +UpdateAsync(AppUser user) Task
    }

    AuthController --> IAuthService
    UsersController --> IUserService
    AuthService ..|> IAuthService
    AuthService --> IUserRepository
    IUserRepository --> AppUser
    AppUser --> Workshop
```

---

## 2. Phân Hệ Pack Pin & Hộ Chiếu Số EU (Battery Registry & Digital Passport)

Quản lý thuộc tính điện hóa, tích hợp quy định EU Battery Regulation (EU 2023/1542), tính toán dấu chân carbon và xuất tem nhãn QR in nhiệt 100x75mm:

```mermaid
classDiagram
    direction TB

    class BatteriesController {
        +ListAsync(BatteryQueryRequest, CancellationToken) Task~IActionResult~
        +GetByIdAsync(long, CancellationToken) Task~IActionResult~
        +CreateAsync(CreateBatteryRequest, CancellationToken) Task~IActionResult~
        +GetQrLabelAsync(long, CancellationToken) Task~IActionResult~
        +SoftDeleteAsync(long, CancellationToken) Task~IActionResult~
    }

    class IBatteryService {
        <<interface>>
        +GetDetailsAsync(long id) Task~BatteryDetailDto~
        +RegisterNewPackAsync(CreateBatteryDto dto) Task~Battery~
        +GenerateQrLabelAsync(long id) Task~QrLabelDto~
        +SoftDeleteAsync(long id, long actorId) Task
    }

    class BatteryService {
        -IBatteryRepository _batteryRepo
        -IPassportRepository _passportRepo
        -IQrCodeGenerator _qrGen
        -IAuditService _audit
        +RegisterNewPackAsync(CreateBatteryDto dto) Task~Battery~
    }

    class Battery {
        +long Id
        +string SerialNumber
        +VehicleModel ModelName
        +CellChemistry CellChemistry
        +decimal NominalCapacityKwh
        +decimal NominalVoltageV
        +decimal PackWeightKg
        +string Manufacturer
        +DateOnly ManufactureDate
        +LifecycleStatus LifecycleStatus
        +decimal CurrentSoh
        +int TotalCycles
        +long? CurrentWorkshopId
        +BatteryPassport Passport
        +void UpdateSoh(decimal newSoh, int cycles)
        +void TransitionStatus(LifecycleStatus newStatus)
        +void MarkDeleted(long actorId)
    }

    class BatteryPassport {
        +long Id
        +long BatteryId
        +string PassportId
        +string QrPayloadUrl
        +string DataMatrixHash
        +string EuDeclaration
        +decimal CarbonFootprintKgCo2ePerKwh
        +string CarbonPerformanceClass
        +decimal RecycledCobaltPercent
        +decimal RecycledLithiumPercent
        +decimal RecycledNickelPercent
        +bool SafetyTestUn38_3Certified
        +PassportStatus Status
        +void DecommissionAndLock()
    }

    class IBatteryRepository {
        <<interface>>
        +FindByIdWithPassportAsync(long id) Task~Battery~
        +FindBySerialAsync(string serial) Task~Battery~
        +AddAsync(Battery battery) Task
        +UpdateAsync(Battery battery) Task
    }

    class IQrCodeGenerator {
        <<interface>>
        +GenerateSvgDataMatrix(string payload) string
    }

    BatteriesController --> IBatteryService
    BatteryService ..|> IBatteryService
    BatteryService --> IBatteryRepository
    BatteryService --> IQrCodeGenerator
    Battery --> BatteryPassport
    IBatteryRepository --> Battery
```

---

## 3. Phân Hệ Đo Kiểm Sức Khỏe & Hoán Đổi Xe 1-N Nguyên Tử (Diagnostics & 1-N Swap)

Thuật toán tính toán SoH, phát hiện độ lệch điện áp cell $\Delta V = V_{\text{max}} - V_{\text{min}}$, tự động kích hoạt bảo hành khi $\text{SoH} < 70\%$ hoặc $\Delta V > 0.050\text{V}$ và phê duyệt hoán đổi 1-N:

```mermaid
classDiagram
    direction TB

    class InspectionsController {
        +CreateInspectionAsync(CreateInspectionRequest) Task~IActionResult~
        +GetByIdAsync(long) Task~IActionResult~
        +ListAsync(InspectionQueryRequest) Task~IActionResult~
    }

    class SwapsController {
        +CreateSwapOrderAsync(CreateSwapOrderRequest) Task~IActionResult~
        +ApproveAsync(long) Task~IActionResult~
        +RejectAsync(long, RejectRequest) Task~IActionResult~
    }

    class IInspectionService {
        <<interface>>
        +ExecuteDiagnosticAsync(CreateInspectionDto dto, ActorContext actor) Task~InspectionResultDto~
    }

    class ISwapWorkflowService {
        <<interface>>
        +CreateSwapOrderAsync(long inspectionId, long newBatteryId) Task~SwapOrderDto~
        +ApproveSwapOrderAsync(long swapOrderId, ActorContext leadActor) Task~SwapOrderResult~
    }

    class CellFaultSafetyPolicy {
        +const decimal MaxAllowedDeltaVolts = 0.050m
        +const decimal WarrantyThresholdSoh = 70.00m
        +bool IsCellImbalanceCritical(decimal vMax, decimal vMin)
        +InspectionConclusion DetermineConclusion(decimal soh, bool hasFault)
    }

    class VehicleBatteryRebinder {
        -IVehicleRepository _vehicleRepo
        -IBatteryRepository _batteryRepo
        -IVehicleBatteryHistoryRepository _historyRepo
        +RebindAtomicAsync(long vehicleId, long oldBattId, long newBattId) Task
    }

    class BatteryInspection {
        +long Id
        +long BatteryId
        +long? VehicleId
        +DateTimeOffset InspectionDate
        +decimal MeasuredCapacityKwh
        +decimal CalculatedSoh
        +decimal InternalResistanceMohm
        +decimal VMaxVolts
        +decimal VMinVolts
        +decimal VDeltaVolts
        +bool HasCellFault
        +InspectionConclusion Conclusion
    }

    class BatterySwapOrder {
        +long Id
        +long InspectionId
        +long VehicleId
        +long OldBatteryId
        +long NewBatteryId
        +long StationLeadId
        +SwapOrderStatus Status
        +DateTimeOffset? ApprovedAt
        +void Approve(long leadId)
        +void Reject(long leadId, string reason)
    }

    class VehicleBatteryHistory {
        +long Id
        +long VehicleId
        +long BatteryId
        +SwapAction ActionType
        +int OdometerAtAction
        +decimal BatterySohAtAction
        +DateTimeOffset InstalledAt
        +DateTimeOffset? RemovedAt
    }

    class IUnitOfWork {
        <<interface>>
        +BeginTransactionAsync() Task
        +CommitAsync() Task
        +RollbackAsync() Task
    }

    InspectionsController --> IInspectionService
    SwapsController --> ISwapWorkflowService
    IInspectionService --> CellFaultSafetyPolicy
    IInspectionService --> BatteryInspection
    ISwapWorkflowService --> VehicleBatteryRebinder
    ISwapWorkflowService --> IUnitOfWork
    VehicleBatteryRebinder --> BatterySwapOrder
    VehicleBatteryRebinder --> VehicleBatteryHistory
```
