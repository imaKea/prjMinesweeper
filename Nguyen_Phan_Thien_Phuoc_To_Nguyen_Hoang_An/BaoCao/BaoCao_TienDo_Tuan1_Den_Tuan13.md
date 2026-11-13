# BỘ GIÁO DỤC VÀ ĐÀO TẠO
# TRƯỜNG CAO ĐẲNG LÝ TỰ TRỌNG TP. HỒ CHÍ MINH
## KHOA CÔNG NGHỆ THÔNG TIN

---

# BÁO CÁO TIẾN ĐỘ & TỔNG KẾT ĐỒ ÁN CHUYÊN NGÀNH
## MỐC TIẾN ĐỘ: TỪ TUẦN 1 ĐẾN HẾT TUẦN 13

**ĐỀ TÀI:**
### **XÂY DỰNG WEB GAME MINESWEEPER ĐA CHẾ ĐỘ VÀ HỆ THỐNG QUẢN TRỊ BẰNG LARAVEL**

- **Giảng viên hướng dẫn:** ThS. Mai Chiếm Tuấn
- **Sinh viên thực hiện:**
  1. **Nguyễn Phan Thiên Phước** — MSSV: **25002451** — Lớp: **25C2-LTM1**
  2. **Tô Nguyễn Hoàng An**       — MSSV: **25002441** — Lớp: **25C2-LTM1**
- **Ngành đào tạo:** Lập trình máy tính · **Khóa:** 2025
- **Học kỳ:** 3 · **Năm học:** 2025 – 2026 (hoàn thiện 2026 – 2027)
- **Địa điểm:** TP. Hồ Chí Minh

---

## PHẦN 1: THÔNG TIN HÀNH CHÍNH ĐỒ ÁN

| Thông tin | Nội dung chi tiết |
| :--- | :--- |
| **Cơ quan chủ quản** | Trường Cao đẳng Lý Tự Trọng TP. Hồ Chí Minh — Khoa Công nghệ Thông tin |
| **Ngành đào tạo / Lớp** | Lập trình máy tính / Lớp: 25C2-LTM1 (Khóa 2025) |
| **Học kỳ / Năm học** | Học kỳ 3 / Năm học 2025 – 2026 (hoàn thiện 2026 – 2027) |
| **Tên đề tài** | XÂY DỰNG WEB GAME MINESWEEPER ĐA CHẾ ĐỘ VÀ HỆ THỐNG QUẢN TRỊ BẰNG LARAVEL |
| **Giảng viên hướng dẫn** | ThS. Mai Chiếm Tuấn |
| **Sinh viên 1** | Nguyễn Phan Thiên Phước — MSSV: 25002451 — Vai trò: Backend Laravel & Deploy Cloud (Render, TiDB) |
| **Sinh viên 2** | Tô Nguyễn Hoàng An — MSSV: 25002441 — Vai trò: Frontend JS Engine, UI/UX & Testing |
| **Thời điểm báo cáo** | Báo cáo tiến độ và nghiệm thu kỹ thuật từ Tuần 1 đến hết Tuần 13 |

---

## PHẦN 2: BẢNG TỔNG HỢP TIẾN ĐỘ THỰC HIỆN (TUẦN 1 ĐẾN TUẦN 13)

| Tuần | Giai đoạn theo kế hoạch | Kết quả thực tế & Trạng thái | Đánh giá |
| :---: | :--- | :--- | :---: |
| **Tuần 1** | Khảo sát bài toán & Nghiên cứu lý thuyết game Dò mìn | Khảo sát luật chơi truyền thống 8 ô, đề xuất 2 biến thể (Dấu cộng 4 ô, Góc chéo 4 ô); lập và nộp Phiếu đăng ký đề tài cho GVHD. | **HOÀN THÀNH (100%)** |
| **Tuần 2** | Phân tích yêu cầu hệ thống & Thiết kế luồng nghiệp vụ | Đặc tả 3 chế độ × 3 độ khó; thiết kế Thuật toán Gợi ý mìn vùng biên (Hint 100 xu); quy chuẩn luồng kinh tế xu và Speed Bonus. | **HOÀN THÀNH (100%)** |
| **Tuần 3** | Thiết kế kiến trúc hệ thống & Đặc tả RESTful API | Thiết lập mô hình Client Engine (JS thuần 0ms) – Server Authority (Laravel 12); phân quyền Guest/User/Admin; thiết kế tài liệu API endpoints. | **HOÀN THÀNH (100%)** |
| **Tuần 4** | Thiết kế Cơ sở dữ liệu quan hệ (ERD & Schema) | Thiết kế 6 bảng chính (users, game_modes, difficulties, games, records, user_skins) và bảng hạ tầng; lập trình Migration & Seeders. | **HOÀN THÀNH (100%)** |
| **Tuần 5** | Thiết kế giao diện UI/UX đa nền tảng & Bộ sưu tập Skin | Xây dựng giao diện Blade Responsive (PC/Tablet/Mobile), 7 bảng màu Pastel thanh lịch; thiết kế ý tưởng bộ sưu tập 26 Skin bàn cờ và lá cờ. | **HOÀN THÀNH (100%)** |
| **Tuần 6** | Lập trình Engine trò chơi Vanilla JavaScript (`engine.js`) | Hoàn thành engine.js độc lập DOM: ma trận láng giềng 3 chế độ, click đầu luôn an toàn ra ô 0, loang ô trống (Flood-fill), cắm cờ và Chord mở nhanh. | **HOÀN THÀNH (100%)** |
| **Tuần 7** | Lập trình Backend Laravel: Xác thực, Ván đấu & Leaderboard | Xây dựng AuthController (băm bcrypt, throttle:10,1, session khách); GameController sinh UUID token, lưu started_at mili-giây, API leaderboard. | **HOÀN THÀNH (100%)** |
| **Tuần 8** | Xây dựng Kinh tế Xu ảo, Speed Bonus & Gợi ý mìn (Hint) | Hoàn thành SkinCatalog: thưởng xu độ khó +20% biến thể, Speed Bonus (<30s/+100, <60s/+50, <100s/+25 xu); API /hint trừ 100 xu an toàn qua DB::transaction. | **HOÀN THÀNH (100%)** |
| **Tuần 9** | Xây dựng Cửa hàng Skin & Phòng Thử Chiến Thuật 5×5 | Hoàn thành Cửa hàng 26 Skin (13 bàn cờ + 13 lá cờ), bàn thử tương tác 5×5, lọc danh mục, ghim mục tiêu, giao dịch mua/trang bị an toàn qua DB transaction. | **HOÀN THÀNH (100%)** |
| **Tuần 10** | Xây dựng Bảng điều khiển Quản trị viên Admin CMS | Cổng /admin/login riêng; Control Room Dashboard thống kê tỷ lệ thắng theo chế độ; CRUD tài khoản (khóa/mở khóa), CRUD kỷ lục; công cụ Give Coins quản trị. | **HOÀN THÀNH (100%)** |
| **Tuần 11** | Tích hợp toàn diện Client–Server & Tối ưu cảm ứng Mobile | Ghép nối API; tối ưu giao diện co giãn, thanh công cụ cảm ứng Mở ô/Cắm cờ, long-press ~380ms hủy khi vuốt, UI Motion (rung chấn, pháo hoa); đạt 31 PHPUnit + 23 JS tests. | **HOÀN THÀNH (100%)** |
| **Tuần 12** | Kiểm thử toàn hệ thống & Gia cố chống gian lận Timer | Vá lỗ hổng timeMs <200ms/âm; kiểm soát dung sai máy chủ 2.500ms; chống replay token, IDOR; nâng cấp lên 40/40 PHPUnit (259 assertions) và 25/25 JS tests PASS. | **HOÀN THÀNH (100%)** |
| **Tuần 13** | Đóng gói Docker đa tầng, Tối ưu Production & Deploy Cloud | Xây dựng Dockerfile đa tầng (Node 20 Vite + PHP 8.3 Apache); script entrypoint tự động migrate/seed; deploy Render Web Service + TiDB Cloud Serverless (SSL); xuất script SQL. | **HOÀN THÀNH (100%)** |

---

## PHẦN 3: BÁO CÁO CHI TIẾT NỘI DUNG THỰC HIỆN TỪNG TUẦN (TUẦN 1 – 13)

### TUẦN 1: KHẢO SÁT BÀI TOÁN & NGHIÊN CỨU LÝ THUYẾT GAME DÒ MÌN
- **Mục tiêu:** Khảo sát cơ chế game Minesweeper truyền thống, tìm ra điểm nghẽn trải nghiệm và đề xuất các biến thể luật chơi mới; chuẩn bị hồ sơ đăng ký đề tài.
- **Công việc đã thực hiện:**
  1. Khảo sát thực trạng các phiên bản game Dò mìn (Minesweeper) kinh điển trên Windows và các phiên bản web hiện đại (Google Minesweeper, Minesweeper.online). Nhận thấy luật chơi truyền thống chỉ xoay quanh 8 ô láng giềng xung quanh, dễ gây cảm giác đơn điệu khi người chơi đã quen thuộc các thế cờ.
  2. Nghiên cứu mở rộng lý thuyết và đề xuất 2 cơ chế biến thể hoàn toàn mới:
     - **Chế độ Dấu cộng (Plus):** Chỉ xét 4 ô kề cạnh (trên, dưới, trái, phải). Tương ứng vector offsets: `[[-1,0], [0,-1], [0,1], [1,0]]`. Cơ chế này thu hẹp tầm kiểm soát nhưng tăng tính phán đoán theo trục vuông góc.
     - **Chế độ Góc chéo (Corner):** Chỉ xét 4 ô ở các góc đường chéo. Tương ứng vector offsets: `[[-1,-1], [-1,1], [1,-1], [1,1]]`. Cơ chế này chia tách bàn cờ thành 2 mạng lưới ô chẵn/lẻ độc lập, mang lại trải nghiệm chiến thuật hoàn toàn mới lạ.
  3. Quy chuẩn hóa 3 cấp độ khó tiêu chuẩn phù hợp với tỷ lệ mìn cân bằng:
     - **Dễ (Easy):** 9×9 ô, 10 mìn (tỷ lệ mìn ~12.3%).
     - **Trung bình (Medium):** 12×12 ô, 22 mìn (tỷ lệ mìn ~15.3%).
     - **Khó (Hard):** 16×16 ô, 40 mìn (tỷ lệ mìn ~15.6%).
  4. Thống nhất ý tưởng, phân công công việc sơ bộ và lập Phiếu đăng ký đề tài đồ án chuyên ngành trình Giảng viên hướng dẫn ThS. Mai Chiếm Tuấn phê duyệt.

### TUẦN 2: PHÂN TÍCH YÊU CẦU HỆ THỐNG & ĐẶC TẢ NGHIỆP VỤ
- **Mục tiêu:** Cụ thể hóa toàn bộ chức năng, phi chức năng và giải quyết các bài toán kỹ thuật cốt lõi.
- **Công việc đã thực hiện:**
  1. Phân tích yêu cầu chức năng (Functional Requirements):
     - **Nhóm chức năng Gameplay:** Chơi 3 chế độ × 3 độ khó; cơ chế an toàn lần bấm đầu tiên (Safe First Click); thuật toán loang mở ô trống (Flood-fill); cơ chế mở nhanh (Chording) khi đã đủ cờ; cắm/gỡ cờ; đồng hồ đếm thời gian chính xác mili-giây.
     - **Nhóm chức năng Xác thực & Người dùng:** Đăng ký, đăng nhập bảo mật, đăng xuất; hỗ trợ chế độ Chơi thử Khách (Guest) không cần tài khoản; quản lý thông tin cá nhân và số dư xu.
     - **Nhóm chức năng Bảng xếp hạng (Leaderboard):** Tự động ghi nhận thành tích tốt nhất (`best_time_ms`) của từng người chơi theo từng chế độ và độ khó; hiển thị bảng xếp hạng cộng đồng thời gian thực.
     - **Nhóm chức năng Kinh tế ảo & Cửa hàng Skin:** Tích lũy xu ảo khi thắng trận, thưởng thêm +20% xu cho chế độ biến thể, cơ chế thưởng tốc độ (Speed Bonus); sử dụng xu để mua trang phục skin bàn cờ và lá cờ.
     - **Nhóm chức năng Quản trị (Admin CMS):** Cổng đăng nhập chuyên biệt; bảng điều khiển thống kê tỷ lệ thắng/thua theo chế độ; quản lý tài khoản người dùng (khóa/mở khóa); quản lý kỷ lục thành tích; công cụ điều chỉnh số dư xu.
  2. Đặc tả yêu cầu phi chức năng (Non-Functional Requirements): Đảm bảo độ trễ 0ms khi thao tác bàn cờ; giao diện tương thích đa nền tảng PC/Tablet/Mobile; an toàn dữ liệu, chống brute-force đăng nhập và chống gian lận thời gian trên server.
  3. **Thiết kế tính năng Gợi ý mìn vùng biên (Hint System):** Xây dựng **Hệ thống Gợi ý mìn thông minh (Hint System)** với chi phí 100 xu ảo, kết hợp giải thuật tìm mìn vùng biên tại client (`engine.js`) ưu tiên các ô tiếp giáp ô số đã mở và xác thực trừ xu an toàn phía backend qua `DB::transaction()`.

### TUẦN 3: THIẾT KẾ KIẾN TRÚC HỆ THỐNG & ĐẶC TẢ RESTFUL API
- **Mục tiêu:** Thiết lập kiến trúc phần mềm phân tầng rõ ràng, bảo đảm hiệu năng tối đa và tính bảo mật cao.
- **Công việc đã thực hiện:**
  1. Thiết kế kiến trúc hệ thống theo mô hình phân tách hiệu năng cao: **Client Engine – Server Authority**:
     - **Client Engine (Vanilla JS):** Đảm nhiệm toàn bộ logic xử lý tức thời của bàn cờ (sinh mìn, mở ô, loang, chord, cắm cờ, tìm gợi ý) để đạt độ trễ 0ms, mang lại cảm giác mượt mà tuyệt đối cho người chơi tốc độ cao.
     - **Server Authority (Laravel 12):** Giữ vai trò máy chủ thẩm quyền tối cao, quản trị cơ sở dữ liệu, cấp phát Game Token (UUID), lưu mốc thời gian `started_at`, xác thực kết quả ván đấu, phòng chống gian lận, xử lý giao dịch xu/skin và quản lý hệ thống CMS.
  2. Thiết kế sơ đồ phân quyền người dùng:
     - **Khách vãng lai (Guest):** Lưu phiên chơi tạm thời trong Session máy chủ, trải nghiệm đầy đủ 9 biến thể và tính năng Hint, nhưng kết quả không ghi nhận lâu dài vào CSDL.
     - **Người chơi thành viên (User):** Có tài khoản bảo mật, lưu trữ lịch sử ván đấu, sở hữu ví xu ảo, mở khóa skin vĩnh viễn và cạnh tranh thứ hạng trên Leaderboard.
     - **Quản trị viên (Admin):** Đăng nhập qua cổng riêng, sở hữu toàn quyền quản trị tài khoản, kỷ lục và theo dõi thống kê toàn hệ thống.
  3. Thiết kế chi tiết danh mục RESTful API endpoints: `/api/signup`, `/api/login`, `/api/guest`, `/api/games`, `/api/games/{token}/win`, `/api/games/{token}/loss`, `/api/games/{token}/hint`, `/api/leaderboard`, `/api/best-time`, `/api/shop/buy`, `/api/shop/equip`.

### TUẦN 4: THIẾT KẾ CƠ SỞ DỮ LIỆU QUAN HỆ (ERD & SCHEMA)
- **Mục tiêu:** Xây dựng mô hình dữ liệu chuẩn hóa, quan hệ toàn vẹn và tối ưu hóa tốc độ truy vấn.
- **Công việc đã thực hiện:**
  1. Thiết kế mô hình thực thể mối quan hệ (ERD) và xây dựng cấu trúc cơ sở dữ liệu quan hệ:
     - Bảng `game_modes`: Lưu trữ danh mục 3 chế độ chơi, trường `neighbor_offsets` định dạng JSON chứa ma trận vector xét lân cận.
     - Bảng `difficulties`: Lưu trữ 3 cấp độ khó với các thuộc tính `board_rows`, `board_cols`, `mine_count`; có ràng buộc `CHECK` kiểm tra số mìn hợp lệ.
     - Bảng `users`: Quản lý tài khoản (`username`, `display_name`, `password` băm bcrypt, `role`, `is_locked`, `coins`, `equipped_board_skin`, `equipped_flag_skin`).
     - Bảng `games`: Quản lý từng phiên ván đấu với UUID token, `user_id`, `mode_id`, `difficulty_id`, `status` (`playing`/`won`/`lost`/`rejected`), `started_at` (chính xác mili-giây `datetime(3)`), `finished_at`, `time_ms`.
     - Bảng `records`: Lưu kỷ lục tốt nhất của từng người chơi theo từng cặp `mode_id` + `difficulty_id`; thiết lập unique index (`user_id`, `mode_id`, `difficulty_id`) và composite index (`mode_id`, `difficulty_id`, `best_time_ms`, `achieved_at`) phục vụ truy vấn Leaderboard siêu tốc.
     - Bảng `user_skins`: Lưu danh mục các skin bàn cờ và lá cờ mà từng người chơi đã mở khóa thành công.
     - Bảng hạ tầng Laravel: `sessions`, `password_reset_tokens`, `cache`, `cache_locks`, `jobs`, `failed_jobs`.
  2. Khởi tạo mã nguồn Laravel Migrations và các file Seeders mẫu (`MinefieldSeeder`, `AdminUserSeeder`).

### TUẦN 5: THIẾT KẾ GIAO DIỆN UI/UX ĐA NỀN TẢNG & BỘ SƯU TẬP SKIN
- **Mục tiêu:** Tạo dựng giao diện người dùng hiện đại, sắc nét và khả năng co giãn linh hoạt trên mọi kích thước màn hình.
- **Công việc đã thực hiện:**
  1. Xây dựng Wireframe và thiết kế Prototype giao diện người dùng theo phong cách Tactical / Sci-Fi hiện đại kết hợp đường nét thanh lịch:
     - Màn hình Đăng nhập / Đăng ký: Form tối giản, trực quan, hỗ trợ nút bấm Chơi ngay cho khách vãng lai.
     - Màn hình Lựa chọn Chế độ & Độ khó: Thẻ bài trực quan minh họa quy tắc dò mìn và kích thước bàn cờ.
     - Màn hình Gameplay HUD: Thiết kế đồng hồ đếm mili-giây sắc nét, bộ đếm mìn còn lại, nút bấm thao tác nhanh, nút kích hoạt Gợi ý Hint radar.
  2. Thiết kế giao diện thích ứng đa nền tảng Responsive:
     - **Desktop:** Bố cục 3 cột rộng rãi với Bảng xếp hạng bên cánh, bàn cờ trung tâm và thanh điều khiển.
     - **Tablet / Mobile:** Tự động tổ chức lại bố cục, đưa HUD và bàn cờ lên đầu trang, bổ sung thanh công cụ cảm ứng Mở ô / Cắm cờ (`touch-tool-bar`) chuyên dụng.
  3. Thiết kế bảng màu **7 chủ đề Pastel**: Vàng Kim, Hồng Phấn, Xanh Lá, Xanh Lam, Xanh Tím, Đỏ San Hô, Trắng Ngọc.
  4. Thiết kế bộ sưu tập **26 Skin đồ họa cao cấp**: 13 skin bàn cờ (Cổ điển, Ma trận số, Neon thập niên 80, Gỗ mộc, Thạch anh, Nham thạch, Hoàng gia, Băng hà, Hoa anh đào, Đại dương, Cyberpunk, Đá obsidian, Hoàng hôn) và 13 skin lá cờ định dạng SVG sắc nét.

### TUẦN 6: LẬP TRÌNH ENGINE TRÒ CHƠI VANILLA JAVASCRIPT (`engine.js`)
- **Mục tiêu:** Hoàn thiện engine tính toán pure JavaScript vận hành độc lập hoàn toàn với DOM, đảm bảo độ trễ 0ms.
- **Công việc đã thực hiện:**
  1. Xây dựng mô-đun engine JavaScript thuần độc lập hoàn toàn với cây DOM (không phụ thuộc HTML/CSS), giúp dễ dàng kiểm thử và đảm bảo hiệu năng xử lý tối đa.
  2. Cài đặt thuật toán láng giềng dựa trên ma trận `neighbor_offsets` nạp từ cơ sở dữ liệu:
     - **Cổ điển:** Duyệt 8 ô xung quanh (ô giữa có 8 ô kề, ô góc có 3 ô kề).
     - **Dấu cộng:** Duyệt 4 ô kề cạnh trên/dưới/trái/phải (ô giữa có 4 ô kề, ô góc có 2 ô kề).
     - **Góc chéo:** Duyệt 4 ô đường chéo (ô giữa có 4 ô kề, ô góc có 1 ô kề).
  3. Cài đặt thuật toán sinh mìn an toàn lần click đầu tiên (**Safe First Click**): Khi người chơi bấm ô đầu tiên, engine mới tiến hành rải mìn ngẫu nhiên (Fisher-Yates shuffle), đồng thời loại trừ ô click đầu tiên và toàn bộ láng giềng của nó khỏi danh sách đặt mìn. Đảm bảo ô bấm đầu tiên luôn luôn an toàn và có giá trị bằng 0 để mở loang ngay.
  4. Cài đặt thuật toán loang mở ô trống (**Flood-fill**) bằng hàng đợi BFS, tự động mở tất cả các ô trống liên thông theo đúng quy luật láng giềng của chế độ chơi.
  5. Cài đặt cơ chế Cắm cờ và mở nhanh **Chording**: Cho phép người chơi click vào ô số đã mở để mở nhanh toàn bộ các ô láng giềng chưa cắm cờ nếu số cờ xung quanh đã bằng số hiển thị trên ô; nếu cắm cờ sai thì người chơi sẽ bị nổ mìn ngay lập tức.

### TUẦN 7: LẬP TRÌNH BACKEND LARAVEL: XÁC THỰC, PHIÊN VÁN ĐẤU & LEADERBOARD
- **Mục tiêu:** Xây dựng hệ thống backend bảo mật, quản lý phiên ván đấu và tính năng xếp hạng thời gian thực.
- **Công việc đã thực hiện:**
  1. Xây dựng controller xác thực `MinefieldAuthController`:
     - Đăng ký tài khoản mới: Kiểm tra regex username, mã hóa mật khẩu an toàn bằng thuật toán bcrypt (`Hash::make()`).
     - Đăng nhập người dùng: Xác thực thông tin, tạo session đăng nhập Laravel; áp dụng middleware `throttle:10,1` giới hạn tối đa 10 lần thử/phút nhằm triệt tiêu hoàn toàn nguy cơ tấn công dò vét mật khẩu (brute-force).
     - Chế độ chơi thử Khách: Khởi tạo phiên làm việc tạm thời trong Laravel Session không cần lưu vào CSDL.
  2. Xây dựng controller quản lý ván đấu `MinefieldGameController`:
     - Khởi tạo ván đấu (`POST /api/games`): Sinh mã định danh UUID duy nhất cho ván đấu, lưu mốc thời gian bắt đầu `started_at` chính xác đến mili-giây vào bảng games hoặc session.
     - Xử lý ván thắng (`POST /api/games/{token}/win`): Xác thực token hợp lệ, đối soát thời gian hoàn thành, cập nhật trạng thái ván đấu `won`, tính toán kỷ lục cá nhân tốt nhất.
     - Xử lý ván thua (`POST /api/games/{token}/loss`): Cập nhật trạng thái ván đấu `lost` và ghi nhận thời điểm kết thúc.
  3. Xây dựng API Bảng xếp hạng (`GET /api/leaderboard`): Truy vấn top kỷ lục nhanh nhất theo từng cặp chế độ chơi và độ khó, sắp xếp tăng dần theo `best_time_ms` và thời điểm đạt thành tích `achieved_at`.
  4. Xây dựng API Thành tích cá nhân (`GET /api/best-time`): Trả về thời gian tốt nhất của người chơi hiện tại.

### TUẦN 8: XÂY DỰNG KINH TẾ XU ẢO, SPEED BONUS & GỢI Ý MÌN (HINT)
- **Mục tiêu:** Tăng tính hấp dẫn và chiều sâu chiến thuật cho trò chơi thông qua hệ sinh thái tiền tệ và gợi ý thông minh.
- **Công việc đã thực hiện:**
  1. Xây dựng lớp dịch vụ `SkinCatalog.php` quản trị nền kinh tế xu ảo nội bộ trong trò chơi:
     - Quy chuẩn mức xu thưởng cơ bản khi chiến thắng ván đấu: Cấp Dễ (+30 xu), Cấp Trung bình (+75 xu), Cấp Khó (+180 xu).
     - Cơ chế thưởng khuyến khích cho chế độ biến thể: Khi người chơi chiến thắng ở chế độ Dấu cộng hoặc Góc chéo, hệ thống tự động cộng thêm **+20%** xu cơ bản (Dễ: 36 xu, Trung bình: 90 xu, Khó: 216 xu).
     - Cơ chế Thưởng tốc độ (**Speed Bonus**): Khuyến khích người chơi nâng cao kỹ năng:
       - Hoàn thành ván đấu dưới 30 giây (< 30.000 ms): Thưởng thêm **+100 xu**.
       - Hoàn thành ván đấu từ 30s đến dưới 60 giây (< 60.000 ms): Thưởng thêm **+50 xu**.
       - Hoàn thành ván đấu từ 60s đến dưới 100 giây (< 100.000 ms): Thưởng thêm **+25 xu**.
       - Hoàn thành từ 100 giây trở lên: Không áp dụng thưởng tốc độ (+0 xu).
  2. Xây dựng Hệ thống Gợi ý mìn thông minh (**Hint System**):
     - **Phía Backend (`POST /api/games/{token}/hint`):** Kiểm tra số dư người dùng (yêu cầu tối thiểu 100 xu), sử dụng `DB::transaction()` kết hợp `lockForUpdate()` để trừ 100 xu an toàn tuyệt đối, tránh lỗi trừ âm xu hoặc race condition.
     - **Phía Frontend (`applyHint` trong `engine.js`):** Quét phân tích vùng biên tiếp giáp (frontier) giữa các ô số đã mở và các ô chưa mở, tìm ô chắc chắn chứa mìn chưa cắm cờ và tự động cắm cờ đánh dấu ô đó, giảm bộ đếm số mìn còn lại và kích hoạt hiệu ứng radar phát sáng.

### TUẦN 9: XÂY DỰNG CỬA HÀNG SKIN & PHÒNG THỬ CHIẾN THUẬT 5×5
- **Mục tiêu:** Tạo lập tính năng cá nhân hóa trải nghiệm với kho skin phong phú và cơ chế giao dịch an toàn.
- **Công việc đã thực hiện:**
  1. Mở rộng danh mục trang bị trong `SkinCatalog.php` lên **26 vật phẩm cao cấp**: 13 skin bàn cờ (giá từ 0 đến 900 xu) và 13 skin lá cờ SVG (giá từ 0 đến 700 xu). Mỗi skin sở hữu bảng màu accent và palette chuyên biệt.
  2. Xây dựng controller Cửa hàng `MinefieldShopController`:
     - Lấy danh mục (`GET /api/shop`): Trả về danh sách skin, số dư xu hiện tại, danh sách skin đã sở hữu và skin đang kích hoạt.
     - Mua skin (`POST /api/shop/buy`): Kiểm tra tính hợp lệ của skin, xác thực người chơi chưa sở hữu, kiểm tra đủ số dư xu và thực hiện trừ xu, lưu quyền sở hữu vào bảng `user_skins` trong một `DB::transaction()` duy nhất; tự động trang bị ngay sau khi mua.
     - Trang bị skin (`POST /api/shop/equip`): Cho phép người chơi tự do thay đổi skin bàn cờ và lá cờ trong số các skin đã sở hữu.
  3. Xây dựng giao diện Cửa hàng cao cấp (`shop.blade.php`, `shop.js`):
     - **Tích hợp Phòng Thử Chiến Thuật (Tactical Test Field):** Một bàn cờ tương tác mini 5×5 cho phép người chơi click mở ô, cắm cờ và trải nghiệm trực quan hiệu ứng hiển thị của skin bàn cờ và lá cờ trước khi đưa ra quyết định mua sắm.
     - Cung cấp thanh công cụ tìm kiếm và bộ lọc danh mục (Tất cả, Đã sở hữu, Chưa sở hữu, Bàn cờ, Lá cờ); tính năng Ghim mục tiêu phấn đấu, So sánh trực quan A/B và nút Hoàn tác về trang bị ban đầu.

### TUẦN 10: XÂY DỰNG BẢNG ĐIỀU KHIỂN QUẢN TRỊ VIÊN ADMIN CMS
- **Mục tiêu:** Cung cấp công cụ quản lý toàn diện cho Quản trị viên, bảo vệ an ninh và toàn vẹn dữ liệu.
- **Công việc đã thực hiện:**
  1. Thiết lập cổng đăng nhập quản trị riêng biệt tại đường dẫn `/admin/login`, bảo vệ an toàn giao diện quản lý trước các nỗ lực truy cập trái phép.
  2. Xây dựng Bảng điều khiển Quản trị Minefield Control Room (`MinefieldAdminController.php`, `admin.blade.php`):
     - **Thống kê thời gian thực (Analytics Dashboard):** Tổng số người chơi đăng ký, tổng số ván đấu hoàn tất, tổng số kỷ lục leaderboard, tỷ lệ thắng/thua tổng quan và tỷ lệ thắng chi tiết phân rã theo từng chế độ chơi (Cổ điển, Dấu cộng, Góc chéo).
     - **Quản lý Tài khoản (User Management):** Xem danh sách phân trang (25 bản ghi/trang), thêm mới người dùng, chỉnh sửa thông tin/mật khẩu, xóa tài khoản, Khóa / Mở khóa tài khoản (toggle lock) với cơ chế bảo vệ nghiêm ngặt: không thể khóa hoặc xóa tài khoản admin cuối cùng.
     - **Quản lý Kỷ lục (Record Management):** Xem danh sách kỷ lục phân trang, thêm thủ công kỷ lục, chỉnh sửa thời gian thành tích `best_time_ms` và xóa bỏ các kỷ lục nghi vấn gian lận.
     - **Công cụ Quản trị viên Điều chỉnh Số dư (Admin Give Coins):** Modal trực quan cho phép admin cộng thêm số xu tùy ý hoặc kích hoạt cấp nhanh 999.999 xu cho tài khoản phục vụ mục đích kiểm thử hệ thống.
  3. Cài đặt Middleware `EnsureAccountIsActive`: Ngăn chặn tức thì mọi hành vi thao tác từ tài khoản đã bị admin khóa, tự động đăng xuất phiên làm việc và trả về thông báo lỗi thích hợp.

### TUẦN 11: TÍCH HỢP TOÀN DIỆN CLIENT–SERVER & TỐI ƯU CẢM ỨNG MOBILE
- **Mục tiêu:** Đồng bộ hóa toàn bộ các phân hệ và hoàn thiện trải nghiệm người dùng đa nền tảng.
- **Công việc đã thực hiện:**
  1. Ghép nối hoàn chỉnh luồng dữ liệu hai chiều giữa Blade views, JavaScript Engine phía client (`engine.js`, `game.js`, `api.js`, `ui.js`) và các API Backend của Laravel.
  2. Tối ưu hóa giao diện đa nền tảng Responsive (PC, Tablet, Mobile):
     - Bố cục máy tính để bàn (Desktop): Hiển thị 3 cột tối ưu không gian.
     - Bố cục điện thoại di động & Máy tính bảng: Tự động điều chỉnh xếp tầng, đưa thông tin HUD và bàn cờ lên đầu trang giúp người chơi không cần cuộn trang khi đang thi đấu.
  3. Tối ưu hóa sâu trải nghiệm cảm ứng trên thiết bị di động:
     - Cơ chế cắm cờ bằng thao tác nhấn giữ (Long-press ~380ms) tự động hủy nếu ngón tay người dùng dịch chuyển quá 10px, giúp người chơi cuộn trang thoải mái mà không lo bị cắm cờ nhầm.
     - Thiết lập thuộc tính CSS `touch-action: manipulation` nhằm loại bỏ hoàn toàn độ trễ 300ms của trình duyệt di động và chặn phóng to ngoài ý muốn khi đúp chạm.
     - Khay chứa bàn cờ `.board-wrap` hỗ trợ thanh cuộn ngang mượt mà khi kích thước bàn cờ vượt quá bề rộng màn hình điện thoại.
  4. Tích hợp hệ thống hiệu ứng đồ họa UI Motion (`ui-motion.js`): Hiệu ứng rung lắc toàn màn hình (Screen shake) khi nổ mìn thua cuộc, hiệu ứng pháo hoa ăn mừng (Confetti) khi phá đảo ván đấu, hiệu ứng sóng xung kích radar khi kích hoạt Gợi ý Hint.
  5. Chạy nghiệm thu kiểm thử tích hợp: Đạt **31/31 kiểm thử PHPUnit (197 assertions)** và **23/23 kiểm thử JavaScript Engine**; hoàn thành Báo cáo tiến độ Tuần 11.

### TUẦN 12: KIỂM THỬ TOÀN HỆ THỐNG & GIA CỐ CHỐNG GIAN LẬN TIMER
- **Mục tiêu:** Kiểm toán bảo mật chuyên sâu, vá mọi lỗ hổng gian lận thời gian mili-giây và mở rộng bộ kiểm thử tự động.
- **Công việc đã thực hiện:**
  1. Tiến hành kiểm toán an ninh toàn diện luồng ghi nhận kết quả chiến thắng ván đấu (`POST /api/games/{token}/win`), phát hiện và gia cố đa lớp các lỗ hổng gian lận thời gian:
     - **Chặn thời gian phi lý hoặc không hợp lệ:** Yêu cầu `timeMs` phải là số nguyên dương hợp lệ trong khoảng `min:1` đến `max:2147483647`; thiết lập hằng số `MIN_PLAUSIBLE_TIME_MS = 200 ms` nhằm chặn đứng các yêu cầu gian lận gửi ván thắng siêu tốc (0 ms – 199 ms) ngay sau khi khởi tạo ván đấu (HTTP 422).
     - **Kiểm soát dung sai thời gian máy chủ (`TIME_TOLERANCE_MS = 2.500 ms`):** Máy chủ tính toán khoảng thời gian trôi qua thực tế `elapsedMs = now() - started_at`. Nếu `reportedMs + 2500 < elapsedMs` (client khai gian thời gian ngắn hơn thực tế trên server quá 2,5 giây bù trễ mạng), máy chủ lập tức từ chối kết quả với mã HTTP 422.
     - **Đối chiếu cấu hình ván đấu (`verifyGamePayload`):** Kiểm tra sự trùng khớp tuyệt đối giữa mode và difficulty gửi lên với cấu hình khởi tạo ban đầu gắn với token, ngăn chặn hành vi chơi ván Dễ (thưởng 30 xu) nhưng gửi payload ván Khó (thưởng 180 xu).
     - **Chống tấn công phát lại (Replay Attack):** Mỗi token ván đấu chỉ được phép ghi nhận thắng đúng 1 lần duy nhất; gửi lại lần 2 sẽ bị từ chối với HTTP 409 Conflict (đối với thành viên) hoặc HTTP 404 Not Found (đối với khách do cơ chế `session()->pull()` tự hủy phiên).
     - **Chống tấn công tham chiếu trực tiếp đối tượng không an toàn (IDOR):** Mọi thao tác cập nhật ván đấu đều được gắn chặt với điều kiện `where('token', $token)->where('user_id', $user->id)` kết hợp `lockForUpdate()` trong `DB::transaction()`.
     - **Khóa trạng thái Engine JS phía Client:** Cài đặt cơ chế bảo vệ trạng thái trong `engine.js`, ngăn chặn mọi thao tác mở ô, cắm cờ, chord hay gọi hint sau khi ván đấu đã ở trạng thái thắng hoặc thua.
  2. Xây dựng tệp kiểm thử chuyên biệt `tests/Feature/AntiCheatAndTimerTest.php` gồm 9 kịch bản kiểm thử bảo mật nâng cao và mở rộng `tests/js/engine.test.cjs` lên 25 unit test cases.
  3. Kết quả kiểm thử tự động đạt tuyệt đối 100%: **40/40 tests PHPUnit (259 assertions) PASS** trong 3.71s và **25/25 tests JavaScript Engine PASS**; hoàn thành Báo cáo tiến độ Tuần 12.

### TUẦN 13: ĐÓNG GÓI DOCKER ĐA TẦNG, TỐI ƯU PRODUCTION & TRIỂN KHAI CLOUD
- **Mục tiêu:** Hoàn thiện đóng gói container Docker đạt chuẩn sản xuất, cấu hình máy chủ đám mây Render và CSDL TiDB Cloud Serverless, tạo lập cấu trúc thư mục nộp đồ án chuẩn chỉ theo quy định.
- **Công việc đã thực hiện:**
  1. Đóng gói ứng dụng toàn diện bằng Dockerfile đa tầng (**Multi-stage build**) đạt chuẩn công nghiệp:
     - **Stage 1 (Frontend Asset Builder):** Sử dụng base image `node:20-alpine` gọn nhẹ, nạp `package.json`, cài đặt sạch dependencies qua `npm ci` và thực thi build tài nguyên sản xuất tối ưu bằng Vite 7 (`npm run build`). Xuất bản các asset đã biên dịch và minify ra thư mục `public/build`.
     - **Stage 2 (Production Runtime Server):** Sử dụng base image `php:8.3-apache`. Cài đặt các gói phụ trợ cần thiết (`ca-certificates`, `git`, `unzip`, `libzip-dev`, `libonig-dev`) và biên dịch các PHP extension tối quan trọng: `pdo_mysql`, `mbstring`, `bcmath`, `opcache`, `zip`.
     - Cấu hình máy chủ web Apache: Kích hoạt module `mod_rewrite`, cấu hình lại VirtualHost trỏ DocumentRoot chuẩn xác vào thư mục `/var/www/html/public`, cho phép tệp `.htaccess` của Laravel hoạt động trơn tru.
     - Tối ưu hóa Composer: Thực thi lệnh `composer install --no-dev --optimize-autoloader --prefer-dist` giúp giảm thiểu dung lượng image và tăng tốc độ autoload class PHP.
  2. Lập trình kịch bản khởi chạy container tự động `docker-entrypoint.sh`:
     - Tự động lắng nghe cổng động do môi trường đám mây cấp phát (`$PORT`, mặc định 10000).
     - Khởi tạo và phân quyền ghi đè đầy đủ cho người dùng `www-data` trên các thư mục `storage/` và `bootstrap/cache/`.
     - Cơ chế chờ kết nối Cơ sở dữ liệu (**Database Healthcheck Retry**): Thực hiện vòng lặp thử kết nối tối đa 5 lần trước khi thực thi migrate CSDL nhằm đảm bảo CSDL đám mây đã sẵn sàng tiếp nhận.
     - Tự động chạy `php artisan migrate --force` để đồng bộ cấu trúc bảng trên môi trường production.
     - Tự động nạp dữ liệu danh mục ban đầu qua `php artisan db:seed --class=MinefieldSeeder --force` và khởi tạo tài khoản quản trị viên an toàn từ biến môi trường qua `AdminUserSeeder`.
     - Tự động dọn dẹp và biên dịch bộ nhớ đệm tăng tốc ứng dụng: `php artisan config:cache`, `php artisan route:cache`, `php artisan view:cache`.
     - Khởi động tiến trình web server Apache ở chế độ foreground (`exec apache2-foreground`).
  3. Triển khai thành công hệ thống lên môi trường đám mây (**Cloud Deployment**):
     - **Máy chủ Web Service:** Triển khai trên nền tảng **Render Cloud** (kết nối trực tiếp với kho mã nguồn Git, tự động build theo Dockerfile).
     - **Cơ sở dữ liệu Đám mây:** Kết nối cơ sở dữ liệu **TiDB Cloud Serverless** (tương thích 100% MySQL, hỗ trợ kết nối bảo mật qua giao thức SSL PDO với chứng chỉ `MYSQL_ATTR_SSL_CA=/etc/ssl/certs/ca-certificates.crt`).
     - Thiết lập cấu hình bảo mật môi trường Production: `APP_ENV=production`, `APP_DEBUG=false`, cấu hình tin cậy proxy ngược `$middleware->trustProxies(at: '*')` trong `bootstrap/app.php` và cưỡng bức toàn bộ giao thức kết nối HTTPS `URL::forceScheme('https')` trong `AppServiceProvider.php`.
  4. Xuất bản kịch bản CSDL độc lập `ScriptDataBase_Minefield.sql` chứa toàn bộ định nghĩa bảng, khóa ngoại, ràng buộc kiểm tra và dữ liệu seed mặc định cho local XAMPP và Cloud.
  5. Đóng gói mã nguồn sạch dự án vào tệp `SourceCode.zip` (loại trừ các thư mục rác, vendor và node_modules), hoàn thiện cấu trúc cây thư mục nộp bài chuẩn quy định của Khoa Công nghệ Thông tin.

---

## PHẦN 4: KIẾN TRÚC KỸ THUẬT VÀ CƠ CHẾ NỔI BẬT CỦA HỆ THỐNG

### 4.1. Kiến trúc phân tách Client Engine 0ms & Server Authority
Nhằm giải quyết triệt để bài toán độ trễ mạng trong game dò mìn (vốn đòi hỏi thao tác click mở ô cực nhanh), nhóm đã tách biệt hoàn toàn hai tầng kiến trúc:
- **Tầng Client (`engine.js`):** Toàn bộ trạng thái ván đấu, ma trận ô mìn, phép toán láng giềng, thuật toán loang mở ô trống, cắm cờ, chording và tính toán gợi ý Hint đều được thực thi tức thời ở JavaScript trình duyệt với độ trễ 0ms.
- **Tầng Backend (Laravel 12):** Không can thiệp vào từng click mở ô đơn lẻ mà đóng vai trò thẩm quyền tối cao (Server Authority) quản lý vòng đời ván đấu, cấp token UUID, thẩm định thời gian mili-giây, bảo toàn giao dịch xu/skin và lưu trữ bảng xếp hạng.

### 4.2. Cơ chế chống gian lận thời gian đa tầng (Anti-Cheat Timer)
1. **Cấp phát phiên chơi phía máy chủ:** `POST /api/games` sinh UUID token duy nhất và lưu mốc `started_at` chính xác đến mili-giây.
2. **Validation đầu vào nghiêm ngặt:** Kiểm tra `timeMs` là số nguyên dương hợp lệ trong khoảng 1 đến 2.147.483.647 ms.
3. **Chặn chiến thắng siêu tốc phi lý:** Hằng số `MIN_PLAUSIBLE_TIME_MS = 200 ms` loại bỏ ngay mọi yêu cầu thắng từ 0 đến 199 ms.
4. **Đối chiếu thời gian thực trên máy chủ:** Áp dụng ngưỡng dung sai mạng `TIME_TOLERANCE_MS = 2.500 ms`. Nếu `reportedMs + 2500 < elapsedMs`, máy chủ từ chối kết quả với mã HTTP 422.
5. **Kiểm tra khớp cấu hình ván:** `verifyGamePayload()` đối soát `mode` và `difficulty` gửi kèm, ngăn chặn tráo đổi ván Dễ thành ván Khó.
6. **Chống Replay Attack & IDOR:** Áp dụng `lockForUpdate()` trong `DB::transaction()`, chỉ cho phép token thắng đúng 1 lần; phiên khách tự hủy qua `session()->pull()`.

### 4.3. Nền kinh tế xu ảo, Speed Bonus & Phòng thử chiến thuật 5×5
- **Hệ thống tiền tệ ảo (Virtual Coins):** Tự kiếm qua kỹ năng chiến thắng, không nạp tiền thật: Cấp Dễ (+30 xu), Trung bình (+75 xu), Khó (+180 xu); chế độ biến thể thưởng thêm +20% xu.
- **Thưởng tốc độ (Speed Bonus):** Thắng nhanh dưới 30s (+100 xu), dưới 60s (+50 xu), dưới 100s (+25 xu).
- **Hệ thống Gợi ý mìn thông minh (Hint):** Tiêu tốn 100 xu để tự động cắm cờ vào 1 quả mìn ở vùng biên tiếp giáp ô số đã mở.
- **Cửa hàng 26 Skin cao cấp với Phòng Thử Chiến Thuật 5×5:** Cho phép người chơi trải nghiệm click thử trực quan trước khi mua; giao dịch trừ xu và lưu quyền sở hữu thực hiện an toàn qua `DB::transaction()`.

### 4.4. Trải nghiệm cảm ứng đa nền tảng Responsive tối ưu
- Thiết lập `touch-action: manipulation` loại bỏ độ trễ 300ms và chặn phóng to vô ý.
- Thao tác nhấn giữ (~380ms) cắm cờ tự động hủy khi ngón tay dịch chuyển > 10px, đảm bảo cuộn trang mượt mà.
- Bàn cờ cuộn ngang gọn trong khay chứa `.board-wrap` trên các thiết bị màn hình nhỏ.

---

## PHẦN 5: KẾT QUẢ KIỂM THỬ VÀ ĐÁNH GIÁ CHẤT LƯỢNG

### 5.1. Bảng chi tiết Test Cases Kiểm thử Tự động Backend Laravel (PHPUnit)

| Mã TC | Tệp kiểm thử | Nội dung kiểm thử | Kết quả |
| :---: | :--- | :--- | :---: |
| **TC-B-01** | AntiCheatAndTimerTest | Chặn timeMs <= 0, số âm, và < 200 ms (MIN_PLAUSIBLE_TIME_MS) | **PASS (HTTP 422)** |
| **TC-B-02** | AntiCheatAndTimerTest | Kiểm tra ranh giới dung sai máy chủ 2.500 ms (7.499ms từ chối, 7.500ms chấp nhận) | **PASS** |
| **TC-B-03** | AntiCheatAndTimerTest | Chống gian lận thời gian phiên chơi Khách vãng lai (Guest) | **PASS (HTTP 422)** |
| **TC-B-04** | AntiCheatAndTimerTest | Chống tấn công phát lại Replay token ván thắng (Thành viên) | **PASS (HTTP 409)** |
| **TC-B-05** | AntiCheatAndTimerTest | Chống tấn công phát lại Replay token phiên Khách (Guest) | **PASS (HTTP 404)** |
| **TC-B-06** | AntiCheatAndTimerTest | Chống gửi /win hoặc /hint sau khi ván đã bị thua /loss | **PASS (HTTP 409)** |
| **TC-B-07** | AntiCheatAndTimerTest | Chống giả mạo thay đổi mode/difficulty trong payload | **PASS (HTTP 422)** |
| **TC-B-08** | AntiCheatAndTimerTest | Chống chiếm dụng token của người khác (IDOR) | **PASS (HTTP 404)** |
| **TC-B-09** | AntiCheatAndTimerTest | Bảo toàn kỷ lục cá nhân tốt nhất (chỉ cập nhật khi thời gian nhanh hơn) | **PASS** |
| **TC-B-10** | MinefieldFlowTest | Render đầy đủ các trang web kèm tài nguyên frontend tương ứng | **PASS** |
| **TC-B-11** | MinefieldFlowTest | Nạp động danh mục game_modes và difficulties từ cơ sở dữ liệu | **PASS** |
| **TC-B-12** | MinefieldFlowTest | Đăng ký tài khoản mới và chống trùng lặp username | **PASS** |
| **TC-B-13** | MinefieldFlowTest | Đăng nhập băm mật khẩu bcrypt và giới hạn throttle:10,1 chống brute-force | **PASS** |
| **TC-B-14** | MinefieldFlowTest | Phân quyền cổng đăng nhập quản trị viên riêng biệt /admin/login | **PASS** |
| **TC-B-15** | MinefieldFlowTest | Middleware EnsureAccountIsActive chặn và đăng xuất tài khoản bị khóa | **PASS** |
| **TC-B-16** | MinefieldFlowTest | Khởi tạo phiên chơi game thành viên và cấp token UUID | **PASS** |
| **TC-B-17** | MinefieldFlowTest | Khởi tạo phiên chơi game khách vãng lai trong Session | **PASS** |
| **TC-B-18** | MinefieldFlowTest | Lưu kỷ lục thành tích Leaderboard chính xác đến mili-giây | **PASS** |
| **TC-B-19** | MinefieldFlowTest | Truy vấn bảng xếp hạng Leaderboard phân tách theo mode và difficulty | **PASS** |
| **TC-B-20** | MinefieldFlowTest | Quản trị viên CRUD tài khoản người dùng và bảo vệ admin cuối cùng | **PASS** |
| **TC-B-21** | MinefieldFlowTest | Quản trị viên CRUD kỷ lục Leaderboard | **PASS** |
| **TC-B-22** | MinefieldFlowTest | Quản trị viên điều chỉnh số dư xu người dùng (Give Coins) | **PASS** |
| **TC-B-23** | ShopAndCurrencyTest | Cộng xu thưởng theo cấp độ khó (Dễ: 30, TB: 75, Khó: 180 xu) | **PASS** |
| **TC-B-24** | ShopAndCurrencyTest | Thưởng thêm +20% xu cho chế độ biến thể (Dấu cộng, Góc chéo) | **PASS** |
| **TC-B-25** | ShopAndCurrencyTest | Tính thưởng tốc độ Speed Bonus theo các mốc <30s, <60s, <100s | **PASS** |
| **TC-B-26** | ShopAndCurrencyTest | Xác thực trừ 100 xu khi dùng gợi ý Hint trong DB::transaction | **PASS** |
| **TC-B-27** | ShopAndCurrencyTest | Từ chối dùng gợi ý Hint khi số dư tài khoản không đủ 100 xu | **PASS (HTTP 422)** |
| **TC-B-28** | ShopAndCurrencyTest | Nạp đầy đủ danh mục 26 skin và trạng thái sở hữu từ SkinCatalog | **PASS** |
| **TC-B-29** | ShopAndCurrencyTest | Mua skin an toàn, trừ xu chính xác và lưu vào user_skins qua DB transaction | **PASS** |
| **TC-B-30** | ShopAndCurrencyTest | Trang bị skin đã sở hữu và đồng bộ trên giao diện bàn chơi | **PASS** |

> **Tổng kết kiểm thử Backend Laravel:** **40/40 tests PASSED (259 assertions)** hoàn thành trong 3.71 giây. Không có bài kiểm thử nào bị lỗi hoặc bị bỏ qua.

### 5.2. Kết quả Kiểm thử Độc lập Engine JavaScript (Node.js)
Thực thi lệnh kiểm thử độc lập: `node tests/js/engine.test.cjs`:
- **Thuật toán láng giềng (Neighbors):** 3/3 tests PASSED (Cổ điển 8 ô, Dấu cộng 4 ô, Góc chéo 4 ô).
- **Thuật toán sinh mìn an toàn (Mine placement):** 10/10 tests PASSED (Đủ 9 biến thể 3 chế độ × 3 độ khó + kiểm tra ô góc, click đầu luôn an toàn, ô đầu ra số 0, đủ số mìn).
- **Thuật toán loang ô trống (Flood-fill):** 2/2 tests PASSED (Loang đúng theo láng giềng từng chế độ, bảo vệ không mở ô cắm cờ).
- **Cắm cờ và mở nhanh (Flags & Chord):** 3/3 tests PASSED (Tăng/giảm đếm mìn, mở nhanh khi đủ cờ, cắm cờ sai gây nổ mìn).
- **Phát hiện thắng/thua (Win/Lose):** 3/3 tests PASSED (Mở hết ô an toàn -> thắng, bấm trúng mìn -> thua, reset về trạng thái ready).
- **Thuật toán Gợi ý mìn (Hint):** 2/2 tests PASSED (`applyHint` tìm đúng mìn vùng biên, tự cắm cờ, hoạt động khi bàn đang ready).
- **Bảo vệ trạng thái (Edge cases & State locks):** 2/2 tests PASSED (Khóa hoàn toàn thao tác mở ô/cắm cờ/chord/hint sau khi ván thắng/thua; không mở trực tiếp ô đã cắm cờ).

> **Tổng kết kiểm thử JavaScript Engine:** **25/25 tests PASSED** tuyệt đối.

---

## PHẦN 6: BẢNG ĐỐI CHIẾU PHIẾU ĐĂNG KÝ ĐỀ TÀI VỚI SẢN PHẨM THỰC TẾ

| Hạng mục đăng ký | Trạng thái thực tế | Bằng chứng mã nguồn / Kiểm thử | Nhận xét đánh giá |
| :--- | :---: | :--- | :--- |
| **1. Chơi 3 chế độ × 3 độ khó** | **HOÀN THÀNH 100%** | `engine.js`, `game.js`, `MinefieldSeeder.php` | Đầy đủ 9 biến thể, xử lý mượt mà 0ms bằng JS Engine. |
| **2. Đo thời gian & Chống gian lận** | **HOÀN THÀNH 100%** | `MinefieldGameController.php`, `AntiCheatAndTimerTest.php` | Cấp UUID token, kiểm soát dung sai 2.500ms, chặn <200ms, chống replay & IDOR. |
| **3. Bảng xếp hạng (Leaderboard)** | **HOÀN THÀNH 100%** | bảng `records`, API `/api/leaderboard`, `MinefieldGameController.php` | Lọc theo chế độ và độ khó, xếp hạng chính xác mili-giây. |
| **4. Xác thực & Phân quyền** | **HOÀN THÀNH 100%** | `MinefieldAuthController.php`, `EnsureAccountIsActive`, `throttle:10,1` | Hỗ trợ đăng ký, đăng nhập băm mật khẩu, session khách, chống brute-force. |
| **5. Quản trị Admin CMS (/admin)** | **HOÀN THÀNH 100%** | `MinefieldAdminController.php`, `resources/views/minefield/admin.blade.php` | Dashboard thống kê, CRUD tài khoản, khóa/mở khóa, CRUD kỷ lục, Give Coins. |
| **6. Đóng gói Docker & Deploy Cloud** | **HOÀN THÀNH 100%** | `Dockerfile`, `docker-entrypoint.sh`, Render + TiDB Cloud | Docker multi-stage build, auto migrate/seed, kết nối SSL TiDB Cloud. |
| **7. Thuật toán Gợi ý mìn (Hint System)** | **HOÀN THÀNH 100%** | `engine.js` (`applyHint`), API `/hint` | Quét mìn vùng biên thông minh, hiệu ứng radar, trừ 100 xu an toàn qua DB::transaction. |
| **8. Không hỗ trợ Multiplayer** | **ĐÚNG CAM KẾT 100%** | Kiến trúc Single Player | Tập trung tối ưu trải nghiệm chơi đơn và đua top qua Leaderboard. |
| **9. Không thanh toán tiền thật** | **ĐÚNG CAM KẾT 100%** | Hệ thống Xu ảo nội bộ (Virtual Coins) | Kiếm xu qua kỹ năng chiến thắng và thưởng tốc độ Speed Bonus. |

---

## PHẦN 7: KHAI BÁO SỬ DỤNG AI & PHÂN CÔNG ĐÓNG GÓP

### 7.1. Báo cáo sử dụng công cụ Trí tuệ Nhân tạo (AI)
- **Các công cụ AI được sử dụng:** ChatGPT, Claude, Gemini, GitHub Copilot.
- **Phạm vi áp dụng AI:** Hỗ trợ phân tích ca kiểm thử biên (edge cases), gợi ý kịch bản test case cho PHPUnit và Node.js test runner, hỗ trợ tra cứu cú pháp CSS hiệu ứng UI Motion, rà soát cấu hình Dockerfile đa tầng và hỗ trợ định dạng báo cáo.
- **Cam kết học thuật:** Nhóm cam kết không sao chép thụ động mã nguồn AI; toàn bộ mã nguồn đều được cả hai thành viên tự tay kiểm tra, biên dịch, chạy kiểm thử thực tế và nắm vững 100% nguyên lý hoạt động để bảo vệ trước Hội đồng chấm thi.

### 7.2. Bảng phân công nhiệm vụ & Tỷ lệ đóng góp thực tế (Tuần 1 – Tuần 13)

| Họ và tên thành viên | MSSV / Lớp | Nhiệm vụ chính đã đảm nhiệm | Tỷ lệ đóng góp |
| :--- | :--- | :--- | :---: |
| **Nguyễn Phan Thiên Phước** | 25002451<br>25C2-LTM1 | - Thiết kế kiến trúc Laravel 12 MVC & cơ sở dữ liệu MySQL / TiDB Cloud.<br>- Lập trình hệ thống Xác thực, Phân quyền, Session khách và chống brute-force.<br>- Xây dựng RESTful API, luồng chống gian lận thời gian mili-giây (`verifyTime`).<br>- Lập trình dịch vụ `SkinCatalog`, kinh tế xu, Speed Bonus và giao dịch `DB::transaction`.<br>- Xây dựng trang Quản trị Admin CMS (Dashboard thống kê, CRUD user/record, Give Coins).<br>- Viết bộ kiểm thử `AntiCheatAndTimerTest.php`, đóng gói Dockerfile và Deploy Cloud (Render + TiDB). | **50%** |
| **Tô Nguyễn Hoàng An** | 25002441<br>25C2-LTM1 | - Lập trình Engine game Vanilla JS (`engine.js`): 3 chế độ × 3 độ khó, Safe First Click, Flood-fill, Chording.<br>- Xây dựng thuật toán Gợi ý mìn vùng biên (`applyHint`) và hiệu ứng radar quét mìn.<br>- Thiết kế giao diện Blade templates, hệ thống 7 theme Pastel và bộ sưu tập 26 Skin SVG.<br>- Tối ưu hóa giao diện Responsive đa nền tảng (PC/Tablet/Mobile) và tương tác cảm ứng mobile.<br>- Xây dựng giao diện Cửa hàng Skin kèm Phòng Thử Chiến Thuật 5×5.<br>- Viết bộ kiểm thử `engine.test.cjs` (25 unit tests) và phụ trách tài liệu báo cáo, slide. | **50%** |

---

## PHẦN 8: QUY CHUẨN ĐÓNG GÓI SẢN PHẨM NỘP ĐỒ ÁN CHUYÊN NGÀNH

Tuân thủ nghiêm ngặt theo quy định nộp đồ án của Khoa Công nghệ Thông tin, toàn bộ sản phẩm đồ án chuyên ngành được tổ chức theo cấu trúc thư mục chuẩn hóa như sau:

**Tên Folder chính:** `Nguyen_Phan_Thien_Phuoc_To_Nguyen_Hoang_An` (Viết liền không dấu tiếng Việt).

**Cấu trúc các thư mục con bên trong:**
1. **`PhieuDangKyDeTai/`**: Chứa tập tin phiếu đăng ký đề tài định dạng Word và PDF (`PhieuDangKyDeTai.docx`, `PhieuDangKyDeTai.pdf`).
2. **`BaoCao/`**: Chứa tập tin báo cáo tiến độ và tổng kết định dạng Word và PDF (`BaoCao.docx`, `BaoCao.pdf`).
3. **`SourceCode/`**: Chứa mã nguồn dự án nén sạch (`SourceCode.zip` / `SourceCode.rar`) và Kịch bản Cơ sở dữ liệu độc lập (`ScriptDataBase_Minefield.sql`).
4. **`TaiLieu/`**: Chứa tài liệu hướng dẫn cài đặt và giải thích kiến trúc hệ thống định dạng Word (`TaiLieuHuongDan.docx`).
5. **`Slide/`**: Chứa slide trình bày báo cáo đồ án định dạng PowerPoint (`SlideBaoCao.pptx`).
6. **`VideoDemo/`**: Chứa video quay làm mẫu đầy đủ các chức năng của ứng dụng định dạng MP4 (`DemoSanPham.mp4`).

**Tệp nén tổng thể bàn giao:** `Nguyen_Phan_Thien_Phuoc_To_Nguyen_Hoang_An.rar` (hoặc `.zip`).

---

## PHẦN 9: KẾ HOẠCH CHO CÁC TUẦN TIẾP THEO (TUẦN 14 – TUẦN 15)
- **Tuần 14:** Rà soát toàn bộ quyển Báo cáo Đồ án Chuyên ngành tổng kết, kiểm tra căn lề, font chữ, bảng biểu theo chuẩn biểu mẫu khoa CNTT; hoàn thiện Slide thuyết trình và quay video demo chức năng sản phẩm.
- **Tuần 15:** Chạy thử nghiệm nghiệm thu tổng thể trên môi trường Cloud (Render) và Local (XAMPP), chuẩn bị kịch bản bảo vệ trước Hội đồng chấm thi.

---

## PHẦN 10: XÁC NHẬN CỦA GIẢNG VIÊN HƯỚNG DẪN

**Nhận xét của Giảng viên hướng dẫn:**  
.................................................................................................................................................................................................  
.................................................................................................................................................................................................  
.................................................................................................................................................................................................  

**Chữ ký của Giảng viên hướng dẫn:**  
*(Ký và ghi rõ họ tên)*  




**ThS. Mai Chiếm Tuấn**
