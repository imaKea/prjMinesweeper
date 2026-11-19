# Minefield — Web Game Minesweeper Đa Chế Độ & Quản Trị Laravel

> **Báo cáo tiến độ đồ án chuyên ngành (Tuần 1 – Tuần 13)**  
> Trường Cao đẳng Lý Tự Trọng TP. Hồ Chí Minh — Khoa Công nghệ Thông tin  
> Giảng viên hướng dẫn: **ThS. Mai Chiếm Tuấn**  
> Sinh viên thực hiện:  
> 1. **Nguyễn Phan Thiên Phước** — MSSV: `25002451` *(Backend Laravel, Security, Docker & Cloud Deploy)*  
> 2. **Tô Nguyễn Hoàng An** — MSSV: `25002441` *(Frontend Vanilla JS Engine, UI/UX, Motion & Testing)*  

**Minefield** là dự án game Dò Mìn (*Minesweeper*) hiện đại chạy trên nền tảng web đa thiết bị (PC, Tablet, Mobile). Dự án áp dụng mô hình phân tách hiệu năng cao: **Client Engine (Vanilla JS 0ms)** kết hợp **Server Authority (Laravel 12, MySQL / TiDB Cloud)** đảm bảo phản hồi tức thì, bảo mật chống gian lận thời gian mili-giây, nền kinh tế xu ảo, gợi ý mìn vùng biên, cửa hàng 26 skin và bảng điều khiển quản trị CMS chuyên nghiệp.

---

## 1. TÍNH NĂNG THEO PHÂN QUYỀN & NGHIỆP VỤ HỆ THỐNG

### 1.1. Khách vãng lai (Guest)
- **Chơi ngay không cần đăng ký:** Truy cập trực tiếp qua chế độ Khách (`POST /api/guest`).
- **Trải nghiệm đủ 9 biến thể:** 3 chế độ (`Classic`, `Plus`, `Corner`) × 3 cấp độ khó (`Easy`, `Medium`, `Hard`).
- **Thử nghiệm Gợi ý mìn (Hint):** Khách được phép gọi gợi ý mìn vùng biên trực tiếp trong phiên ván đấu.
- **Xem Bảng xếp hạng:** Tra cứu bảng xếp hạng cộng đồng thời gian thực theo từng chế độ và độ khó.
- *Giới hạn phiên:* Ván đấu được lưu tạm trong session máy chủ (`session()->pull()` tự hủy sau khi kết thúc ván), không lưu thành kỷ lục cá nhân lâu dài để khuyến khích đăng ký tài khoản.

### 1.2. Người chơi đã đăng ký (Registered Player)
- **Xác thực bảo mật:** Đăng ký, đăng nhập băm mật khẩu `Hash::make()` (bcrypt), giới hạn chống brute-force `throttle:10,1`, quản lý session an toàn.
- **Kỷ lục cá nhân & Bảng xếp hạng:** Tự động ghi nhận thành tích tốt nhất (`records.best_time_ms`) theo từng tổ hợp chế độ và độ khó; bảng xếp hạng phân cấp chính xác từng mili-giây.
- **Nền kinh tế Xu ảo (Virtual Coins):**
  - Tích lũy xu khi thắng ván đấu: Dễ (+30 xu), Trung bình (+75 xu), Khó (+180 xu).
  - Thưởng chế độ biến thể (`Plus`, `Corner`): Thưởng thêm **+20%** xu cơ bản.
  - **Thưởng tốc độ (Speed Bonus):** Thắng nhanh dưới 30s (+100 xu), dưới 60s (+50 xu), dưới 100s (+25 xu).
- **Thuật toán Gợi ý mìn thông minh (Hint System):**
  - Chi phí **100 xu** cho mỗi lần gọi gợi ý. Backend thẩm định số dư và trừ xu an toàn trong `DB::transaction()`.
  - Engine JS client (`applyHint()`) tự động quét tìm mìn ở vùng biên tiếp giáp ô số đã mở (*frontier cells*) và tự động cắm cờ chính xác kèm hiệu ứng radar (Phím tắt: `H`).
- **Cửa hàng 26 Skin cao cấp & Phòng Thử Chiến Thuật 5×5:**
  - Bộ sưu tập gồm **13 skin bàn cờ** (0 đến 900 xu) và **13 skin lá cờ vector SVG** (0 đến 700 xu), phân cấp 4 bậc: Đồng, Bạc, Vàng, Kim Cương.
  - **Phòng Thử Chiến Thuật 5×5:** Bàn cờ mini độc lập cho phép click mở ô, cắm cờ trải nghiệm hiệu ứng trực quan trước khi mua.
  - Hỗ trợ lọc danh mục, ghim mục tiêu phấn đấu, so sánh A/B và nút Hoàn tác; giao dịch bảo toàn qua transaction.
- **Giao diện Responsive Đa nền tảng & 7 Theme Pastel:**
  - Tự động co giãn theo màn hình (Desktop 3 cột; Tablet / Mobile đưa HUD và bàn cờ lên đầu, khay chứa `.board-wrap` cuộn ngang mượt mà).
  - Hỗ trợ thanh chuyển nhanh **Mở ô / Cắm cờ** (`touch-tool-bar`) và cắm cờ bằng thao tác nhấn giữ (Long-press ~380ms) tự động hủy nếu vuốt cuộn màn hình `> 10px`.
  - Hỗ trợ **7 chủ đề màu Pastel** thanh lịch (Mặc định Emerald, Rose, Amber, Ocean, Violet, Slate, Sunset) kết hợp hiệu ứng UI Motion (rung chấn khi nổ mìn, pháo hoa ăn mừng khi chiến thắng, sóng radar khi gợi ý).

### 1.3. Quản trị viên (Admin CMS)
- **Cổng đăng nhập chuyên biệt:** Cổng riêng biệt `/admin/login`, bảo vệ bằng middleware kiểm tra quyền quản trị (`role === 'admin'`).
- **Control Room Dashboard:** Thống kê tổng số người chơi, số ván đấu hoàn tất, tỷ lệ thắng/thua trực quan theo từng chế độ chơi, danh sách kỷ lục mới nhất.
- **Quản lý Người dùng (User Management):** Thêm mới tài khoản, chỉnh sửa thông tin, đổi mật khẩu, xóa tài khoản, Khóa/Mở khóa tài khoản ngay lập tức (có ràng buộc bảo vệ không thể khóa hoặc xóa admin cuối cùng).
- **Quản lý Kỷ lục (Leaderboard Management):** Xem danh sách phân trang, thêm kỷ lục thủ công, sửa đổi thời gian mili-giây, xóa bản ghi gian lận.
- **Công cụ Cấp Xu (Admin Give Coins):** Modal quản trị cho phép cộng tùy biến số lượng xu hoặc kích hoạt nhanh 999.999 xu phục vụ kiểm thử.

### 1.4. Cơ chế Chống gian lận Thời gian Đa tầng (Anti-Cheat Timer)
1. **Server-side Session & Token UUID:** Khi bắt đầu ván (`POST /api/games`), máy chủ sinh mã token UUID duy nhất và ghi nhận mốc `started_at` chính xác mili-giây.
2. **Validation biên chặt chẽ:** Giá trị `timeMs` gửi lên phải là số nguyên dương hợp lệ (`min:1`, `max:2147483647`).
3. **Chặn thời gian phi lý:** Thiết lập hằng số `MIN_PLAUSIBLE_TIME_MS = 200 ms` loại bỏ ngay mọi yêu cầu thắng từ 0 đến 199 ms gửi ngay sau khi khởi tạo ván (HTTP 422).
4. **Kiểm soát dung sai mạng:** Áp dụng ngưỡng dung sai `TIME_TOLERANCE_MS = 2.500 ms`. Nếu `reportedMs + 2500 < (now - started_at)`, máy chủ từ chối kết quả với mã HTTP 422.
5. **Khớp cấu hình ván (`verifyGamePayload`):** Kiểm tra trùng khớp mode và difficulty, ngăn chặn hành vi chơi ván Dễ nhưng gửi payload nhận thưởng ván Khó.
6. **Chống Replay Attack:** Token đã thắng gửi lại lần 2 trả HTTP 409 Conflict (thành viên) hoặc 404 Not Found (khách).
7. **Chống IDOR:** Ràng buộc `where('token', $token)->where('user_id', $user->id)` kết hợp `lockForUpdate()` trong `DB::transaction()`.
8. **Khóa trạng thái Client Engine:** Sau khi ván đấu ở trạng thái `won` hoặc `lost`, engine JS từ chối mọi click mở ô, cắm cờ hay gọi hint.

### 1.5. Hướng dẫn thao tác điều khiển
- **Chuột trái / Chạm:** Mở ô an toàn (lần click đầu luôn an toàn, bảo đảm số 0 để loang ô trống flood-fill).
- **Chord click:** Click chuột trái / chạm vào ô số đã mở khi xung quanh đã cắm đủ số cờ tương ứng để mở nhanh các ô còn lại.
- **Chuột phải / Nhấn giữ (Mobile):** Cắm/gỡ lá cờ đánh dấu ô có mìn.
- **Phím tắt nhanh (PC):**
  - `F`: Cắm / gỡ cờ tại ô đang trỏ chuột.
  - `H`: Sử dụng Gợi ý mìn thông minh (tiêu tốn 100 xu).
  - `R`: Khởi động lại ván chơi mới nhanh chóng.
- **3 cấp độ mặc định:** Dễ (`9×9 / 10 mìn`), Trung bình (`12×12 / 22 mìn`), Khó (`16×16 / 40 mìn`).

---

## 2. CÔNG NGHỆ VÀ PHIÊN BẢN HỆ THỐNG

- **Backend Framework:** PHP `^8.2 / 8.3` — **Laravel Framework `^12.0`**
- **Web Server Runtime:** Apache 2.4 (với `mod_rewrite` hỗ trợ route Laravel)
- **Cơ sở dữ liệu:** **MySQL 8.0** (Local XAMPP) / **TiDB Cloud Serverless** (kết nối PDO SSL với chứng chỉ `ca-certificates.crt`)
- **Kiểm thử tự động:** PHPUnit `^11.5.50` (SQLite in-memory) & Node.js test runner (`assert/strict`)
- **Frontend & Assets:** HTML5, CSS3, Blade Template, Vanilla JavaScript (IIFE modular), **Vite `^7.0.7`**, **Tailwind CSS `^4.0.0`**
- **Đóng gói & Đám mây:** **Docker** (Multi-stage build `node:20-alpine` + `php:8.3-apache`), **Render Web Service**

---

## 3. CẤU TRÚC MÃ NGUỒN DỰ ÁN

```text
prjMinesweeper/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── MinefieldAdminController.php   # Quản trị CMS, thống kê Control Room, CRUD user/record, cấp xu
│   │   │   ├── MinefieldAuthController.php    # Xác thực: signup, login, adminLogin, guest, logout, throttle
│   │   │   ├── MinefieldGameController.php    # Quản lý ván đấu, verifyTime chống gian lận, hint, win/loss, leaderboard
│   │   │   └── MinefieldShopController.php    # Cửa hàng skin: catalog, buy, equip qua DB transaction
│   │   └── Middleware/
│   │       ├── EnsureAccountIsActive.php      # Chặn tài khoản bị khóa thao tác hệ thống
│   │       └── EnsureActiveGame.php           # Thẩm định phiên ván đấu đang hoạt động
│   ├── Models/
│   │   ├── Difficulty.php, GameMode.php       # Danh mục độ khó và chế độ chơi (lưu neighbor_offsets JSON)
│   │   ├── Game.php, Record.php               # Quản lý phiên ván đấu và kỷ lục leaderboard
│   │   └── User.php, UserSkin.php             # Tài khoản người dùng và skin sở hữu
│   └── Services/
│       ├── MinefieldEngineService.php         # Dịch vụ engine hỗ trợ phía backend
│       └── SkinCatalog.php                    # Danh mục 26 skin, quy tắc tính xu, Speed Bonus và Hint cost
├── database/
│   ├── migrations/                            # Schema 6 bảng chính và các bảng hạ tầng Laravel
│   └── seeders/
│       ├── AdminUserSeeder.php                # Khởi tạo tài khoản Admin từ biến môi trường
│       ├── DatabaseSeeder.php                 # Nạp dữ liệu khởi tạo mặc định
│       └── MinefieldSeeder.php                # Nạp 3 chế độ (classic/plus/corner) & 3 độ khó (easy/medium/hard)
├── public/minefield/
│   ├── css/
│   │   ├── style.css                          # Layout tổng thể, responsive mobile/tablet/desktop, bàn cờ .board-wrap
│   │   └── ui-theme.css                       # Định nghĩa 7 theme Pastel và class hiển thị 13 skin bàn cờ
│   └── js/
│       ├── engine.js                          # Core JS Engine: Safe click, láng giềng, flood-fill, chording, applyHint
│       ├── game.js                            # Điều phối Gameplay, HUD Timer mili-giây, touch controls, sự kiện phím
│       ├── skins.js                           # Định nghĩa 13 skin cờ SVG vector và cấu hình giao diện
│       ├── shop.js                            # Logic Cửa hàng Skin, bộ lọc, ghim mục tiêu, Phòng Thử Chiến Thuật 5×5
│       ├── api.js                             # Module bọc các lời gọi RESTful API đến Laravel backend
│       ├── ui.js                              # Quản lý modal, thông báo toast, chuyển tab giao diện
│       ├── ui-motion.js                       # Hiệu ứng đồ họa: Screen shake rung chấn, Confetti pháo hoa, Radar sóng
│       ├── admin.js                           # Dashboard Control Room, biểu đồ win-rate, CRUD modal
│       ├── config.js, modes.js, login.js      # Scripts hỗ trợ cấu hình và điều hướng màn hình
├── resources/views/minefield/                 # Blade templates: game, shop, modes, login, admin-login, admin...
├── routes/web.php                             # Toàn bộ định tuyến Web UI và RESTful API
├── tests/
│   ├── Feature/
│   │   ├── AntiCheatAndTimerTest.php          # 9 test cases chuyên sâu kiểm toán an ninh Timer & Anti-Cheat
│   │   ├── MinefieldFlowTest.php              # 19 test cases vòng đời game, auth, session khách, admin CRUD
│   │   └── ShopAndCurrencyTest.php            # 10 test cases kinh tế xu, Speed Bonus, Hint 100 xu, mua/trang bị skin
│   ├── Unit/
│   │   └── ExampleTest.php                    # Unit test cơ bản
│   └── js/engine.test.cjs                     # 25 test cases độc lập DOM chạy bằng Node.js cho JS Engine
├── Dockerfile                                 # Multi-stage Docker build chuẩn hóa (Node 20 + PHP 8.3 Apache)
├── docker-entrypoint.sh                       # Script entrypoint: tự động nhận PORT, chờ DB, auto migrate/seed
└── Nguyen_Phan_Thien_Phuoc_To_Nguyen_Hoang_An/ # Thư mục đóng gói nộp đồ án chuẩn hóa theo quy định Khoa CNTT
```

---

## 4. HƯỚNG DẪN CÀI ĐẶT VÀ KHỞI CHẠY HỆ THỐNG

### 4.1. Khởi chạy trên môi trường Local XAMPP

1. Mở **XAMPP Control Panel**, nhấn **Start** dịch vụ **Apache** và **MySQL**.
2. Truy cập phpMyAdmin (`http://localhost/phpmyadmin`), tạo cơ sở dữ liệu `minefield` (bảng mã `utf8mb4_unicode_ci`).
3. Sao chép và cấu hình tệp `.env` tại thư mục gốc dự án:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=minefield
   DB_USERNAME=root
   DB_PASSWORD=

   MINEFIELD_ADMIN_USERNAME=Admin
   MINEFIELD_ADMIN_PASSWORD=MatKhauBaoMatCuaBan123!
   ```
4. Thực thi chạy Migration và nạp dữ liệu mẫu:
   ```powershell
   php artisan migrate --seed
   php artisan db:seed --class=AdminUserSeeder
   ```
5. Mở trình duyệt và truy cập:  
   `http://localhost/prjMinesweeper_antigravity/prjMinesweeper/public` *(hoặc đường dẫn tương ứng trong thư mục htdocs của bạn)*.

---

### 4.2. Khởi chạy bằng máy chủ phát triển nội bộ (`php artisan serve`)

1. Cập nhật `APP_URL` trong `.env`:
   ```env
   APP_URL=http://127.0.0.1:8000
   ```
2. Thực thi lệnh:
   ```powershell
   php artisan serve
   ```
3. Truy cập trình duyệt tại địa chỉ: `http://127.0.0.1:8000`.

---

### 4.3. Cài đặt Dependency & Biên dịch Production Assets

```powershell
composer install --no-dev --optimize-autoloader
npm install
npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache
```
*Ghi chú:* Lệnh `npm run build` sử dụng Vite 7 và Tailwind CSS 4 để biên dịch các asset production ra thư mục `public/build/`. Mọi đường dẫn asset trong game đều hỗ trợ base URL động, đảm bảo tương thích khi chạy trên root domain hoặc subpath.

---

### 4.4. Đóng gói Docker & Triển khai Cloud (Render + TiDB Cloud Serverless)

Dự án đã cấu hình hoàn chỉnh Dockerfile đa tầng và script khởi chạy tự động:
- **Build Container cục bộ:**
  ```powershell
  docker build -t minefield-app .
  docker run -p 8080:80 -e PORT=80 minefield-app
  ```
- **Triển khai trên Cloud Render & TiDB Cloud:**
  - **Render Web Service:** Kết nối GitHub repository, chọn Environment là **Docker**.
  - **Biến môi trường Production:**
    - `APP_ENV=production`, `APP_DEBUG=false`, `APP_KEY=base64:...`, `APP_URL=https://<your-app>.onrender.com`
    - `DB_CONNECTION=mysql`, `DB_HOST=<tidb-host>`, `DB_PORT=4000`, `DB_DATABASE=minefield`, `DB_USERNAME=<user>`, `DB_PASSWORD=<pass>`
    - `MYSQL_ATTR_SSL_CA=/etc/ssl/certs/ca-certificates.crt` (hỗ trợ mã hóa kết nối SSL an toàn qua TiDB Cloud)
    - `MINEFIELD_ADMIN_USERNAME=Admin`, `MINEFIELD_ADMIN_PASSWORD=<MatKhauAdminBaoMat>`
  - Khi container khởi động, `docker-entrypoint.sh` sẽ tự động chờ kết nối DB, chạy `php artisan migrate --force`, nạp seeder danh mục và tạo tài khoản Admin mà không cần can thiệp thủ công.

---

## 5. BẢNG DANH MỤC ĐƯỜNG DẪN VÀ API HỆ THỐNG

### 5.1. Giao diện Web (Web Pages)
- `GET /` — Màn hình Đăng nhập / Đăng ký người chơi và chơi thử Khách
- `GET /admin/login` — Cổng Đăng nhập chuyên biệt dành cho Quản trị viên
- `GET /modes` — Màn hình Lựa chọn Chế độ chơi và Cấp độ khó
- `GET /game` — Màn hình Bàn cờ Dò mìn (HUD, Timer, Hint, Cảm ứng mobile)
- `GET /shop` — Cửa hàng Trang bị Skin và Phòng Thử Chiến Thuật 5×5
- `GET /admin` — Bảng điều khiển Quản trị viên (Minefield Control Room, yêu cầu role `admin`)

### 5.2. RESTful API Xác thực & Phiên làm việc (Auth)
- `GET /api/session` — Lấy thông tin phiên làm việc hiện tại
- `POST /api/signup` — Đăng ký tài khoản mới (giới hạn `throttle:10,1`)
- `POST /api/login` — Đăng nhập người dùng (giới hạn `throttle:10,1`)
- `POST /api/admin/login` — Đăng nhập quản trị viên (giới hạn `throttle:10,1`)
- `POST /api/guest` — Khởi tạo phiên chơi thử Khách vãng lai
- `POST /api/logout` — Đăng xuất và hủy session

### 5.3. RESTful API Gameplay, Chống gian lận & Leaderboard
- `POST /api/games` — Khởi tạo ván đấu mới, cấp UUID token và lưu mốc `started_at`
- `POST /api/games/{token}/hint` — Xác thực trừ 100 xu trong DB cho mỗi lần gọi gợi ý mìn
- `POST /api/games/{token}/win` — Thẩm định thời gian (`MIN_PLAUSIBLE_TIME_MS = 200`, `TIME_TOLERANCE_MS = 2500`), kiểm tra mode/difficulty, chống replay, cộng xu thưởng, speed bonus và lưu kỷ lục
- `POST /api/games/{token}/loss` — Ghi nhận kết thúc ván thua vào CSDL
- `GET /api/leaderboard` — Lấy danh sách bảng xếp hạng theo chế độ và độ khó
- `GET /api/best-time` — Lấy thành tích tốt nhất của người dùng hiện tại

### 5.4. RESTful API Cửa hàng Skin
- `GET /api/shop` — Lấy danh mục 26 skin và số dư xu người chơi
- `POST /api/shop/buy` — Mua skin bằng xu ảo (xử lý transaction an toàn)
- `POST /api/shop/equip` — Trang bị skin đã sở hữu

### 5.5. RESTful API Quản trị viên (Admin CMS)
- `POST /admin/users` — Tạo mới tài khoản người dùng
- `PUT /admin/users/{user}` — Cập nhật thông tin / mật khẩu tài khoản
- `DELETE /admin/users/{user}` — Xóa tài khoản
- `POST /admin/users/{user}/lock` — Khóa / Mở khóa tài khoản người dùng
- `POST /admin/users/{user}/give-coins` (kèm alias `infinite-coins`) — Cấp xu cho tài khoản chỉ định
- `POST /admin/give-coins` — Cấp xu cho tài khoản admin hiện tại
- `POST /admin/records` — Thêm thủ công kỷ lục leaderboard
- `PUT /admin/records/{record}` — Chỉnh sửa kỷ lục leaderboard
- `DELETE /admin/records/{record}` — Xóa kỷ lục leaderboard

---

## 6. KẾT QUẢ KIỂM THỬ TỰ ĐỘNG (AUTOMATED TESTING)

### 6.1. Kiểm thử Backend Laravel (PHPUnit 11.5)
Chạy toàn bộ 40 bài kiểm thử chức năng tự động:
```powershell
php artisan test
```
**Kết quả thực tế:** **40 passed (259 assertions)** — Hoàn thành 100% không lỗi.
- `AntiCheatAndTimerTest.php` (9 tests): Kiểm tra chặn `timeMs <= 0`, chặn `< 200ms`, ranh giới dung sai 2.500ms, chống replay token thành viên/khách, chống gửi win/hint sau khi loss, chặn tráo đổi mode/difficulty, chống IDOR đánh cắp token, bảo toàn kỷ lục `isBest`.
- `MinefieldFlowTest.php` (19 tests): Render đầy đủ view/assets, xử lý bảng danh mục, vòng đời ván đấu thành viên và khách, xếp hạng mili-giây, phân quyền chặt chẽ, chống brute-force đăng nhập, CRUD tài khoản, khóa tài khoản, CRUD kỷ lục, cấp xu admin.
- `ShopAndCurrencyTest.php` (10 tests): Thưởng xu theo độ khó, thưởng +20% chế độ biến thể, thưởng tốc độ Speed Bonus, trừ 100 xu Hint, từ chối khi không đủ xu, mua và tự động trang bị skin qua transaction.

### 6.2. Kiểm thử Engine JavaScript Client (Node.js Test Runner)
Chạy bộ kiểm thử 25 test cases độc lập DOM:
```powershell
node tests/js/engine.test.cjs
```
**Kết quả thực tế:** **25 passed** (100% PASS).
- Láng giềng: 3/3 tests (Cổ điển 8 ô, Dấu cộng 4 ô, Góc chéo 4 ô).
- Sinh mìn an toàn (Safe First Click): 10/10 tests (Đủ 9 biến thể + kiểm tra góc, ô đầu ra số 0).
- Loang ô trống (Flood-fill): 2/2 tests (Loang đúng quy tắc, bảo vệ ô có cờ).
- Cắm cờ & Chord: 3/3 tests (Tăng giảm cờ, mở nhanh khi đủ cờ, chord cờ sai gây thua).
- Thắng / Thua: 3/3 tests (Mở hết ô an toàn thắng, bấm mìn thua, reset sạch trạng thái).
- Hint System: 2/2 tests (Tìm đúng mìn vùng biên, cắm cờ chính xác).
- Khóa trạng thái: 2/2 tests (Chặn mọi thao tác sau khi kết thúc ván, bảo vệ ô cắm cờ).

---

## 7. ĐÓNG GÓI SẢN PHẨM BÀN GIAO & CAM KẾT HỌC THUẬT

### 7.1. Cấu trúc Thư mục Đóng gói Nộp Đồ án
Thư mục bàn giao theo đúng quy chuẩn Khoa Công nghệ Thông tin:
`Nguyen_Phan_Thien_Phuoc_To_Nguyen_Hoang_An/`
- `PhieuDangKyDeTai/`: `PhieuDangKyDeTai.docx` và `.pdf` (Phiếu đăng ký đã chỉnh sửa).
- `BaoCao/`: `BaoCao.docx` và `.pdf` (Báo cáo tổng hợp từ Tuần 1 đến Tuần 13).
- `SourceCode/`: `SourceCode.zip` (Mã nguồn sạch, loại trừ `vendor/` và `node_modules/`) và `ScriptDataBase_Minefield.sql` (Kịch bản CSDL độc lập).
- `TaiLieu/`: `TaiLieuHuongDan.docx` (Tài liệu hướng dẫn cài đặt và giải thích kiến trúc).
- `Slide/`: `SlideBaoCao.pptx` (Slide trình bày báo cáo đồ án).
- `VideoDemo/`: `DemoSanPham.mp4` (Video quay minh họa đầy đủ tính năng hệ thống).

### 7.2. Cam kết Học thuật & Giới hạn Phạm vi
- **Không hỗ trợ Multiplayer thời gian thực:** Dự án tập trung tối ưu trải nghiệm chơi đơn (Single Player) chất lượng cao và cạnh tranh thành tích gián tiếp qua Bảng xếp hạng.
- **Không tích hợp thanh toán tiền thật:** Toàn bộ hệ thống giao dịch sử dụng cơ chế **Xu ảo (Coins)** tự kiếm qua kỹ năng chiến thắng trong game.
- **Cam kết sử dụng AI có trách nhiệm:** Các công cụ AI (ChatGPT, Claude, Gemini, Copilot) chỉ được dùng để hỗ trợ phân tích ca kiểm thử biên (edge cases), gợi ý cú pháp và tối ưu tài liệu. Nhóm sinh viên tự tay thực thi, kiểm chứng kết quả và nắm vững 100% mã nguồn để bảo vệ trước Hội đồng chấm thi.
