# Minefield — Web Game Minesweeper Đa Chế Độ & Quản Trị Laravel

Minefield là dự án đồ án chuyên ngành phát triển trò chơi Dò Mìn (Minesweeper) hiện đại trên nền tảng web, kết hợp giữa giao diện người dùng tương tác cao (Vanilla JavaScript/CSS, UI Motion) và kiến trúc máy chủ bảo mật, chống gian lận (Laravel 12, MySQL).

---

## 1. TÍNH NĂNG THEO PHÂN QUYỀN

### 1.1. Khách vãng lai (Guest)
- **Chơi ngay không cần đăng ký:** Truy cập trực tiếp qua chế độ Khách (`POST /api/guest`).
- **Trải nghiệm đầy đủ 9 biến thể:** 3 chế độ dò mìn (`Classic`, `Plus`, `Corner`) × 3 cấp độ khó (`Easy`, `Medium`, `Hard`).
- **Thử nghiệm tính năng Gợi ý (Hint):** Khách được cấp quyền dùng thử tính năng Hint mìn trong phiên làm việc.
- **Xem Bảng xếp hạng:** Tra cứu bảng xếp hạng thời gian thực của toàn bộ cộng đồng.
- *Giới hạn:* Ván chơi được lưu tạm trong session máy chủ, không lưu thành kỷ lục cá nhân lâu dài.

### 1.2. Người chơi đã đăng ký (Registered Player)
- **Xác thực an toàn:** Đăng ký, đăng nhập có băm mật khẩu bảo mật và cơ chế chống vét cạn brute-force (`throttle:10,1`).
- **Kỷ lục cá nhân & Bảng xếp hạng:** Lưu thành tích ván thắng vào CSDL, xếp hạng cạnh tranh chính xác đến từng mili-giây.
- **Hệ thống Kinh tế Xu ảo (Coins):**
  - Tích lũy xu khi thắng ván đấu: Dễ (+30 xu), Trung bình (+75 xu), Khó (+180 xu).
  - Chế độ biến thể (`Plus`, `Corner`): Thưởng thêm **+20%** xu cơ bản.
  - **Thưởng tốc độ (Speed Bonus):** Thắng nhanh dưới 30 giây (+100 xu), dưới 60 giây (+50 xu), dưới 100 giây (+25 xu).
- **Tính năng Gợi ý mìn thông minh (Hint System):**
  - Tiêu tốn **100 xu** để nhận 1 gợi ý mìn chính xác (giao dịch trừ xu được xác thực an toàn qua `POST /api/games/{token}/hint`).
  - Engine JS phía client (`applyHint()`) tự động dò tìm mìn ở vùng biên tiếp giáp ô số đã mở (frontier) và cắm cờ đánh dấu ngay lập tức (Phím tắt: `H`).
- **Cửa hàng Skin (Shop):**
  - Khám phá 14 mẫu trang bị: 7 skin bàn cờ và 7 skin lá cờ (giá từ 0 đến 750 xu).
  - Giao dịch an toàn qua `DB::transaction()`, tự động trang bị ngay khi mua.

### 1.3. Quản trị viên (Admin)
- **Cổng đăng nhập chuyên biệt:** Đường dẫn riêng `/admin/login`, bảo vệ tài khoản quản trị.
- **Bảng điều khiển (Control Room Dashboard):** Thống kê tổng số người chơi, số ván đấu hoàn tất, tỷ lệ thắng/thua theo từng chế độ chơi.
- **Quản lý Tài khoản (User Management):** Thêm mới, chỉnh sửa thông tin, đổi mật khẩu, xóa tài khoản, Khóa/Mở khóa tài khoản người chơi (có ràng buộc bảo vệ không thể khóa hoặc xóa admin cuối cùng).
- **Quản lý Bảng xếp hạng (Record Management):** Xem danh sách phân trang, thêm thủ công, sửa thời gian kỷ lục hoặc xóa bỏ các bản ghi không hợp lệ.
- **Công cụ Điều chỉnh Số dư (Admin Give Coins):** Modal điều chỉnh số dư linh hoạt: cộng tùy biến số xu hoặc cấp nhanh 999.999 xu để kiểm thử hệ thống.

### 1.4. Hướng dẫn cách chơi & Thao tác điều khiển
- **Chuột trái / Chạm (Desktop & Mobile):** Mở ô an toàn (lần click đầu tiên luôn an toàn, không bao giờ trúng mìn). Ô trống `0` sẽ tự động lan rộng (flood fill).
- **Chord click:** Click chuột trái / chạm vào **ô số đã mở** khi xung quanh đã cắm đủ số cờ tương ứng để mở nhanh các ô còn lại.
- **Chuột phải / Nhấn giữ (Mobile ~380ms):** Cắm hoặc bỏ cờ đánh dấu vị trí nghi có mìn (trên desktop hỗ trợ thêm phím `F` tại ô đang trỏ).
- **Phím tắt nhanh:** `H` dùng Gợi ý mìn (100 xu), `R` chơi lại ván mới.
- **3 cấp độ mặc định trong CSDL:** Dễ (`9×9 / 10 mìn`), Trung bình (`12×12 / 22 mìn`), Khó (`16×16 / 40 mìn`).

---

## 2. CÔNG NGHỆ VÀ PHIÊN BẢN THỰC TẾ

- **Ngôn ngữ Backend:** PHP `^8.2` (Kiểm thử thực tế: PHP `8.2.12`)
- **Framework:** Laravel Framework `12.70.1`
- **Cơ sở dữ liệu:** MySQL (kết nối qua PDO MySQL, hỗ trợ khóa ngoại cascade và kiểm tra ràng buộc CHECK)
- **Kiểm thử Backend:** PHPUnit `11.5.50` (chạy trên bộ nhớ in-memory SQLite)
- **Môi trường JavaScript:** Node.js `v24.22.1`
- **Frontend & Giao diện:** 
  - Giao diện xây dựng bằng Blade Template, HTML5, CSS3 tùy biến cao cấp (`style.css`, `ui-theme.css`) với hơn 4.500 dòng mã giao diện, hệ thống theme pastel và hiệu ứng đồ họa `ui-motion.js`.
  - *Lưu ý về Asset Pipeline:* Ứng dụng nạp trực tiếp tài nguyên tĩnh từ thư mục `public/minefield/`, **không phụ thuộc** vào Vite build bundling tại thời điểm vận hành.

---

## 3. CẤU TRÚC THƯ MỤC DỰ ÁN

```text
prjMinesweeper/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── MinefieldAdminController.php   # Quản trị CMS, thống kê, user, record, cộng xu
│   │   │   ├── MinefieldAuthController.php    # Xác thực: signup, login, guest, logout
│   │   │   ├── MinefieldGameController.php    # Quản lý phiên ván đấu, xác thực thời gian & DB: start, hint (trừ xu), win, loss, leaderboard
│   │   │   └── MinefieldShopController.php    # Cửa hàng skin: catalog, buy, equip
│   │   └── Middleware/
│   │       ├── EnsureAccountIsActive.php      # Ngăn chặn tài khoản bị khóa thao tác
│   │       └── EnsureActiveGame.php           # Kiểm tra ván game hợp lệ đang chơi
│   ├── Models/
│   │   ├── Difficulty.php, GameMode.php       # Danh mục độ khó và chế độ chơi
│   │   ├── Game.php, Record.php               # Quản lý ván đấu và kỷ lục leaderboard
│   │   └── User.php, UserSkin.php             # Tài khoản người dùng và skin sở hữu
│   └── Services/
│       └── SkinCatalog.php                    # Bảng định nghĩa 14 skin, tính thưởng xu & speed bonus
├── database/
│   ├── migrations/                            # 7 migration CSDL (users, games, records, shop...)
│   └── seeders/
│       ├── AdminUserSeeder.php                # Khởi tạo tài khoản admin bảo mật
│       └── MinefieldSeeder.php                # Nạp 3 chế độ (classic/plus/corner) & 3 độ khó (easy/medium/hard)
├── public/minefield/
│   ├── css/                                   # style.css, ui-theme.css (theme pastel, hiệu ứng hạt bụi)
│   └── js/                                    # engine.js, game.js, api.js, ui.js, ui-motion.js, shop.js, admin.js
├── resources/views/minefield/                 # Blade views: login, modes, game, shop, admin
├── routes/web.php                             # Định tuyến Web và RESTful API
└── tests/
    ├── Feature/                               # MinefieldFlowTest.php, ShopAndCurrencyTest.php
    └── js/engine.test.cjs                     # Kiểm thử thuật toán láng giềng và luật mìn (CommonJS)
```

---

## 4. HƯỚNG DẪN CÀI ĐẶT VÀ KHỞI CHẠY

### 4.1. Khởi chạy với XAMPP (Apache & MySQL)

1. Mở **XAMPP Control Panel**, nhấn **Start** cho hai dịch vụ **Apache** và **MySQL**.
2. Truy cập phpMyAdmin (`http://localhost/phpmyadmin`), tạo mới một cơ sở dữ liệu có tên `minefield` với bảng mã `utf8mb4_unicode_ci`.
3. Kiểm tra tệp `.env` trong thư mục gốc dự án (nếu chưa có, sao chép từ `.env.example`):
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=minefield
   DB_USERNAME=root
   DB_PASSWORD=
   ```
4. Thiết lập mật khẩu cho tài khoản Quản trị viên trong `.env` (bắt buộc dài tối thiểu 12 ký tự):
   ```env
   MINEFIELD_ADMIN_USERNAME=Admin
   MINEFIELD_ADMIN_PASSWORD=MatKhauBaoMatCuaBan123!
   ```
   > **CẢNH BÁO BẢO MẬT:** Tuyệt đối không để lộ giá trị `MINEFIELD_ADMIN_PASSWORD` hoặc tải tệp `.env` lên kho lưu trữ công khai.
5. Mở PowerShell tại thư mục dự án và thực thi lệnh migrate kèm seeder:
   ```powershell
   php artisan migrate --seed
   ```
6. Khởi tạo tài khoản Admin bằng lệnh:
   ```powershell
   php artisan db:seed --class=AdminUserSeeder
   ```
7. Mở trình duyệt và truy cập:
   `http://localhost/prjMinesweeper/public`

---

### 4.2. Khởi chạy bằng máy chủ phát triển nội bộ (`php artisan serve`)

1. Thiết lập trong `.env`:
   ```env
   APP_URL=http://127.0.0.1:8000
   ```
2. Thực thi lệnh khởi chạy máy chủ PHP:
   ```powershell
   php artisan serve
   ```
3. Mở trình duyệt và truy cập:
   `http://127.0.0.1:8000`

### 4.3. Cài đặt dependency & Build Production
```powershell
composer install --no-dev --optimize-autoloader
npm install
npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache
```
- Lệnh `npm run build` thực thi `vite build` và xuất asset đã biên dịch ra thư mục `public/build/`.
- Tài nguyên trò chơi trong `public/minefield/` được nạp thông qua base path động (`request()->getBaseUrl()`), tương thích cả khi chạy ở root domain (`/`) hoặc thư mục con (subpath).

### 4.4. Lưu ý Deploy Production (Laravel + MySQL vs Nền tảng Static)
> **Quan trọng:** Đây là ứng dụng full-stack **Laravel 12 (PHP 8.2) + MySQL/SQLite**, không phải SPA tĩnh thuần.
- **Khuyến nghị Deploy chính thức:** Dùng hạ tầng hỗ trợ PHP 8.2 + MySQL như VPS (Nginx/Apache + PHP-FPM), Hosting cPanel (trỏ DocumentRoot vào `public/`), Railway, Render (Docker PHP) hoặc Laravel Forge/Cloud. Thiết lập `APP_ENV=production`, `APP_DEBUG=false`, `APP_KEY` mới (`php artisan key:generate`) và `APP_URL` trỏ đúng domain HTTPS.
- **Vercel / Netlify / GitHub Pages:**
  - **GitHub Pages** chỉ phục vụ file tĩnh, **không chạy được PHP/Laravel & MySQL**.
  - **Netlify** là nền tảng static/Node functions, không có PHP runtime gốc để chạy trực tiếp toàn bộ ứng dụng Laravel web + DB.
  - **Vercel** chỉ hỗ trợ chạy Laravel thông qua serverless PHP runtime cộng đồng (`vercel-php`) kèm cấu hình `vercel.json` + CSDL MySQL/PostgreSQL external (cloud DB) chứ không hỗ trợ preset Vite static thông thường.

---

## 5. BẢNG DANH MỤC ĐƯỜNG DẪN VÀ API

### 5.1. Giao diện Web (Web Pages)
- `GET /` — Màn hình Đăng nhập / Đăng ký người chơi
- `GET /admin/login` — Cổng Đăng nhập Quản trị viên
- `GET /modes` — Màn hình Lựa chọn Chế độ chơi và Cấp độ khó
- `GET /game` — Màn hình Bàn cờ Dò mìn (Gameplay HUD, Hint button)
- `GET /shop` — Cửa hàng Trang bị Skin Bàn cờ và Lá cờ
- `GET /admin` — Bảng điều khiển Quản trị viên (Minefield Control Room, yêu cầu quyền `admin`)

### 5.2. Quản trị viên (Admin Management APIs)
- `POST /admin/users` — Tạo mới tài khoản người dùng
- `PUT /admin/users/{user}` — Cập nhật thông tin / mật khẩu tài khoản
- `DELETE /admin/users/{user}` — Xóa tài khoản
- `POST /admin/users/{user}/lock` — Khóa / Mở khóa tài khoản
- `POST /admin/users/{user}/give-coins` (kèm alias `infinite-coins`) — Điều chỉnh số dư xu cho tài khoản
- `POST /admin/give-coins` (kèm alias `infinite-coins`) — Điều chỉnh số dư xu cho admin hiện tại
- `POST /admin/records` — Thêm thủ công kỷ lục leaderboard
- `PUT /admin/records/{record}` — Chỉnh sửa kỷ lục leaderboard
- `DELETE /admin/records/{record}` — Xóa kỷ lục leaderboard

### 5.3. Xác thực & Phiên làm việc (Auth APIs)
- `GET /api/session` — Lấy thông tin phiên làm việc hiện tại
- `POST /api/signup` — Đăng ký tài khoản (giới hạn `throttle:10,1`)
- `POST /api/login` — Đăng nhập người chơi (giới hạn `throttle:10,1`)
- `POST /api/admin/login` — Đăng nhập quản trị viên (giới hạn `throttle:10,1`)
- `POST /api/guest` — Khởi tạo phiên chơi vãng lai
- `POST /api/logout` — Đăng xuất phiên làm việc

### 5.4. Phiên chơi Game, Thành tích & Leaderboard APIs
> *Kiến trúc phân tách hiệu năng cao:* Toàn bộ logic bàn cờ (sinh mìn an toàn, mở ô, flood-fill, cắm cờ, chording, tìm gợi ý frontier) chạy trực tiếp bằng JavaScript (`public/minefield/js/engine.js` & `game.js`) với độ trễ **0ms**. Backend Laravel tập trung xử lý cơ sở dữ liệu, xác thực phiên chơi, kiểm tra anti-cheat thời gian, giao dịch xu và bảng xếp hạng.
- `POST /api/games` — Bắt đầu ván đấu mới, cấp UUID token và lưu mốc `started_at`
- `POST /api/games/{token}/hint` — Xác thực & trừ 100 xu trong DB cho mỗi lần dùng gợi ý mìn
- `POST /api/games/{token}/win` — Kiểm tra thời gian (ngưỡng sai số `2.500 ms`), ghi nhận kết quả thắng, cộng xu thưởng + speed bonus và cập nhật leaderboard
- `POST /api/games/{token}/loss` — Ghi nhận kết thúc thua ván vào CSDL
- `GET /api/leaderboard` — Lấy danh sách bảng xếp hạng theo chế độ & độ khó
- `GET /api/best-time` — Lấy thành tích tốt nhất của người dùng/chế độ hiện tại

### 5.5. Cửa hàng Skin APIs
- `GET /api/shop` — Lấy danh mục 14 skin và số dư xu người chơi
- `POST /api/shop/buy` — Mua skin bằng xu ảo (xử lý `DB::transaction`)
- `POST /api/shop/equip` — Trang bị skin đã sở hữu

---

## 6. HƯỚNG DẪN CHẠY KIỂM THỬ (TESTING)

### 6.1. Kiểm thử Backend Laravel (PHPUnit)
Chạy toàn bộ 40 bài kiểm thử chức năng tự động (chạy trên bộ nhớ in-memory SQLite):
```powershell
php artisan test
```
*Kết quả xác thực:* **40 passed (259 assertions)**. Bao phủ toàn diện render giao diện, phân quyền, đăng nhập chống brute-force, quản trị tài khoản, ghi nhận thắng/thua trong CSDL, chống gian lận Timer (`TIME_TOLERANCE_MS = 2500`, `MIN_PLAUSIBLE_TIME_MS = 200`, chống replay token, chống IDOR và giả mạo độ khó), xác thực trừ xu khi hint, kinh tế xu, thưởng tốc độ và giao dịch mua/trang bị skin.

### 6.2. Kiểm thử Thuật toán Engine Client (JavaScript Unit Test)
Chạy bộ kiểm thử 25 test case độc lập DOM cho thuật toán láng giềng, luật mìn, khóa trạng thái và Hint:
```powershell
node tests/js/engine.test.cjs
```
> **Lưu ý:** Tệp kiểm thử JavaScript được định dạng theo chuẩn CommonJS (`.cjs`). Sử dụng lệnh `node tests/js/engine.test.cjs` để thực thi trực tiếp bằng Node.js.  
*Kết quả xác thực:* **25 tests passed** (Neighbors: 3, Mine placement: 10, Flood-fill: 2, Flags & chord: 3, Win/lose: 3, Hint: 2, Edge cases & state locks: 2).

---

## 7. GIỚI HẠN VÀ LƯU Ý PHẠM VI DỰ ÁN

- **Không hỗ trợ chơi nhiều người thời gian thực (Multiplayer/Co-op):** Dự án tập trung tối ưu trải nghiệm chơi đơn (Single Player) chất lượng cao và cạnh tranh thành tích gián tiếp qua Bảng xếp hạng.
- **Không tích hợp thanh toán tiền thật:** Toàn bộ hệ thống giao dịch sử dụng cơ chế **Xu ảo (Coins)** tự kiếm qua kỹ năng chiến thắng trong game.
- **Thuật toán Bot & Hint:** Thay vì xây dựng Bot Minimax tự chơi (vốn không phù hợp với bản chất game thông tin không hoàn hảo), nhóm đã triển khai **Hệ thống Gợi ý mìn thông minh (Hint System)** kết hợp tìm mìn vùng biên ở client (`engine.js`) và xác thực trừ xu an toàn phía máy chủ Laravel.
