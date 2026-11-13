# BỘ GIÁO DỤC VÀ ĐÀO TẠO
# TRƯỜNG CAO ĐẲNG LÝ TỰ TRỌNG TP. HỒ CHÍ MINH
## KHOA CÔNG NGHỆ THÔNG TIN

---

# HƯỚNG DẪN KIỂM TRA HỆ THỐNG (SYSTEM VERIFICATION & ACCEPTANCE GUIDE)
### ĐỀ TÀI: XÂY DỰNG WEB GAME MINESWEEPER ĐA CHẾ ĐỘ VÀ HỆ THỐNG QUẢN TRỊ BẰNG LARAVEL

- **Giảng viên hướng dẫn:** ThS. Mai Chiếm Tuấn
- **Sinh viên thực hiện:**
  1. **Nguyễn Phan Thiên Phước** — MSSV: **25002451** — Lớp: **25C2-LTM1** (Backend Laravel & Deploy Cloud)
  2. **Tô Nguyễn Hoàng An**       — MSSV: **25002441** — Lớp: **25C2-LTM1** (Frontend JS Engine, UI/UX & Testing)
- **Thời điểm nghiệm thu:** Hoàn thiện đến hết Tuần 13 (Năm học 2025 – 2026 / 2026 – 2027)

---

## 1. MỤC ĐÍCH VÀ PHẠM VI TÀI LIỆU
Tài liệu này cung cấp **kịch bản kiểm tra nghiệm thu hệ thống (Checklist)** chi tiết từng bước dành cho Giảng viên hướng dẫn, Hội đồng chấm thi hoặc người đánh giá để thẩm định toàn bộ các tính năng, hiệu năng và tính bảo mật của sản phẩm đồ án theo đúng Phiếu đăng ký đề tài.

---

## 2. THÔNG TIN MÔI TRƯỜNG & TÀI KHOẢN KIỂM THỬ

| Thông số | Giá trị thiết lập kiểm thử | Ghi chú |
| :--- | :--- | :--- |
| **Địa chỉ ứng dụng (Local)** | `http://127.0.0.1:8000` (hoặc `http://localhost/prjMinesweeper/public`) | Môi trường XAMPP / PHP Artisan Serve |
| **Cơ sở dữ liệu** | MySQL `>= 8.0` / TiDB Cloud Serverless | Tên database: `prj_minesweeper` |
| **Tài khoản Quản trị viên (Admin)** | **Email:** `admin@minesweeper.local`<br>**Mật khẩu:** `Admin@123456` | Đăng nhập tại cổng `/admin/login` |
| **Tài khoản Người chơi mẫu (User)** | **Email:** `test@example.com`<br>**Mật khẩu:** `Password@123456` | Có thể tự tạo tài khoản mới qua form Sign Up |
| **Phiên Khách vãng lai (Guest)** | Không cần tài khoản | Nhấp nút **Play as Guest** trên trang chủ |

---

## 3. QUY TRÌNH CHUẨN BỊ MÔI TRƯỜNG TRƯỚC KHI KIỂM TRA

### Bước 1: Khởi động dịch vụ XAMPP
- Mở **XAMPP Control Panel**, nhấn **Start** cho hai dịch vụ **Apache** và **MySQL**.

### Bước 2: Cài đặt và cập nhật phụ thuộc
- Mở PowerShell tại thư mục gốc của dự án `C:\xampp\htdocs\prjMinesweeper`:
  ```powershell
  composer install
  ```

### Bước 3: Khởi tạo dữ liệu sạch (Fresh Database & Seeders)
- Chạy lệnh sau để làm mới cơ sở dữ liệu và nạp toàn bộ danh mục 3 chế độ, 3 độ khó, 26 skin và tài khoản admin:
  ```powershell
  php artisan migrate:fresh --seed
  ```

### Bước 4: Khởi chạy máy chủ Web
  ```powershell
  php artisan serve
  ```
- Truy cập trình duyệt web (Google Chrome / Microsoft Edge / Safari) tại: `http://127.0.0.1:8000`.

---

## 4. BẢNG KỊCH BẢN KIỂM TRA CHỨC NĂNG CHI TIẾT (FUNCTIONAL TEST CASES)

### TC-01: Kiểm tra Xác thực & Phân quyền (Auth & Guest Mode)
| Bước | Thao tác thực hiện | Kết quả mong đợi | Đánh giá |
| :---: | :--- | :--- | :---: |
| 1 | Truy cập `http://127.0.0.1:8000/`. Nhấp tab **Sign Up**. Điền Tên: `Nguyen Van A`, Email: `nva@test.com`, Password: `Password@123`, Confirm: `Password@123`. Bấm **Create Account**. | Tạo tài khoản thành công, mật khẩu băm `bcrypt` trong CSDL, hệ thống tự động đăng nhập và chuyển sang trang chọn chế độ (`/modes`). | ĐẠT |
| 2 | Nhấp biểu tượng tài khoản góc trên bên phải, bấm **Logout**. | Đăng xuất an toàn, hủy session, quay về trang đăng nhập (`/`). | ĐẠT |
| 3 | Tại trang chủ, bấm nút **Play as Guest**. | Khởi tạo phiên khách trong Session máy chủ (`minefield.guest`), chuyển ngay sang trang `/modes` mà không cần nhập mật khẩu. | ĐẠT |
| 4 | Đăng nhập tài khoản với mật khẩu sai 10 lần liên tiếp. | Sau 10 lần sai, hệ thống kích hoạt middleware `throttle:10,1`, trả về mã lỗi HTTP 429 và thông báo quá số lần thử. | ĐẠT |

---

### TC-02: Kiểm tra 3 Chế độ chơi & 3 Cấp độ khó (9 Biến thể)
| Bước | Thao tác thực hiện | Kết quả mong đợi | Đánh giá |
| :---: | :--- | :--- | :---: |
| 1 | Chọn **Classic** + **Easy** (9×9, 10 mìn). Bấm **Start Game**. | Bàn cờ 9×9 hiển thị, đồng hồ đếm giờ chạy, số mìn hiển thị `10`. Mở một ô số: số đếm hiển thị tổng mìn trong **8 ô xung quanh**. | ĐẠT |
| 2 | Quay lại `/modes`, chọn **Plus** + **Medium** (12×12, 22 mìn). Bấm **Start Game**. | Bàn cờ 12×12 hiển thị, số mìn `22`. Mở ô số: số đếm chỉ tính **4 ô kề cạnh (Trên, Dưới, Trái, Phải)**, bỏ qua góc chéo. | ĐẠT |
| 3 | Quay lại `/modes`, chọn **Corner** + **Hard** (16×16, 40 mìn). Bấm **Start Game**. | Bàn cờ 16×16 hiển thị, số mìn `40`. Mở ô số: số đếm chỉ tính **4 ô đường chéo**, bỏ qua ô kề cạnh. | ĐẠT |

---

### TC-03: Kiểm tra Thuật toán Safe First Click & Loang ô trống (Flood-fill)
| Bước | Thao tác thực hiện | Kết quả mong đợi | Đánh giá |
| :---: | :--- | :--- | :---: |
| 1 | Bắt đầu ván mới ở bất kỳ chế độ nào. Nhấp chuột trái vào **bất kỳ một ô nào** (kể cả ô góc hoặc ô giữa). | **Tuyệt đối không bao giờ nổ mìn ở lần nhấp đầu tiên**. Ô được nhấp luôn luôn là ô số 0. | ĐẠT |
| 2 | Quan sát hiện tượng mở ô khi ô đầu tiên là số 0. | Thuật toán Flood-fill tự động loang mở rộng liên tục toàn bộ các ô láng giềng số 0 kề cận và dừng lại ở đường biên số. Phản hồi **0ms tức thì**. | ĐẠT |

---

### TC-04: Kiểm tra Cắm cờ, Gỡ cờ và Thao tác mở nhanh (Chording)
| Bước | Thao tác thực hiện | Kết quả mong đợi | Đánh giá |
| :---: | :--- | :--- | :---: |
| 1 | Nhấp **chuột phải** vào một ô chưa mở. | Biểu tượng lá cờ xuất hiện trên ô, số đếm mìn còn lại trên thanh HUD giảm đi 1 đơn vị. | ĐẠT |
| 2 | Nhấp **chuột phải** lần nữa vào ô đã cắm cờ. | Lá cờ biến mất, số mìn trên HUD tăng lại 1 đơn vị. | ĐẠT |
| 3 | Tìm một ô đã mở có hiển thị số (ví dụ số 1). Cắm 1 lá cờ vào đúng vị trí mìn bên cạnh nó. Sau đó **nhấp đúp chuột trái** hoặc **nhấn đồng thời 2 phím chuột (Left + Right Click)** vào ô số 1. | Thao tác **Chord** mở đồng loạt toàn bộ các ô an toàn xung quanh ô số 1 ngay tức khắc (0ms). | ĐẠT |
| 4 | Cố ý cắm cờ vào một ô an toàn (cắm cờ sai), sau đó thực hiện Chord vào ô số kế bên. | Hệ thống phát hiện cắm cờ sai, mìn lập tức phát nổ, ván game kết thúc với trạng thái Thua (Lost), làm lộ toàn bộ vị trí mìn. | ĐẠT |

---

### TC-05: Kiểm tra Thao tác trên Di động & Tablet (Màn hình cảm ứng)
| Bước | Thao tác thực hiện | Kết quả mong đợi | Đánh giá |
| :---: | :--- | :--- | :---: |
| 1 | Bật chế độ giả lập thiết bị di động (F12 trong trình duyệt, chọn iPhone 14 hoặc iPad). | Bàn cờ tự động co giãn tỷ lệ vừa vặn màn hình. Xuất hiện thanh điều khiển cảm ứng ở dưới gồm 2 nút: **Open Mode** và **Flag Mode**. | ĐẠT |
| 2 | Nhấp chọn nút **Flag Mode** và chạm vào một ô bất kỳ. | Ô được chạm lập tức được cắm cờ an toàn mà không bị mở ô. | ĐẠT |
| 3 | Chuyển lại **Open Mode**, thực hiện thao tác **nhấn giữ ngón tay ~380ms** trên một ô chưa mở. | Sau 380ms, ô tự động cắm cờ kèm hiệu ứng phản hồi. Nếu vừa nhấn vừa cuộn trang (swipe), thao tác tự động hủy bỏ. | ĐẠT |

---

### TC-06: Kiểm tra Tính năng Gợi ý mìn (Hint System – 100 Xu)
| Bước | Thao tác thực hiện | Kết quả mong đợi | Đánh giá |
| :---: | :--- | :--- | :---: |
| 1 | Bắt đầu ván chơi với tài khoản có số dư `< 100 xu` (hoặc tài khoản mới). Nhấp vào nút **Hint (100 xu)** hoặc bấm phím **H**. | Hệ thống không trừ xu, hiển thị thông báo toast: *"Not enough coins for a hint."* | ĐẠT |
| 2 | Dùng tài khoản có `>= 100 xu`. Bấm nút **Hint** (hoặc phím **H**). | Server trừ chính xác 100 xu trong `DB::transaction`. Client tự động cắm cờ vào 1 ô mìn thuộc **vùng biên (Frontier)**, kích hoạt **hiệu ứng sóng radar tím (radar pulse)** lan tỏa. | ĐẠT |
| 3 | Sau khi ván game đã thắng hoặc thua, thử bấm nút Hint hoặc gửi API `/hint`. | Hệ thống từ chối (middleware `EnsureActiveGame` chặn vì trạng thái game không còn là `playing`). | ĐẠT |

---

### TC-07: Kiểm tra Kinh tế Xu thưởng & Thưởng tốc độ (Speed Bonus)
| Bước | Thao tác thực hiện | Kết quả mong đợi | Đánh giá |
| :---: | :--- | :--- | :---: |
| 1 | Chơi và chiến thắng ván **Easy - Classic** với thời gian **25 giây** (< 30s). | Nhận: 30 xu (cơ bản) + 100 xu (Speed Bonus <30s) = **130 Xu**. Hộp thoại Victory hiển thị chi tiết bảng phân rã xu. | ĐẠT |
| 2 | Chơi và chiến thắng ván **Medium - Plus** với thời gian **55 giây** (< 60s). | Nhận: 75 xu (cơ bản) + 15 xu (+20% biến thể Plus) + 50 xu (Speed Bonus <60s) = **140 Xu**. | ĐẠT |
| 3 | Chơi và chiến thắng ván **Hard - Corner** với thời gian **120 giây** (≥ 100s). | Nhận: 180 xu (cơ bản) + 36 xu (+20% biến thể Corner) + 0 xu (không có thưởng tốc độ) = **216 Xu**. | ĐẠT |

---

### TC-08: Kiểm tra Cửa hàng Skin & Phòng Thử Chiến Thuật 5×5
| Bước | Thao tác thực hiện | Kết quả mong đợi | Đánh giá |
| :---: | :--- | :--- | :---: |
| 1 | Vào menu **Shop** (`/shop`). Quan sát **Phòng Thử Chiến Thuật 5×5**. | Bàn thử 5×5 tương tác đầy đủ: cho phép nhấp mở ô, cắm cờ để xem trước hiệu ứng phối hợp giữa Bàn cờ và Lá cờ. Bấm nút Reset để hoàn tác về trạng thái thực tế. | ĐẠT |
| 2 | Nhấp biểu tượng **Ghim (Pin)** vào một skin giá 500 xu. | Hệ thống hiển thị bảng ước tính số ván thắng cần đạt ở độ khó Easy, Medium và Hard để đủ tiền mua skin. | ĐẠT |
| 3 | Dùng tài khoản có đủ xu, bấm **Unlock** mua skin *Matrix Board* (100 xu). | Giao dịch thực hiện trong `DB::transaction`, trừ chính xác 100 xu, skin chuyển sang trạng thái "Đã sở hữu" và tự động trang bị. | ĐẠT |
| 4 | Vào lại bàn chơi `/game`. | Giao diện bàn cờ áp dụng ngay giao diện *Matrix Board* vừa mua. | ĐẠT |

---

### TC-09: Kiểm tra Bảng xếp hạng Kỷ lục (Leaderboard)
| Bước | Thao tác thực hiện | Kết quả mong đợi | Đánh giá |
| :---: | :--- | :--- | :---: |
| 1 | Mở modal **Leaderboard**. Chọn lọc theo chế độ *Classic* và độ khó *Easy*. | Bảng xếp hạng hiển thị danh sách người chơi có thành tích tốt nhất, hiển thị chính xác đến mili-giây (ví dụ: `18.452s`). | ĐẠT |
| 2 | Nếu hai người chơi có cùng thời gian giải (ví dụ cùng 20.100s), người xác lập kỷ lục trước (`achieved_at` trước) sẽ được xếp hạng trên. | Thuật toán xếp hạng so sánh `best_time_ms` tăng dần, sau đó so sánh `achieved_at` định dạng `Y-m-d H:i:s.v`. | ĐẠT |

---

### TC-10: Kiểm tra Cổng Quản trị Admin CMS (/admin)
| Bước | Thao tác thực hiện | Kết quả mong đợi | Đánh giá |
| :---: | :--- | :--- | :---: |
| 1 | Truy cập `/admin/login`. Nhập `admin@minesweeper.local` / `Admin@123456`. | Đăng nhập thành công, chuyển hướng vào `/admin`. Session lưu cờ `is_admin = true`. | ĐẠT |
| 2 | Xem Control Room Dashboard. | Hiển thị 4 thẻ KPI (Total Users, Games Played, Win Rate, Leaderboard Records) và bảng thống kê chi tiết tỷ lệ thắng theo 3 chế độ. | ĐẠT |
| 3 | Trong danh sách người dùng, bấm nút **Lock** một tài khoản bất kỳ. Mở trình duyệt ẩn danh đăng nhập tài khoản đó và bấm chơi game. | Tài khoản bị ngắt session lập tức, middleware `EnsureAccountIsActive` chặn không cho gửi kết quả. Bấm **Unlock** thì tài khoản hoạt động lại bình thường. | ĐẠT |
| 4 | Thử bấm nút khóa chính tài khoản admin đang đăng nhập. | Hệ thống chặn không cho phép tự khóa tài khoản quản trị viên hiện tại. | ĐẠT |
| 5 | Bấm nút **Give Coins** trên một người dùng, chọn nút cộng nhanh **+5.000 xu**. Bấm xác nhận. | Số dư xu của tài khoản tăng thêm 5.000 xu ngay lập tức trong CSDL. | ĐẠT |
| 6 | Trong bảng Records, bấm **Delete** một kỷ lục bất thường. | Kỷ lục bị xóa khỏi cơ sở dữ liệu, Bảng xếp hạng tự động cập nhật lại thứ hạng người chơi. | ĐẠT |

---

## 5. BẢNG KỊCH BẢN KIỂM TRA BẢO MẬT & PHÒNG CHỐNG GIAN LẬN

| Kịch bản kiểm tra | Kỹ thuật tấn công giả lập | Cơ chế phòng thủ của hệ thống | Kết quả |
| :--- | :--- | :--- | :---: |
| **Gửi Token giả mạo (Fake Token)** | Dùng Postman gửi `POST /api/games/invalid-uuid/win` | Middleware `EnsureActiveGame` tìm token không thấy trong DB -> Trả về lỗi **HTTP 404 Not Found**. | ĐẠT |
| **Tấn công Replay kết quả (Replay Attack)** | Dùng lại Token của một ván đã kết thúc (`won` hoặc `lost`) để gửi lại kết quả thắng | Middleware `EnsureActiveGame` kiểm tra `status != 'playing'` -> Từ chối lập tức với lỗi **HTTP 409 Conflict**. | ĐẠT |
| **Gian lận thời gian siêu tốc (< 200ms)** | Client gửi `client_time_ms = 50ms` (tool hack bấm tức thì) | Hàm `verifyTime()` kiểm tra điều kiện $t < 200\text{ ms}$ -> Từ chối ghi nhận kỷ lục, trả về **HTTP 422**. | ĐẠT |
| **Hack sửa đồng hồ client (Clock Drift)** | Client can thiệp biến JavaScript gửi `client_time_ms = 10.000ms`, nhưng thực tế máy chủ ghi nhận ván chơi đã kéo dài 30.000ms | Hàm `verifyTime()` so sánh sai lệch $|t_{\text{server}} - t_{\text{client}}| = 20.000\text{ ms} > 2.500\text{ ms}$ (ngưỡng dung sai) -> Từ chối ghi nhận kỷ lục, trả về **HTTP 422**. | ĐẠT |
| **Tấn công Race Condition số dư xu** | Dùng script gửi đồng thời 10 request `POST /api/games/{token}/hint` trong cùng 1 mili-giây | Controller sử dụng `DB::transaction()` kết hợp `lockForUpdate()`, thực thi tuần tự từng giao dịch, không bị lỗi âm xu hoặc double-spend. | ĐẠT |

---

## 6. BIÊN BẢN TỔNG HỢP NGHIỆM THU HỆ THỐNG

| Nhóm chức năng kiểm tra | Tổng số ca kiểm tra | Số ca ĐẠT | Tỷ lệ hoàn thành |
| :--- | :---: | :---: | :---: |
| 1. Xác thực & Phân quyền (Auth & Guest) | 4 | 4 | **100%** |
| 2. Gameplay 3 Chế độ × 3 Độ khó (9 biến thể) | 3 | 3 | **100%** |
| 3. Thuật toán Safe First Click & Flood-fill | 2 | 2 | **100%** |
| 4. Cắm cờ & Thao tác Chord mở nhanh | 4 | 4 | **100%** |
| 5. Tương tác Mobile & Cảm ứng (Touch Mode & Long-press) | 3 | 3 | **100%** |
| 6. Gợi ý mìn thông minh (Hint 100 xu & Radar) | 3 | 3 | **100%** |
| 7. Kinh tế Xu thưởng & Thưởng tốc độ Speed Bonus | 3 | 3 | **100%** |
| 8. Cửa hàng Skin & Phòng Thử Chiến Thuật 5×5 | 4 | 4 | **100%** |
| 9. Bảng xếp hạng Leaderboard chính xác mili-giây | 2 | 2 | **100%** |
| 10. Quản trị Admin CMS (Khóa tài khoản, Give Coins, Kỷ lục) | 6 | 6 | **100%** |
| 11. Bảo mật & Chống gian lận (Anti-Cheat Timer & DB Lock) | 5 | 5 | **100%** |
| **TỔNG CỘNG** | **39** | **39** | **100% ĐẠT** |

**KẾT LUẬN NGHIỆM THU:**  
Hệ thống vận hành ổn định, chính xác theo toàn bộ các tiêu chí đã cam kết trong Phiếu đăng ký đề tài; đạt chuẩn chất lượng bảo vệ trước Hội đồng chấm thi Khoa Công nghệ Thông tin.
