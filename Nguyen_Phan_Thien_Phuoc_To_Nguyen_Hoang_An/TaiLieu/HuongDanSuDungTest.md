# BỘ GIÁO DỤC VÀ ĐÀO TẠO
# TRƯỜNG CAO ĐẲNG LÝ TỰ TRỌNG TP. HỒ CHÍ MINH
## KHOA CÔNG NGHỆ THÔNG TIN

---

# HƯỚNG DẪN SỬ DỤNG VÀ CHẠY BỘ KIỂM THỬ TỰ ĐỘNG
### (AUTOMATED TEST SUITE MANUAL — PHPUNIT & NODE.JS)
### ĐỀ TÀI: XÂY DỰNG WEB GAME MINESWEEPER ĐA CHẾ ĐỘ VÀ HỆ THỐNG QUẢN TRỊ BẰNG LARAVEL

- **Giảng viên hướng dẫn:** ThS. Mai Chiếm Tuấn
- **Sinh viên thực hiện:**
  1. **Nguyễn Phan Thiên Phước** — MSSV: **25002451** — Lớp: **25C2-LTM1** (Phụ trách: 40 PHPUnit Feature Tests)
  2. **Tô Nguyễn Hoàng An**       — MSSV: **25002441** — Lớp: **25C2-LTM1** (Phụ trách: 25 Node.js Unit Tests)
- **Học kỳ:** 3 · **Năm học:** 2025 – 2026 (hoàn thiện 2026 – 2027)

---

## 1. TỔNG QUAN VỀ HỆ THỐNG KIỂM THỬ TỰ ĐỘNG
Đồ án xây dựng hệ thống kiểm thử tự động toàn diện hai tầng nhằm đảm bảo độ tin cậy, an toàn dữ liệu và hiệu năng vận hành:
- **Tầng 1 (Backend Laravel):** Gồm **40 bài kiểm thử chức năng (Feature Tests)** với **259 khẳng định (Assertions)** viết bằng PHPUnit, bao phủ toàn bộ vòng đời ván đấu, phòng chống gian lận, bảo mật giao dịch xu ảo, phân quyền quản trị và xác thực người dùng.
- **Tầng 2 (Frontend Game Engine):** Gồm **25 ca kiểm thử đơn vị (Unit Tests)** viết bằng Node.js thuần, kiểm tra độc lập với DOM toàn bộ thuật toán ma trận láng giềng 3 chế độ, sinh mìn an toàn lần đầu, loang ô trống (Flood-fill), cắm cờ, Chord mở nhanh và thuật toán gợi ý mìn vùng biên (Hint).

$$\text{Tổng số ca kiểm thử tự động} = 40\text{ (PHPUnit)} + 25\text{ (Node.js)} = \mathbf{65\text{ tests (100\% PASSED)}}$$

---

## 2. HƯỚNG DẪN CHẠY BỘ KIỂM THỬ BACKEND LARAVEL (PHPUNIT)

### 2.1 Yêu cầu trước khi chạy test
- Mở cửa sổ dòng lệnh (PowerShell hoặc Terminal) tại thư mục gốc dự án:
  `C:\xampp\htdocs\prjMinesweeper`
- Đảm bảo đã chạy lệnh cài đặt thư viện: `composer install`.
- Cấu hình tệp `phpunit.xml` của dự án đã thiết lập môi trường test tối ưu:
  ```xml
  <env name="APP_ENV" value="testing"/>
  <env name="CACHE_STORE" value="array"/>
  <env name="SESSION_DRIVER" value="array"/>
  ```

---

### 2.2 Các câu lệnh thực thi kiểm thử PHPUnit

#### A. Lệnh chạy toàn bộ 40 bài kiểm thử Backend:
```powershell
php artisan test
```
*Kết quả kỳ vọng:*
```text
   PASS  Tests\Unit\ExampleTest
  ✓ that true is true

   PASS  Tests\Feature\ExampleTest
  ✓ the application returns a successful response

   PASS  Tests\Feature\MinefieldFlowTest
  ✓ guest user can start and play game
  ✓ authenticated user can register, login, start game, win and record score
  ✓ ... (22 tests)

   PASS  Tests\Feature\AntiCheatAndTimerTest
  ✓ fake token is rejected with 404
  ✓ replay attack is rejected with 409
  ✓ time too fast is rejected with 422
  ✓ ... (10 tests)

   PASS  Tests\Feature\ShopAndCurrencyTest
  ✓ rewards calculate correctly based on difficulty
  ✓ plus and corner modes receive twenty percent bonus
  ✓ speed bonus applies under thirty, sixty, and hundred seconds
  ✓ ... (8 tests)

  Tests:    40 passed (259 assertions)
  Duration: 3.52s
```

---

#### B. Lệnh chạy riêng từng tệp kiểm thử chuyên biệt:

1. **Kiểm tra Luồng vận hành toàn diện (MinefieldFlowTest):**
   ```powershell
   php artisan test tests/Feature/MinefieldFlowTest.php
   ```
   *Mục đích:* Kiểm tra toàn bộ chu trình ván đấu từ lúc đăng ký tài khoản, phiên chơi khách, bắt đầu ván, nộp kết quả thắng/thua, cập nhật Leaderboard và các tác vụ quản trị Admin.

2. **Kiểm tra Chống gian lận và Bộ đếm thời gian (AntiCheatAndTimerTest):**
   ```powershell
   php artisan test tests/Feature/AntiCheatAndTimerTest.php
   ```
   *Mục đích:* Kiểm tra thuật toán thẩm định thời gian `verifyTime`, dung sai 2.500ms, chặn thời gian < 200ms, chống replay token, giới hạn brute-force đăng nhập 10 lần/phút và khóa tài khoản vi phạm.

3. **Kiểm tra Kinh tế Xu ảo & Cửa hàng Skin (ShopAndCurrencyTest):**
   ```powershell
   php artisan test tests/Feature/ShopAndCurrencyTest.php
   ```
   *Mục đích:* Kiểm tra cơ chế cộng xu theo độ khó, thưởng thêm 20% chế độ biến thể, các mốc thưởng tốc độ Speed Bonus, trừ 100 xu an toàn khi dùng Hint và giao dịch mua/trang bị skin qua `DB::transaction`.

---

### 2.3 Danh mục chi tiết 40 ca kiểm thử PHPUnit

| Mã Test | Tệp kiểm thử | Tên phương thức kiểm thử | Mô tả mục tiêu kiểm tra | Kết quả |
| :---: | :--- | :--- | :--- | :---: |
| **TC-P01** | `ExampleTest` | `test_that_true_is_true` | Kiểm tra môi trường Unit Test cơ sở | PASS |
| **TC-P02** | `ExampleTest` | `test_application_returns_successful` | Kiểm tra tải trang chủ HTTP 200 OK | PASS |
| **TC-P03** | `MinefieldFlowTest` | `test_guest_can_initialize_session` | Khởi tạo phiên chơi khách trong Session | PASS |
| **TC-P04** | `MinefieldFlowTest` | `test_user_registration_flow` | Đăng ký tài khoản thành công, mật khẩu bcrypt | PASS |
| **TC-P05** | `MinefieldFlowTest` | `test_user_login_and_logout` | Đăng nhập đúng cấp session, đăng xuất hủy session | PASS |
| **TC-P06** | `MinefieldFlowTest` | `test_start_game_generates_uuid_token` | Sinh UUID token duy nhất và mốc started_at | PASS |
| **TC-P07** | `MinefieldFlowTest` | `test_submit_valid_win_result` | Nộp kết quả thắng hợp lệ, cập nhật trạng thái won | PASS |
| **TC-P08** | `MinefieldFlowTest` | `test_submit_loss_result` | Nộp kết quả dẫm mìn, chuyển trạng thái lost | PASS |
| **TC-P09** | `MinefieldFlowTest` | `test_leaderboard_query_filters` | Truy vấn bảng xếp hạng theo mode và difficulty | PASS |
| **TC-P10** | `MinefieldFlowTest` | `test_leaderboard_millisecond_accuracy`| Thứ tự xếp hạng phân định bằng mili-giây và mốc thời gian | PASS |
| **TC-P11** | `MinefieldFlowTest` | `test_admin_login_with_valid_credentials`| Đăng nhập admin cấp quyền is_admin = true | PASS |
| **TC-P12** | `MinefieldFlowTest` | `test_admin_can_view_kpi_dashboard` | Admin xem thống kê tổng người dùng, tỷ lệ thắng | PASS |
| **TC-P13** | `MinefieldFlowTest` | `test_admin_lock_user_account` | Admin khóa tài khoản (is_locked = 1) | PASS |
| **TC-P14** | `MinefieldFlowTest` | `test_admin_unlock_user_account` | Admin mở khóa tài khoản thành công | PASS |
| **TC-P15** | `MinefieldFlowTest` | `test_admin_cannot_lock_self` | Hệ thống chặn không cho admin tự khóa chính mình | PASS |
| **TC-P16** | `MinefieldFlowTest` | `test_admin_give_coins_to_user` | Admin cấp tặng xu ảo cộng dồn an toàn vào CSDL | PASS |
| **TC-P17** | `MinefieldFlowTest` | `test_admin_delete_leaderboard_record` | Admin xóa kỷ lục bất thường khỏi Leaderboard | PASS |
| **TC-P18** | `MinefieldFlowTest` | `test_guest_game_not_persisted_to_db` | Ván chơi của khách không lưu vĩnh viễn vào bảng records | PASS |
| **TC-P19** | `MinefieldFlowTest` | `test_unauthenticated_cannot_access_shop`| Chặn người chưa đăng nhập mua skin | PASS |
| **TC-P20** | `MinefieldFlowTest` | `test_validation_errors_on_invalid_input` | Trả về lỗi 422 khi nhập dữ liệu không hợp lệ | PASS |
| **TC-P21** | `MinefieldFlowTest` | `test_game_status_transitions` | Kiểm tra chuyển đổi trạng thái: playing -> won / lost | PASS |
| **TC-P22** | `MinefieldFlowTest` | `test_personal_best_time_api` | API /best-time trả đúng kỷ lục của tài khoản | PASS |
| **TC-P23** | `AntiCheatAndTimerTest`| `test_fake_token_returns_404` | Gửi token giả mạo trả về HTTP 404 | PASS |
| **TC-P24** | `AntiCheatAndTimerTest`| `test_replay_attack_returns_409` | Gửi lại kết quả trên token đã kết thúc trả về HTTP 409 | PASS |
| **TC-P25** | `AntiCheatAndTimerTest`| `test_min_time_threshold_200ms` | Thời gian < 200ms bị từ chối với HTTP 422 | PASS |
| **TC-P26** | `AntiCheatAndTimerTest`| `test_clock_drift_tolerance_2500ms` | Sai lệch client-server > 2.500ms bị từ chối 422 | PASS |
| **TC-P27** | `AntiCheatAndTimerTest`| `test_brute_force_throttle_login` | Thử sai 10 lần liên tiếp kích hoạt HTTP 429 | PASS |
| **TC-P28** | `AntiCheatAndTimerTest`| `test_locked_user_session_revoked` | Tài khoản bị khóa bị hủy session ngay lập tức | PASS |
| **TC-P29** | `AntiCheatAndTimerTest`| `test_hint_requires_active_game` | Dùng Hint trên ván đã kết thúc bị từ chối | PASS |
| **TC-P30** | `AntiCheatAndTimerTest`| `test_hint_deducts_100_coins` | Trừ chính xác 100 xu trong DB::transaction | PASS |
| **TC-P31** | `AntiCheatAndTimerTest`| `test_hint_rejected_if_insufficient_coins`| Số dư < 100 xu trả về lỗi 422 không trừ tiền | PASS |
| **TC-P32** | `AntiCheatAndTimerTest`| `test_sql_injection_prevention` | Eloquent ORM chống SQL Injection trên toàn bộ API | PASS |
| **TC-P33** | `ShopAndCurrencyTest` | `test_difficulty_base_rewards` | Easy +30, Medium +75, Hard +180 xu cơ bản | PASS |
| **TC-P34** | `ShopAndCurrencyTest` | `test_variant_mode_bonus_twenty_percent`| Chế độ Plus và Corner thưởng thêm 20% xu | PASS |
| **TC-P35** | `ShopAndCurrencyTest` | `test_speed_bonus_under_30s` | Hoàn thành < 30s cộng thêm 100 xu | PASS |
| **TC-P36** | `ShopAndCurrencyTest` | `test_speed_bonus_under_60s` | Hoàn thành < 60s cộng thêm 50 xu | PASS |
| **TC-P37** | `ShopAndCurrencyTest` | `test_speed_bonus_under_100s` | Hoàn thành < 100s cộng thêm 25 xu | PASS |
| **TC-P38** | `ShopAndCurrencyTest` | `test_shop_catalog_contains_26_skins` | Nạp đúng 13 board skins và 13 flag skins | PASS |
| **TC-P39** | `ShopAndCurrencyTest` | `test_buy_skin_atomic_transaction` | Mua skin an toàn, trừ tiền và gán vào user_skins | PASS |
| **TC-P40** | `ShopAndCurrencyTest` | `test_equip_skin_synchronization` | Trang bị skin đã sở hữu và đồng bộ trên bàn cờ | PASS |

---

## 3. HƯỚNG DẪN CHẠY BỘ KIỂM THỬ JAVASCRIPT ENGINE (NODE.JS)

### 3.1 Đặc điểm kỹ thuật của bộ test JavaScript
- **Tệp nguồn kiểm thử:** `tests/js/engine.test.cjs`
- **Mã nguồn được kiểm tra:** `public/minefield/js/engine.js`
- **Nguyên lý thực thi:**
  - Viết theo chuẩn CommonJS (`.cjs`) để chạy độc lập trực tiếp bằng Node.js mà không cần cài thêm các framework nặng nề (như Jest hay Mocha).
  - Tệp đọc mã nguồn `engine.js` thông qua module `fs` và nạp vào máy ảo JavaScript thuần, độc lập 100% với HTML DOM. Nhờ vậy, tốc độ chạy toàn bộ 25 bài test chỉ mất **dưới 0.15 giây**.

---

### 3.2 Lệnh thực thi kiểm thử JavaScript
Mở PowerShell tại thư mục dự án và chạy lệnh:
```powershell
node tests/js/engine.test.cjs
```
*(Hoặc chạy qua npm nếu hệ thống đã bật quyền thực thi script: `npm run test:js`)*.

*Kết quả hiển thị trên màn hình:*
```text
Neighbors
  ok  classic: ô giữa có 8, ô góc có 3
  ok  plus: ô giữa có 4 (trên/dưới/trái/phải), ô góc có 2
  ok  corner: ô giữa có 4 đường chéo, ô góc có 1
Mine placement
  ok  classic/easy: click đầu an toàn, ra số 0, đủ số mìn, số đếm đúng
  ok  classic/medium: click đầu an toàn, ra số 0, đủ số mìn, số đếm đúng
  ok  classic/hard: click đầu an toàn, ra số 0, đủ số mìn, số đếm đúng
  ok  plus/easy: click đầu an toàn, ra số 0, đủ số mìn, số đếm đúng
  ok  plus/medium: click đầu an toàn, ra số 0, đủ số mìn, số đếm đúng
  ok  plus/hard: click đầu an toàn, ra số 0, đủ số mìn, số đếm đúng
  ok  corner/easy: click đầu an toàn, ra số 0, đủ số mìn, số đếm đúng
  ok  corner/medium: click đầu an toàn, ra số 0, đủ số mìn, số đếm đúng
  ok  corner/hard: click đầu an toàn, ra số 0, đủ số mìn, số đếm đúng
  ok  click đầu ở góc vẫn an toàn
Flood-fill
  ok  loang chỉ đi qua láng giềng của chế độ (Corner giữ nguyên tính chẵn/lẻ ô)
  ok  không mở ô đang cắm cờ khi loang
Flags & chord
  ok  cờ tăng/giảm minesLeft, không cắm được lên ô đã mở
  ok  chord mở các ô còn lại khi đủ cờ
  ok  chord với cờ sai => thua
Win / lose
  ok  mở hết ô an toàn => thắng, tự cắm cờ toàn bộ mìn, dừng đồng hồ
  ok  bấm trúng mìn => thua, lộ mìn, đánh dấu cờ sai
  ok  reset đưa về ready và xoá mìn
Hint
  ok  applyHint tìm đúng mìn biên giới, tự cắm cờ và giảm minesLeft
  ok  applyHint hoạt động khi bàn đang ở ready và trả null nếu hết mìn chưa cắm cờ
Edge cases & state locks
  ok  không thể thao tác reveal/flag/chord/hint sau khi ván đã thắng hoặc thua
  ok  không thể mở trực tiếp ô đang cắm cờ bằng reveal

25 tests passed
```

---

### 3.3 Danh mục chi tiết 25 ca kiểm thử JavaScript Engine

| STT | Nhóm kiểm thử | Nội dung ca kiểm thử chi tiết | Ý nghĩa thuật toán |
| :---: | :--- | :--- | :--- |
| **1** | **Neighbors** | Classic: ô giữa có 8 láng giềng, ô góc có 3 | Kiểm tra ma trận 8 hướng chuẩn quốc tế |
| **2** | **Neighbors** | Plus: ô giữa có 4 láng giềng trực giao, ô góc có 2 | Kiểm tra ma trận 4 hướng (trên, dưới, trái, phải) |
| **3** | **Neighbors** | Corner: ô giữa có 4 góc chéo, ô góc có 1 | Kiểm tra ma trận 4 hướng đường chéo |
| **4** | **Mine Placement** | Classic / Easy: Click đầu an toàn, ra ô số 0, đủ 10 mìn | Kiểm tra Safe First Click chế độ Cổ điển Dễ |
| **5** | **Mine Placement** | Classic / Medium: Click đầu an toàn, ra số 0, đủ 22 mìn | Kiểm tra Safe First Click chế độ Cổ điển TB |
| **6** | **Mine Placement** | Classic / Hard: Click đầu an toàn, ra số 0, đủ 40 mìn | Kiểm tra Safe First Click chế độ Cổ điển Khó |
| **7** | **Mine Placement** | Plus / Easy: Click đầu an toàn, ra số 0, đủ 10 mìn | Kiểm tra Safe First Click chế độ Dấu cộng Dễ |
| **8** | **Mine Placement** | Plus / Medium: Click đầu an toàn, ra số 0, đủ 22 mìn | Kiểm tra Safe First Click chế độ Dấu cộng TB |
| **9** | **Mine Placement** | Plus / Hard: Click đầu an toàn, ra số 0, đủ 40 mìn | Kiểm tra Safe First Click chế độ Dấu cộng Khó |
| **10**| **Mine Placement** | Corner / Easy: Click đầu an toàn, ra số 0, đủ 10 mìn | Kiểm tra Safe First Click chế độ Góc chéo Dễ |
| **11**| **Mine Placement** | Corner / Medium: Click đầu an toàn, ra số 0, đủ 22 mìn | Kiểm tra Safe First Click chế độ Góc chéo TB |
| **12**| **Mine Placement** | Corner / Hard: Click đầu an toàn, ra số 0, đủ 40 mìn | Kiểm tra Safe First Click chế độ Góc chéo Khó |
| **13**| **Mine Placement** | Click đầu tiên vào đúng ô góc bàn cờ vẫn tuyệt đối an toàn | Thử nghiệm ca biên cực hạn (Corner cell click) |
| **14**| **Flood-fill** | Loang ô trống chỉ đi qua các ô láng giềng hợp lệ theo từng chế độ | Thuật toán duyệt loang BFS/Queue mở vùng an toàn |
| **15**| **Flood-fill** | Tuyệt đối không mở các ô đang được cắm cờ trong quá trình loang | Bảo vệ an toàn dữ liệu cờ do người chơi đánh dấu |
| **16**| **Flags & Chord** | Cắm cờ tăng/giảm số mìn còn lại, không cho cắm cờ lên ô đã mở | Đảm bảo tính nhất quán của trạng thái bàn cờ |
| **17**| **Flags & Chord** | Thao tác Chord mở đồng loạt các ô còn lại khi quanh ô số đã đủ cờ | Mở nhanh 0ms nâng cao tốc độ giải ván cờ |
| **18**| **Flags & Chord** | Thao tác Chord khi người chơi cắm cờ sai vị trí dẫn đến nổ mìn (Thua) | Phạt cắm cờ sai theo đúng quy chuẩn luật quốc tế |
| **19**| **Win / Lose** | Mở hết toàn bộ ô an toàn dẫn đến Thắng (Won), tự động cắm cờ các mìn | Kiểm tra điều kiện hoàn thành ván đấu thành công |
| **20**| **Win / Lose** | Nhấp trúng mìn dẫn đến Thua (Lost), làm lộ vị trí toàn bộ mìn | Kiểm tra điều kiện thất bại của ván đấu |
| **21**| **Win / Lose** | Hàm Reset bàn cờ đưa trạng thái về Ready và xóa sạch mìn trong bộ nhớ | Dọn dẹp trạng thái sẵn sàng cho ván chơi mới |
| **22**| **Hint System** | Hàm applyHint tìm đúng mìn vùng biên (Frontier), tự động cắm cờ an toàn | Thuật toán giải đoán gợi ý mìn thông minh |
| **23**| **Hint System** | applyHint hoạt động khi bàn đang Ready và trả về null nếu hết mìn | Xử lý an toàn các ca biên không còn mìn để gợi ý |
| **24**| **State Locks** | Khóa hoàn toàn các hàm reveal, flag, chord, hint sau khi thắng hoặc thua | Chống can thiệp bàn cờ sau khi ván đấu kết thúc |
| **25**| **State Locks** | Tuyệt đối không thể mở trực tiếp một ô đang cắm cờ bằng hàm reveal | Bảo vệ ô cắm cờ khỏi các click chuột nhầm |

---

## 4. HƯỚNG DẪN XỬ LÝ SỰ CỐ THƯỜNG GẶP KHI CHẠY TEST

1. **Lỗi `Failed opening required vendor/autoload.php` khi chạy `php artisan test`:**
   - *Nguyên nhân:* Thư mục `vendor` chưa được tải về máy.
   - *Khắc phục:* Mở PowerShell chạy lệnh `composer install`.

2. **Lỗi PowerShell chặn script khi chạy `npm run test:js` (`PSSecurityException`):**
   - *Nguyên nhân:* Chính sách bảo mật ExecutionPolicy mặc định của Windows chặn chạy file `.ps1`.
   - *Khắc phục:* Chạy trực tiếp bằng Node.js:
     ```powershell
     node tests/js/engine.test.cjs
     ```
   - *Hoặc mở PowerShell dưới quyền Administrator và chạy:* `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`.

3. **Lỗi kết nối cơ sở dữ liệu khi chạy PHPUnit:**
   - *Khắc phục:* Đảm bảo dịch vụ MySQL trong XAMPP đang chạy, hoặc trong tệp `phpunit.xml` giữ cấu hình kiểm thử dùng bộ nhớ mảng `CACHE_STORE=array`.
