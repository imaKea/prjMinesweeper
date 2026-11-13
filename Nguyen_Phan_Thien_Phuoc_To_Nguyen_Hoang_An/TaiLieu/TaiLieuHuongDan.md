# BỘ GIÁO DỤC VÀ ĐÀO TẠO
# TRƯỜNG CAO ĐẲNG LÝ TỰ TRỌNG TP. HỒ CHÍ MINH
## KHOA CÔNG NGHỆ THÔNG TIN

---

# TÀI LIỆU HƯỚNG DẪN SỬ DỤNG VÀ GIẢI THÍCH HỆ THỐNG
### ĐỀ TÀI: XÂY DỰNG WEB GAME MINESWEEPER ĐA CHẾ ĐỘ VÀ HỆ THỐNG QUẢN TRỊ BẰNG LARAVEL

- **Giảng viên hướng dẫn:** ThS. Mai Chiếm Tuấn
- **Sinh viên thực hiện:**
  1. **Nguyễn Phan Thiên Phước** — MSSV: **25002451** — Lớp: **25C2-LTM1** (Phụ trách: Backend Laravel & Deploy Cloud)
  2. **Tô Nguyễn Hoàng An**       — MSSV: **25002441** — Lớp: **25C2-LTM1** (Phụ trách: Frontend JS Engine, UI/UX & Testing)
- **Học kỳ:** 3 · **Năm học:** 2025 – 2026 (hoàn thiện 2026 – 2027)

---

## MỤC LỤC TỔNG QUAN

1. [PHẦN 1: HƯỚNG DẪN SỬ DỤNG DÀNH CHO NGƯỜI CHƠI (USER MANUAL)](#phan-1-huong-dan-su-dung-danh-cho-nguoi-choi-user-manual)
   - 1.1 Đăng ký, Đăng nhập và Chơi thử Khách (Guest)
   - 1.2 Lựa chọn 3 Chế độ chơi & 3 Cấp độ khó
   - 1.3 Hướng dẫn thao tác chơi game trên Máy tính (PC / Laptop)
   - 1.4 Hướng dẫn thao tác chơi game trên Di động & Tablet (Màn hình cảm ứng)
   - 1.5 Tính năng Gợi ý mìn thông minh (Hint System – 100 Xu)
   - 1.6 Hệ thống Xu thưởng và Thưởng tốc độ (Speed Bonus)
   - 1.7 Hướng dẫn Cửa hàng Skin & Phòng Thử Chiến Thuật 5×5
   - 1.8 Xem Bảng xếp hạng Kỷ lục (Leaderboard)
2. [PHẦN 2: HƯỚNG DẪN SỬ DỤNG DÀNH CHO QUẢN TRỊ VIÊN (ADMIN CMS MANUAL)](#phan-2-huong-dan-su-dung-danh-cho-quan-tri-vien-admin-cms-manual)
   - 2.1 Cổng đăng nhập Quản trị viên (/admin/login)
   - 2.2 Bảng điều khiển Trung tâm (Dashboard Thống kê)
   - 2.3 Quản lý Người dùng: Khóa / Mở khóa và Cấp tặng xu ảo (Give Coins)
   - 2.4 Quản lý Ván đấu và Tra cứu Kỷ lục Leaderboard
3. [PHẦN 3: HƯỚNG DẪN CÀI ĐẶT & TRIỂN KHAI HỆ THỐNG](#phan-3-huong-dan-cai-dat--trien-khai-he-thong)
   - 3.1 Yêu cầu môi trường vận hành
   - 3.2 Hướng dẫn cài đặt trên môi trường Local (XAMPP / PHP 8.2 / MySQL)
   - 3.3 Hướng dẫn triển khai Cloud (Docker / Render / TiDB Cloud)
   - 3.4 Quy trình chạy kiểm thử tự động (40 PHPUnit + 25 Node.js Tests)
4. [PHẦN 4: GIẢI THÍCH KIẾN TRÚC MÃ NGUỒN & CƠ CHẾ KỸ THUẬT](#phan-4-giai-thich-kien-truc-ma-nguon--co-che-ky-thuat)
   - 4.1 Mô hình tách biệt Client Engine (0ms) – Server Authority
   - 4.2 Thuật toán Safe First Click & Loang ô trống (Flood-fill)
   - 4.3 Thuật toán Láng giềng 3 Chế độ (Cổ điển, Dấu cộng, Góc chéo)
   - 4.4 Thuật toán Gợi ý mìn vùng biên (Frontier Hint) & Giao dịch DB::transaction
   - 4.5 Cơ chế chống gian lận thời gian mili-giây (verifyTime & UUID Token)
   - 4.6 Danh mục RESTful API endpoints
5. [PHẦN 5: BỘ CÂU HỎI VÀ TRẢ LỜI PHẢN BIỆN (Q&A CHO BUỔI BẢO VỆ)](#phan-5-bo-cau-hoi-va-tra-loi-phan-bien-qa-cho-buoi-bao-ve)

---

<a name="phan-1-huong-dan-su-dung-danh-cho-nguoi-choi-user-manual"></a>
## PHẦN 1: HƯỚNG DẪN SỬ DỤNG DÀNH CHO NGƯỜI CHƠI (USER MANUAL)

### 1.1 Đăng ký, Đăng nhập và Chơi thử Khách (Guest)
- **Truy cập ứng dụng:** Mở trình duyệt web và truy cập địa chỉ trang chủ `/`.
- **Đăng ký tài khoản mới (Sign Up):**
  1. Nhấp chọn tab **Sign Up** trên màn hình chính.
  2. Điền đầy đủ các thông tin: **Tên hiển thị (Name)**, **Email**, **Mật khẩu (Password)** và **Xác nhận mật khẩu (Confirm Password)**.
  3. Bấm **Create Account**. Hệ thống sẽ tự động đăng nhập và chuyển hướng sang màn hình chọn chế độ.
  4. *Lưu ý bảo mật:* Hệ thống áp dụng băm mật khẩu `bcrypt` và chống brute-force giới hạn tối đa 10 lượt gửi/phút (`throttle:10,1`).
- **Đăng nhập (Login):**
  1. Nhấp chọn tab **Login**.
  2. Nhập Email và Mật khẩu đã đăng ký, bấm **Login**.
- **Chơi thử ngay dạng Khách (Play as Guest):**
  1. Nếu chưa muốn tạo tài khoản, người chơi bấm nút **Play as Guest** ngay trên giao diện đăng nhập.
  2. Hệ thống sẽ khởi tạo phiên làm việc khách tạm thời trong Session (`minefield.guest = true`).
  3. Khách được trải nghiệm đầy đủ 9 biến thể game, sử dụng tính năng Gợi ý mìn Hint và xem Bảng xếp hạng. Tuy nhiên, thành tích kỷ lục và trang phục skin sẽ không được lưu trữ vĩnh viễn vào cơ sở dữ liệu nếu không đăng ký tài khoản.

---

### 1.2 Lựa chọn 3 Chế độ chơi & 3 Cấp độ khó
Sau khi đăng nhập hoặc chọn Chơi khách, người chơi được chuyển đến màn hình **Select Game Mode** (`/modes`):

#### A. Ba chế độ chơi (Game Modes):
1. **Classic (Cổ điển):**
   - Luật chơi truyền thống: Mỗi ô số hiển thị tổng số mìn nằm trong **8 ô xung quanh** (gồm 4 ô cạnh và 4 ô góc).
2. **Plus (Dấu cộng):**
   - Biến thể hình chữ thập: Mỗi ô số chỉ đếm số mìn nằm trong **4 ô kề cạnh trực tiếp** (Trên, Dưới, Trái, Phải). Bỏ qua hoàn toàn 4 góc chéo.
   - Khi chiến thắng chế độ này, người chơi nhận thêm **+20% Xu thưởng**.
3. **Corner (Góc chéo):**
   - Biến thể góc chéo: Mỗi ô số chỉ đếm số mìn nằm trong **4 ô đường chéo** (Trên-Trái, Trên-Phải, Dưới-Trái, Dưới-Phải). Bỏ qua 4 ô kề cạnh.
   - Thử thách suy luận thị giác độc đáo, thưởng thêm **+20% Xu thưởng** khi thắng.

#### B. Ba cấp độ khó (Difficulties):
| Cấp độ | Kích thước lưới | Tổng số mìn | Tỷ lệ mìn | Xu thưởng cơ bản |
| :--- | :---: | :---: | :---: | :---: |
| **Easy (Dễ)** | 9 × 9 | 10 mìn | 12.3% | **+30 Xu** |
| **Medium (Trung bình)** | 12 × 12 | 22 mìn | 15.3% | **+75 Xu** |
| **Hard (Khó)** | 16 × 16 | 40 mìn | 15.6% | **+180 Xu** |

*Người chơi chọn cặp Chế độ + Độ khó mong muốn, sau đó bấm nút **Start Game** để vào bàn chơi.*

---

### 1.3 Hướng dẫn thao tác chơi game trên Máy tính (PC / Laptop)

| Thao tác | Hành động của người chơi | Mô tả chi tiết & Phản hồi hệ thống |
| :--- | :--- | :--- |
| **Mở ô an toàn** | **Nhấp chuột trái** vào ô chưa mở | Mở ô. Cơ chế **Safe First Click** đảm bảo lần nhấp đầu tiên luôn luôn an toàn và tự động sinh ra ô số 0 để kích hoạt loang mở rộng (Flood-fill). |
| **Cắm cờ / Gỡ cờ** | **Nhấp chuột phải** vào ô chưa mở | Đánh dấu cờ (Flag) vào vị trí bạn nghi ngờ có mìn để chống bấm nhầm. Nhấp chuột phải lần nữa để gỡ cờ. Số mìn còn lại trên thanh trạng thái sẽ giảm đi tương ứng. |
| **Chord (Mở nhanh cả cụm)** | **Nhấp đúp chuột trái** HOẶC **Nhấp đồng thời chuột trái + chuột phải** vào ô số đã mở | Khi bạn đã cắm đủ số cờ quanh một ô số (ví dụ ô số 2 đã có đủ 2 lá cờ xung quanh), thao tác Chord sẽ **mở đồng loạt toàn bộ các ô còn lại** xung quanh ô đó ngay tức khắc (0ms). *(Cảnh báo: Nếu bạn cắm cờ sai vị trí, thao tác Chord sẽ kích nổ mìn ngay lập tức!)* |
| **Dùng Gợi ý mìn (Hint)** | Bấm nút **Hint** trên thanh công cụ hoặc bấm phím **H** | Tự động quét và cắm cờ vào 1 ô mìn vùng biên, trừ 100 xu ảo. |
| **Chơi lại ván mới** | Nhấp vào biểu tượng cảm xúc (Smiley Face) ở giữa thanh trạng thái | Bắt đầu lại ván chơi mới ngay lập tức với chế độ và độ khó hiện tại. |

---

### 1.4 Hướng dẫn thao tác chơi game trên Di động & Tablet (Màn hình cảm ứng)
Nhằm mang lại trải nghiệm tiện lợi tối đa trên thiết bị di động, giao diện game tích hợp hệ thống điều khiển thông minh riêng biệt:
1. **Thanh chuyển đổi chế độ cảm ứng (Touch Mode Bar):**
   - Nằm ngay dưới bàn cờ, gồm 2 nút lớn: **Open Mode (Mở ô)** và **Flag Mode (Cắm cờ)**.
   - Khi chọn *Open Mode*: Mỗi lần chạm ngón tay sẽ mở ô.
   - Khi chọn *Flag Mode*: Mỗi lần chạm ngón tay sẽ cắm/gỡ cờ an toàn.
2. **Cơ chế Nhấn giữ thông minh (Long Press Cắm cờ):**
   - Ở bất kỳ chế độ nào, người chơi chỉ cần **nhấn và giữ ngón tay trên ô khoảng 380ms**, hệ thống sẽ tự động cắm cờ kèm hiệu ứng rung nhẹ (Haptic Feedback).
   - Nếu ngón tay đang trượt vuốt màn hình (cuộn trang), thao tác nhấn giữ sẽ tự động bị hủy để tránh cắm cờ nhầm.
3. **Tự động co giãn (Responsive Auto-Scale):**
   - Bàn cờ tự động thu phóng tỷ lệ (scale) vừa vặn với kích thước màn hình điện thoại ở cả chiều dọc lẫn chiều ngang, không bị tràn viền.

---

### 1.5 Tính năng Gợi ý mìn thông minh (Hint System – 100 Xu)
- **Mục đích:** Hỗ trợ người chơi giải tỏa bế tắc khi gặp các thế cờ hóc búa cần suy luận.
- **Cách sử dụng:**
  - Nhấp vào nút **Hint (100 xu)** trên thanh công cụ bàn cờ hoặc nhấn phím tắt **H** trên bàn phím máy tính.
- **Nguyên lý hoạt động:**
  1. Giao diện gửi yêu cầu lên máy chủ qua route `POST /api/games/{token}/hint`.
  2. Máy chủ kiểm tra điều kiện ván đấu đang diễn ra và xác thực số dư tài khoản người chơi có đủ từ **100 xu ảo** trở lên trong một giao dịch an toàn (`DB::transaction`).
  3. Sau khi xác thực thành công, Engine JavaScript ở client quét toàn bộ mìn chưa được cắm cờ, phân loại và **ưu tiên chọn ngẫu nhiên một ô mìn ở vùng biên (Frontier)** — tức là ô mìn tiếp giáp trực tiếp với ít nhất một ô số đã mở.
  4. Hệ thống tự động cắm cờ vào ô mìn đó ngay lập tức (0ms) và kích hoạt **hiệu ứng sóng radar quét (radar pulse)** lan tỏa màu tím nổi bật, giúp người chơi định vị chính xác và tiếp tục giải bàn cờ.
  5. Nếu số dư tài khoản dưới 100 xu, hệ thống sẽ hiện thông báo nhẹ nhàng: *"Not enough coins for a hint"* và không trừ xu.

---

### 1.6 Hệ thống Xu thưởng và Thưởng tốc độ (Speed Bonus)
Người chơi tích lũy Xu ảo (Coins) hoàn toàn thông qua kỹ năng chiến thắng bàn cờ. Số xu nhận được sau mỗi ván thắng được tính theo công thức minh bạch:

$$\text{Tổng Xu Thưởng} = (\text{Xu Cơ Bản} + \text{Thưởng Biến Thể 20\%}) + \text{Thưởng Tốc Độ (Speed Bonus)}$$

#### A. Chi tiết Xu cơ bản và Thưởng biến thể:
- **Easy:** 30 xu (Chế độ Plus/Corner: 36 xu).
- **Medium:** 75 xu (Chế độ Plus/Corner: 90 xu).
- **Hard:** 180 xu (Chế độ Plus/Corner: 216 xu).

#### B. Cơ chế Thưởng tốc độ (Speed Bonus):
- **Phá đảo dưới 30 giây (< 30s):** Thưởng cực lớn **+100 Xu**.
- **Phá đảo dưới 60 giây (< 60s):** Thưởng lớn **+50 Xu**.
- **Phá đảo dưới 100 giây (< 100s):** Thưởng khích lệ **+25 Xu**.
- **Từ 100 giây trở lên (≥ 100s):** +0 Xu tốc độ (vẫn nhận đầy đủ xu cơ bản theo độ khó).

*Sau khi thắng trận, hộp thoại chiến thắng (Victory Modal) sẽ hiển thị chi tiết bảng phân rã xu (Reward Breakdown) và số dư mới.*

---

### 1.7 Hướng dẫn Cửa hàng Skin & Phòng Thử Chiến Thuật 5×5
Truy cập vào mục **Shop** (`/shop`) trên thanh điều hướng để khám phá bộ sưu tập **26 Skin độc quyền**:
- **13 Skin Bàn cờ (Board Skins):** Classic, Matrix, Glacier, Synthwave, Sakura, Wood, Ocean, Amethyst, Emerald, Magma, Cyberpunk, Royal, Obsidian.
- **13 Skin Lá cờ SVG (Flag Skins):** Classic, Pirate, Sakura, Hazard, Lightning, Sapphire, Shield, Radar, Crystal, Star, Phoenix, Skull, Crown.

#### Tính năng độc đáo tại Cửa hàng:
1. **Phòng Thử Chiến Thuật 5×5 (Tactical Preview Board):**
   - Cho phép người chơi trực tiếp nhấp mở ô, cắm cờ và phối hợp bất kỳ mẫu Bàn cờ nào với mẫu Lá cờ nào ngay trên bàn thử tương tác 5×5.
   - Nút **Hoàn tác (Reset)** giúp trả về bộ trang phục người chơi đang sử dụng trong thực tế nếu chưa muốn thay đổi.
2. **Ghim mục tiêu tích xu (Pin Goal):**
   - Người chơi có thể bấm biểu tượng Ghim (Pin) vào skin mong muốn sở hữu. Hệ thống sẽ tính toán và hiển thị chính xác số ván thắng ước tính cần đạt ở từng độ khó để đủ tiền mua skin đó.
3. **Bộ lọc và Tìm kiếm tiện lợi:**
   - Lọc theo danh mục: Tất cả, Bàn cờ, Lá cờ.
   - Lọc theo trạng thái: Đủ xu mua, Chưa sở hữu, Đã sở hữu.
   - Phân cấp theo 4 bậc thiết kế: Tiêu chuẩn, Chiến thuật, Đặc nhiệm, Tinh anh.
4. **Mua và Trang bị:**
   - Bấm **Unlock** khi đủ xu để mua vĩnh viễn (giao dịch trừ xu an toàn qua `POST /api/shop/buy`).
   - Bấm **Equip** để kích hoạt sử dụng skin đã mua vào bàn chơi thực tế (`POST /api/shop/equip`).

---

### 1.8 Xem Bảng xếp hạng Kỷ lục (Leaderboard)
- Nhấp vào nút **Leaderboard** trên thanh điều hướng hoặc xem ngay sau khi thắng trận.
- Bảng xếp hạng phân tách độc lập theo từng **Chế độ chơi (Classic, Plus, Corner)** và từng **Cấp độ khó (Easy, Medium, Hard)**.
- Xếp hạng được sắp xếp ưu tiên theo:
  1. Thời gian hoàn thành ván đấu nhanh nhất (`best_time_ms`, tính đến mili-giây).
  2. Nếu thời gian bằng nhau, người đạt kỷ lục trước sẽ xếp trên (so sánh mốc thời gian `achieved_at` chính xác đến phần nghìn giây `.v`).

---

<a name="phan-2-huong-dan-su-dung-danh-cho-quan-tri-vien-admin-cms-manual"></a>
## PHẦN 2: HƯỚNG DẪN SỬ DỤNG DÀNH CHO QUẢN TRỊ VIÊN (ADMIN CMS MANUAL)

### 2.1 Cổng đăng nhập Quản trị viên (/admin/login)
- **Đường dẫn truy cập:** `/admin/login` (Cổng đăng nhập biệt lập hoàn toàn với trang đăng nhập người chơi).
- **Tài khoản quản trị mặc định hệ thống:**
  - **Email:** `admin@minesweeper.local`
  - **Mật khẩu:** `Admin@123456`
- **Bảo mật:** Route đăng nhập quản trị được kiểm soát bởi middleware `throttle:10,1` ngăn chặn triệt để tấn công vét cạn mật khẩu. Sau khi đăng nhập thành công, session quản trị viên được thiết lập với cờ `is_admin = true`.

---

### 2.2 Bảng điều khiển Trung tâm (Dashboard Thống kê)
Sau khi đăng nhập, quản trị viên truy cập vào giao diện Quản trị `/admin`:
- **Thẻ thống kê tổng quan (KPI Cards):**
  - **Total Users:** Tổng số tài khoản đã đăng ký trên hệ thống.
  - **Games Played:** Tổng số ván game đã khởi tạo.
  - **Win Rate:** Tỷ lệ phần trăm chiến thắng tổng thể.
  - **Leaderboard Records:** Tổng số kỷ lục hợp lệ đang lưu trong hệ thống.
- **Thống kê chi tiết theo Chế độ chơi (Mode Breakdown):**
  - Bảng thống kê trực quan số ván đã chơi, số ván thắng, số ván thua và tỷ lệ phần trăm thắng riêng biệt cho 3 chế độ: **Classic**, **Plus** và **Corner**.

---

### 2.3 Quản lý Người dùng: Khóa / Mở khóa và Cấp tặng xu ảo (Give Coins)
1. **Tra cứu danh sách tài khoản:**
   - Xem toàn bộ danh sách người dùng gồm: ID, Tên, Email, Số dư xu (`coins`), Trạng thái (`Active` hoặc `Locked`), Ngày tạo tài khoản.
   - Thanh tìm kiếm hỗ trợ lọc nhanh người dùng theo Tên hoặc Email.
2. **Khóa / Mở khóa tài khoản (Lock / Unlock User):**
   - Bấm nút **Lock** để khóa các tài khoản vi phạm.
   - Khi tài khoản bị khóa (`is_locked = 1`), middleware `EnsureAccountIsActive` sẽ **lập tức hủy session đăng nhập** của người dùng đó, đồng thời chặn mọi yêu cầu gửi kết quả hay chơi game tiếp theo.
   - Bấm nút **Unlock** để mở khóa và khôi phục quyền chơi game bình thường.
   - *Cơ chế tự bảo vệ:* Hệ thống chặn tuyệt đối không cho phép tự khóa chính tài khoản admin đang đăng nhập hoặc xóa người quản trị duy nhất.
3. **Cấp tặng xu ảo cho người chơi (Give Coins):**
   - Nhấp vào nút **Give Coins** tại dòng thông tin của người dùng cần điều chỉnh.
   - Hộp thoại (Modal) mở ra cho phép admin:
     - Chọn các mốc cộng nhanh: **+500**, **+1.000**, **+5.000**, **+50.000** xu.
     - Hoặc nhập số xu tùy chỉnh vào ô nhập liệu.
   - Bấm **Confirm Adjustment**. Hệ thống thực hiện cộng dồn an toàn vào trường `coins` của người dùng qua route `POST /admin/users/{user}/give-coins`.

---

### 2.4 Quản lý Ván đấu và Tra cứu Kỷ lục Leaderboard
1. **Quản lý Kỷ lục (Leaderboard Records Management):**
   - Danh sách toàn bộ các kỷ lục thành tích tốt nhất của người chơi.
   - Hiển thị đầy đủ: Người chơi, Chế độ, Độ khó, Thời gian (`best_time_ms`), Mốc thời gian xác lập (`achieved_at`).
   - Admin có quyền nhấn nút **Delete** để xóa các kỷ lục nghi vấn hoặc bất thường để bảo đảm tính công bằng của cuộc đua xếp hạng.
2. **Theo dõi Nhật ký Ván đấu (Game History Log):**
   - Theo dõi trạng thái của các ván game gần nhất: Token UUID, Người chơi, Trạng thái (`playing`, `won`, `lost`), Thời gian bắt đầu và kết thúc.

---

<a name="phan-3-huong-dan-cai-dat--trien-khai-he-thong"></a>
## PHẦN 3: HƯỚNG DẪN CÀI ĐẶT & TRIỂN KHAI HỆ THỐNG

### 3.1 Yêu cầu môi trường vận hành
- **PHP:** Phiên bản `>= 8.2` (Khuyên dùng PHP 8.2 hoặc 8.3; bật các extension `pdo_mysql`, `mbstring`, `openssl`, `zip`, `curl`).
- **Composer:** Phiên bản `>= 2.5`.
- **Hệ quản trị CSDL:** MySQL `>= 8.0` hoặc MariaDB `>= 10.4` (hoặc TiDB Cloud Serverless trên môi trường Cloud).
- **Node.js & npm:** Node.js `>= 18.0` (dùng để build asset và chạy bộ unit test JavaScript).
- **Web Server:** Apache (tích hợp trong XAMPP) với module `mod_rewrite` được kích hoạt.

---

### 3.2 Hướng dẫn cài đặt trên môi trường Local (XAMPP / PHP 8.2 / MySQL)

#### Bước 1: Sao chép mã nguồn vào thư mục XAMPP
Đặt thư mục dự án `prjMinesweeper` vào đường dẫn:
`C:\xampp\htdocs\prjMinesweeper`

#### Bước 2: Cài đặt các gói phụ thuộc PHP (Composer)
Mở cửa sổ dòng lệnh (PowerShell hoặc Command Prompt) tại thư mục dự án và chạy:
```powershell
composer install
```

#### Bước 3: Cấu hình tệp môi trường (`.env`)
Sao chép tệp mẫu `.env.example` thành `.env`:
```powershell
copy .env.example .env
```
Mở tệp `.env` và kiểm tra cấu hình kết nối cơ sở dữ liệu MySQL của XAMPP:
```dotenv
APP_NAME=prjMinesweeper
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=prj_minesweeper
DB_USERNAME=root
DB_PASSWORD=
```

#### Bước 4: Khởi tạo khóa ứng dụng (Application Key)
```powershell
php artisan key:generate
```

#### Bước 5: Tạo cơ sở dữ liệu và nạp dữ liệu mẫu (Migration & Seed)
Đảm bảo dịch vụ MySQL trong XAMPP Control Panel đã được bật (Start). Tạo mới cơ sở dữ liệu có tên `prj_minesweeper` trong phpMyAdmin, sau đó chạy:
```powershell
php artisan migrate:fresh --seed
```
*Lệnh trên sẽ tự động khởi tạo 6 bảng dữ liệu chính, nạp danh mục 3 chế độ chơi, 3 cấp độ khó, danh mục 26 skin và tài khoản quản trị viên mặc định (`admin@minesweeper.local` / `Admin@123456`).*

#### Bước 6: Khởi chạy máy chủ phát triển
```powershell
php artisan serve
```
Truy cập trình duyệt tại địa chỉ: `http://127.0.0.1:8000` để bắt đầu trải nghiệm ứng dụng.

---

### 3.3 Hướng dẫn triển khai Cloud (Docker / Render / TiDB Cloud)
Dự án được cấu hình sẵn sàng cho việc đóng gói container và triển khai lên nền tảng đám mây:
1. **Cơ sở dữ liệu TiDB Cloud Serverless:**
   - Đăng ký cụm TiDB Cloud miễn phí, cấu hình kết nối bảo mật SSL qua biến môi trường:
     ```dotenv
     DB_CONNECTION=mysql
     DB_HOST=gateway01.ap-southeast-1.prod.aws.tidbcloud.com
     DB_PORT=4000
     DB_DATABASE=prj_minesweeper
     DB_USERNAME=<tidb_user>
     DB_PASSWORD=<tidb_password>
     MYSQL_ATTR_SSL_CA=/etc/ssl/certs/ca-certificates.crt
     ```
2. **Đóng gói Docker đa tầng (`Dockerfile`):**
   - Stage 1: Build tối ưu asset Vite/CSS/JS bằng Node.js.
   - Stage 2: Cài đặt mã nguồn PHP 8.3 trên nền tảng máy chủ Apache (`php:8.3-apache`).
   - Tự động kích hoạt `mod_rewrite`, tối ưu `opcache` và thiết lập quyền ghi cho thư mục `storage` và `bootstrap/cache`.
3. **Kịch bản khởi động thông minh (`docker-entrypoint.sh`):**
   - Khi container khởi chạy trên Render, script tự động kiểm tra kết nối CSDL, thực thi `php artisan migrate --force` và chạy seeder nếu bảng danh mục còn trống, sau đó khởi động Apache phục vụ người dùng 24/7.

---

### 3.4 Quy trình chạy kiểm thử tự động (40 PHPUnit + 25 Node.js Tests)

#### A. Chạy toàn bộ 40 bài kiểm thử Backend Laravel (PHPUnit):
```powershell
php artisan test
```
*Kết quả thẩm định:* **40/40 tests PASSED** (259 assertions) kiểm tra toàn diện:
- `MinefieldFlowTest`: Luồng đăng nhập, đăng ký, chơi khách, bắt đầu ván, ghi nhận kết quả và leaderboard.
- `AntiCheatAndTimerTest`: Chống gửi token giả mạo, kiểm soát sai lệch thời gian 2.500ms, chặn thời gian < 200ms, chống brute-force và kiểm tra phân quyền tài khoản bị khóa.
- `ShopAndCurrencyTest`: Cơ chế cộng xu theo độ khó, thưởng thêm 20% chế độ biến thể, thưởng tốc độ Speed Bonus, trừ 100 xu an toàn khi dùng Hint và giao dịch mua/trang bị skin.

#### B. Chạy toàn bộ 25 bài kiểm thử JavaScript Engine (Node.js):
```powershell
npm run test:js
```
*Kết quả thẩm định:* **25/25 tests PASSED** kiểm tra độc lập DOM:
- Thuật toán láng giềng 3 chế độ (Classic 8 ô, Plus 4 ô, Corner 4 ô).
- Thuật toán Safe First Click và sinh mìn đủ số lượng.
- Thuật toán loang ô trống (Flood-fill) không mở ô cắm cờ.
- Thao tác cắm cờ và mở nhanh (Chording).
- Thuật toán Gợi ý mìn vùng biên (Hint Frontier).
- Khóa toàn bộ trạng thái bàn cờ sau khi thắng/thua.

---

<a name="phan-4-giai-thich-kien-truc-ma-nguon--co-che-ky-thuat"></a>
## PHẦN 4: GIẢI THÍCH KIẾN TRÚC MÃ NGUỒN & CƠ CHẾ KỸ THUẬT

### 4.1 Mô hình tách biệt Client Engine (0ms) – Server Authority
Hệ thống được thiết kế theo mô hình kiến trúc phân tầng hiệu năng cao:
- **Client Engine (`public/minefield/js/engine.js` & `game.js`):**
  - Đảm nhiệm toàn bộ thao tác bàn cờ ngay trong bộ nhớ trình duyệt: click mở ô, cắm cờ, tính toán láng giềng, mở lan flood-fill, chord và quét gợi ý mìn.
  - Phản hồi **0ms (Zero-Latency)** tức thì, mang lại cảm giác mượt mà hoàn hảo cho người chơi tốc độ cao mà không bị gián đoạn bởi độ trễ mạng.
- **Server Authority (Laravel 12 MVC):**
  - Đóng vai trò máy chủ thẩm quyền tối cao: cấp phát Game Token (UUID), ghi nhận mốc thời gian bắt đầu `started_at` trên server, xác thực tính hợp lệ của ván đấu, phòng chống gian lận, thực thi giao dịch tài chính xu ảo an toàn trong `DB::transaction()` và quản trị dữ liệu tập trung qua Admin CMS.

---

### 4.2 Thuật toán Safe First Click & Loang ô trống (Flood-fill)
1. **Lần nhấp đầu tiên luôn luôn an toàn (Safe First Click):**
   - Khi bàn cờ khởi tạo, chưa có quả mìn nào được đặt lên lưới.
   - Ngay khi người chơi nhấp vào ô đầu tiên `(firstClickIndex)`, hàm `generateBoard()` trong `engine.js` mới tiến hành rải mìn ngẫu nhiên.
   - Thuật toán loại trừ ô `firstClickIndex` cùng toàn bộ các ô láng giềng của nó ra khỏi danh sách có thể chứa mìn. Nhờ đó, ô đầu tiên **chắc chắn luôn luôn là ô số 0**, kích hoạt loang mở rộng lập tức, giúp người chơi có một vùng xuất phát thông thoáng mà không bao giờ bị nổ mìn ngay nước đầu.
2. **Thuật toán Loang ô trống (Flood-fill):**
   - Khi một ô số 0 được mở ra, hàm `revealCell()` sử dụng hàng đợi (Queue-based Breadth-First Search) để duyệt toàn bộ các ô láng giềng hợp lệ chưa mở và không bị cắm cờ.
   - Nếu ô láng giềng cũng là số 0, nó tiếp tục được đưa vào hàng đợi để loang tiếp; nếu là ô số > 0, nó chỉ mở ra mà không loang thêm. Quá trình dừng lại tự nhiên khi chạm đến các đường biên số.

---

### 4.3 Thuật toán Láng giềng 3 Chế độ (Cổ điển, Dấu cộng, Góc chéo)
Được cài đặt tập trung trong hàm `getNeighbors(r, c, rows, cols, mode)` của `engine.js`:
- **Chế độ Classic (8 ô láng giềng):**
  Duyệt qua 8 vector độ lệch: `(-1,-1), (-1,0), (-1,1), (0,-1), (0,1), (1,-1), (1,0), (1,1)`.
- **Chế độ Plus (4 ô kề cạnh):**
  Chỉ duyệt qua 4 vector trực giao: `(-1,0), (1,0), (0,-1), (0,1)`.
- **Chế độ Corner (4 ô góc chéo):**
  Chỉ duyệt qua 4 vector đường chéo: `(-1,-1), (-1,1), (1,-1), (1,1)`.

*Hàm kiểm tra điều kiện biên nghiêm ngặt: $0 \le r < \text{rows}$ và $0 \le c < \text{cols}$ trước khi ghi nhận láng giềng.*

---

### 4.4 Thuật toán Gợi ý mìn vùng biên (Frontier Hint) & Giao dịch DB::transaction
1. **Thuật toán quét mìn vùng biên (`applyHint`):**
   - Quét toàn bộ lưới để lọc ra danh sách các ô có `mine = true` và `flagged = false`.
   - Phân loại danh sách mìn thành 2 nhóm:
     + **Nhóm vùng biên (Frontier):** Gồm các ô mìn có ít nhất một ô láng giềng đã được mở.
     + **Nhóm mìn nội bộ:** Các ô mìn nằm sâu bên trong, chưa tiếp giáp ô số đã mở nào.
   - Thuật toán ưu tiên chọn ngẫu nhiên một ô thuộc nhóm Frontier để cắm cờ. Điều này mang lại giá trị chiến thuật tối đa vì nó giúp người chơi giải mã ngay các con số đang tiếp giáp.
2. **Bảo toàn giao dịch xu phía Server (`MinefieldGameController::hint`):**
   - Toàn bộ nghiệp vụ kiểm tra số dư và trừ 100 xu được đặt trong khối `DB::transaction()`:
     ```php
     DB::transaction(function () use ($user) {
         $currentUser = User::where('id', $user->id)->lockForUpdate()->first();
         if ($currentUser->coins < 100) {
             throw new HttpResponseException(response()->json(['message' => 'Not enough coins for a hint.'], 422));
         }
         $currentUser->decrement('coins', 100);
     });
     ```
   - Cơ chế khóa dòng `lockForUpdate()` ngăn chặn triệt để tấn công Race Condition (bấm nút liên tục nhiều lần cùng lúc để gian lận số dư).

---

### 4.5 Cơ chế chống gian lận thời gian mili-giây (verifyTime & UUID Token)
Để bảo vệ tính toàn vẹn của Bảng xếp hạng Leaderboard, hệ thống thiết lập hàng rào phòng thủ đa lớp phía Backend:
1. **Game Token duy nhất (UUID v4):**
   - Khi bấm Start Game, server sinh một mã UUID ngẫu nhiên không thể đoán trước và lưu mốc thời gian bắt đầu `started_at` chuẩn xác đến mili-giây trên máy chủ.
   - Token chỉ có thể kết thúc ván một lần duy nhất (chuyển trạng thái từ `playing` sang `won` hoặc `lost`). Mọi nỗ lực gửi lại kết quả trên cùng token (Replay Attack) đều bị từ chối với mã lỗi HTTP 409 Conflict.
2. **Xác minh thời gian kép (`verifyTime`):**
   - Khi client gửi kết quả ván thắng kèm `client_time_ms`, server tính toán khoảng thời gian thực tế dựa trên đồng hồ máy chủ:
     $$\Delta t_{\text{server}} = (\text{now} - \text{started\_at}) \times 1000\text{ (ms)}$$
   - Kiểm tra 2 điều kiện an toàn:
     + **Ngưỡng tối thiểu:** `client_time_ms` phải $\ge 200\text{ ms}$ (chặn các công cụ tự động gửi kết quả tức thì).
     + **Dung sai mạng cho phép:** Sai lệch giữa thời gian client và thời gian server không được vượt quá **2.500 ms** (`TIME_TOLERANCE_MS`):
       $$|\Delta t_{\text{server}} - \text{client\_time\_ms}| \le 2500\text{ ms}$$
   - Nếu phát hiện bất thường, máy chủ lập tức từ chối ghi nhận kỷ lục và trả về mã lỗi HTTP 422 Unprocessable Entity.

---

### 4.6 Danh mục RESTful API endpoints

| Phương thức | Đường dẫn API | Chức năng nghiệp vụ | Middleware áp dụng |
| :---: | :--- | :--- | :--- |
| `POST` | `/api/signup` | Đăng ký tài khoản thành viên mới | `throttle:10,1` |
| `POST` | `/api/login` | Đăng nhập tài khoản người dùng | `throttle:10,1` |
| `POST` | `/api/guest` | Khởi tạo phiên chơi thử Khách vãng lai | Session web |
| `POST` | `/api/logout` | Đăng xuất phiên làm việc hiện tại | `auth` / Session |
| `POST` | `/api/games` | Bắt đầu ván mới, cấp token UUID & mốc started_at | Session web |
| `POST` | `/api/games/{token}/win` | Nộp kết quả thắng, xác minh thời gian & cộng xu | `EnsureActiveGame` |
| `POST` | `/api/games/{token}/loss` | Nộp kết quả thua (bấm trúng mìn) | `EnsureActiveGame` |
| `POST` | `/api/games/{token}/hint` | Sử dụng gợi ý mìn, trừ 100 xu an toàn | `EnsureActiveGame` |
| `GET` | `/api/leaderboard` | Truy vấn bảng xếp hạng top 10 theo mode & độ khó | Public |
| `GET` | `/api/best-time` | Truy vấn kỷ lục cá nhân tốt nhất của người chơi | Public / Session |
| `GET` | `/api/shop` | Lấy danh mục 26 skin, số dư xu & trang bị | Session / User |
| `POST` | `/api/shop/buy` | Mua skin mới qua DB::transaction | `auth` (Bắt buộc đăng nhập) |
| `POST` | `/api/shop/equip` | Thay đổi trang phục bàn cờ / lá cờ đang trang bị | `auth` (Bắt buộc đăng nhập) |
| `POST` | `/admin/users/{user}/lock` | Khóa hoặc mở khóa tài khoản người chơi | `admin` |
| `POST` | `/admin/users/{user}/give-coins` | Quản trị viên cấp tặng xu ảo cho tài khoản | `admin` |
| `DELETE`| `/admin/records/{record}` | Quản trị viên xóa kỷ lục bất thường | `admin` |

---

<a name="phan-5-bo-cau-hoi-va-tra-loi-phan-bien-qa-cho-buoi-bao-ve"></a>
## PHẦN 5: BỘ CÂU HỎI VÀ TRẢ LỜI PHẢN BIỆN (Q&A CHO BUỔI BẢO VỆ)

#### Câu 1: Tại sao nhóm chọn hệ quản trị CSDL MySQL / TiDB mà không sử dụng MongoDB?
**Trả lời:**
Hệ thống Web Game Minesweeper có cấu trúc dữ liệu quan hệ chặt chẽ (quan hệ 1-N rõ ràng giữa `users` – `games`, `users` – `records`, `users` – `user_skins`; các ràng buộc khóa ngoại tới `game_modes` và `difficulties`). Đặc biệt, tính năng Kinh tế Xu và Mua Skin đòi hỏi tính toàn vẹn tuyệt đối (ACID Transactions) thông qua `DB::transaction()` để không xảy ra lỗi âm tiền hoặc trùng lặp giao dịch. Chỉ mục kết hợp đa cột trên MySQL (`records_leaderboard_idx`) cũng tối ưu hóa vượt bậc tốc độ truy vấn Bảng xếp hạng thời gian thực.

#### Câu 2: Tại sao đề tài không tích hợp các cổng thanh toán trực tuyến như MoMo, VNPay hay ZaloPay?
**Trả lời:**
Theo đúng định hướng đã cam kết trong Phiếu đăng ký đề tài (*"Không tích hợp thanh toán tiền thật"*), đồ án xây dựng mô hình chơi game tích lũy kỹ năng lành mạnh. Toàn bộ tiền tệ trong game là **Xu ảo (Coins)** do người chơi tự tay chinh phục các bàn cờ khó và hoàn thành thời gian nhanh (Speed Bonus) để đạt được. Điều này giúp dự án tập trung tối đa vào giải thuật game, tránh được các rủi ro pháp lý về cổng thanh toán và phí duy trì dịch vụ bên thứ ba.

#### Câu 3: Tại sao nhóm để Engine logic bàn cờ chạy bằng JavaScript ở Client, còn Laravel chỉ xử lý Backend?
**Trả lời:**
Minesweeper là trò chơi phản xạ tốc độ cao. Tần suất thao tác nhấp chuột, cắm cờ và mở nhanh (Chord) diễn ra liên tục từng phần mười giây. Nếu mỗi cú nhấp chuột đều phải gửi HTTP Request về máy chủ để tính toán, độ trễ mạng (Network Latency) từ 50ms – 200ms sẽ làm bàn cờ bị giật lag, phá hỏng trải nghiệm người chơi. Việc giữ Game Engine thuần túy trong `engine.js` đảm bảo **phản hồi tức thì 0ms**. Trong khi đó, Backend Laravel đảm đương trọn vẹn vai trò quản lý bảo mật: cấp phát token ván đấu, lưu mốc thời gian bắt đầu, thẩm định tính hợp lệ thời gian mili-giây chống gian lận và quản lý cơ sở dữ liệu tập trung.

#### Câu 4: Cơ chế tính Thưởng tốc độ (Speed Bonus) được cài đặt như thế nào trong mã nguồn?
**Trả lời:**
Được cài đặt trong dịch vụ `App\Services\SkinCatalog::calculateSpeedBonus(?int $timeMs)`. Nếu thời gian thắng trận dưới 30 giây thưởng thêm 100 xu, dưới 60 giây thưởng 50 xu, dưới 100 giây thưởng 25 xu. Hàm `getRewardBreakdown()` sẽ tự động tổng hợp xu cơ bản của độ khó, cộng thêm 20% nếu là chế độ biến thể (Plus/Corner) và cộng dồn thưởng tốc độ trước khi cập nhật số dư cho người dùng.

#### Câu 5: Thuật toán Gợi ý mìn thông minh (Hint System) tìm vị trí mìn như thế nào?
**Trả lời:**
Khi người chơi bấm nút Hint, trước hết Backend xác thực người chơi và trừ 100 xu an toàn trong `DB::transaction()`. Ngay sau đó, hàm `applyHint()` trong `engine.js` quét toàn bộ các ô mìn chưa cắm cờ trên bàn cờ client, lọc ra tập hợp các ô mìn vùng biên (Frontier – tiếp giáp ít nhất một ô số đã mở). Thuật toán ưu tiên chọn ngẫu nhiên một ô thuộc Frontier để tự động cắm cờ và phát hiệu ứng sóng radar tím, giúp người chơi có cơ sở vững chắc để tiếp tục suy luận mở các ô kế bên.

#### Câu 6: Hệ thống phòng thủ trước các hành vi gian lận kỷ lục và gửi thời gian ảo ra sao?
**Trả lời:**
Hệ thống sử dụng cơ chế bảo vệ 3 lớp:
1. Mỗi ván chơi phải có Game Token dạng UUID sinh từ máy chủ, đi kèm mốc thời gian `started_at` chuẩn xác đến mili-giây.
2. Khi gửi kết quả thắng, hàm `verifyTime()` kiểm tra thời gian client gửi lên không được nhỏ hơn thời gian tối thiểu hợp lý (200ms) và độ lệch so với đồng hồ máy chủ không được vượt quá dung sai 2.500ms.
3. Mỗi token chỉ được kết thúc một lần duy nhất; mọi yêu cầu gửi lại (Replay Attack) đều bị từ chối với mã lỗi HTTP 409 Conflict.

#### Câu 7: Tại sao tệp kiểm thử JavaScript lại sử dụng đuôi mở rộng `.cjs` thay vì `.js`?
**Trả lời:**
Trong tệp `package.json` của dự án có khai báo `"type": "module"`. Tệp kiểm thử `tests/js/engine.test.cjs` sử dụng cơ chế nạp tệp CommonJS (`fs` và `require`). Việc đặt đuôi `.cjs` giúp Node.js nhận diện tường minh đây là tệp CommonJS, cho phép chạy độc lập bộ kiểm thử 25 test cases mà không gây xung đột định dạng module với cấu hình Vite của dự án.

#### Câu 8: Hệ thống phòng thủ trước tấn công brute-force đăng nhập và khóa tài khoản ra sao?
**Trả lời:**
Các route đăng ký và đăng nhập đều được bảo vệ bởi middleware `throttle:10,1` của Laravel (tối đa 10 yêu cầu/phút), vượt quá giới hạn sẽ nhận mã lỗi HTTP 429 Too Many Requests. Đồng thời, khi quản trị viên khóa một tài khoản (`is_locked = 1`), middleware `EnsureAccountIsActive` sẽ lập tức hủy session làm việc và chặn mọi thao tác tiếp theo của tài khoản đó.

#### Câu 9: Chức năng Cấp tặng xu (Give Coins) trong trang Quản trị hoạt động ra sao?
**Trả lời:**
Trong trang Quản trị `/admin`, quản trị viên bấm nút Give Coins trên từng người dùng để mở modal điều chỉnh. Admin có thể chọn các nút cộng nhanh (+500 đến +50.000 xu) hoặc nhập số xu tùy ý. Yêu cầu gửi tới route `POST /admin/users/{user}/give-coins` được controller kiểm tra quyền admin và cộng dồn số dư an toàn vào trường `coins` trong CSDL.

#### Câu 10: Tỷ lệ phân công đóng góp 50/50 giữa hai thành viên trong nhóm được thể hiện cụ thể ra sao?
**Trả lời:**
Hai thành viên phối hợp chặt chẽ theo đúng chuyên môn và bảng phân công trong Phiếu đăng ký đề tài:
- **Nguyễn Phan Thiên Phước (50%):** Chịu trách nhiệm toàn bộ Backend Laravel 12 MVC, thiết kế CSDL MySQL/TiDB Cloud, Migration/Seeder, Hệ thống Xác thực & Phân quyền, RESTful API, Cơ chế chống gian lận thời gian `verifyTime`, Dịch vụ SkinCatalog, Quản trị Admin CMS, viết 40 bài kiểm thử PHPUnit và đóng gói Dockerfile / Deploy Render.
- **Tô Nguyễn Hoàng An (50%):** Chịu trách nhiệm toàn bộ Frontend Blade templates, Lập trình Game Engine Vanilla JS (`engine.js`, `game.js`, `shop.js`, `skins.js`, `ui.js`), thuật toán láng giềng 3 chế độ & Hint vùng biên, thiết kế giao diện Responsive đa nền tảng PC/Tablet/Mobile, thanh điều khiển cảm ứng & nhấn giữ cắm cờ, 7 chủ đề màu Pastel, bộ 26 Skin SVG, viết 25 bài kiểm thử Node.js và biên soạn tài liệu báo cáo.
