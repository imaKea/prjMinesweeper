# make_chapter2_pttkht.py
# Module tạo các phần tử PTTKHT chi tiết chuẩn mực cho Chương 2
import docx
from docx.shared import Pt, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls

def build_chapter2_elements(doc):
    elements = []
    
    # ----------------------------------------------------
    # Helper wrappers
    # ----------------------------------------------------
    def make_pPr(style_val, space_before=80, space_after=80, first_line=562, jc=None):
        pPr = OxmlElement('w:pPr')
        pStyle = OxmlElement('w:pStyle')
        pStyle.set(qn('w:val'), style_val)
        pPr.append(pStyle)
        sp = OxmlElement('w:spacing')
        sp.set(qn('w:before'), str(space_before))
        sp.set(qn('w:after'), str(space_after))
        sp.set(qn('w:line'), '288')
        sp.set(qn('w:lineRule'), 'auto')
        pPr.append(sp)
        if first_line:
            ind = OxmlElement('w:ind')
            ind.set(qn('w:firstLine'), str(first_line))
            pPr.append(ind)
        if jc:
            jc_el = OxmlElement('w:jc')
            jc_el.set(qn('w:val'), jc)
            pPr.append(jc_el)
        return pPr

    def make_rPr(sz=28, bold=False, italic=False, color='000000'):
        rPr = OxmlElement('w:rPr')
        rFonts = OxmlElement('w:rFonts')
        rFonts.set(qn('w:ascii'), 'Times New Roman')
        rFonts.set(qn('w:hAnsi'), 'Times New Roman')
        rFonts.set(qn('w:cs'), 'Times New Roman')
        rPr.append(rFonts)
        if bold:
            rPr.append(OxmlElement('w:b'))
            rPr.append(OxmlElement('w:bCs'))
        if italic:
            rPr.append(OxmlElement('w:i'))
            rPr.append(OxmlElement('w:iCs'))
        sz_el = OxmlElement('w:sz')
        sz_el.set(qn('w:val'), str(sz))
        rPr.append(sz_el)
        szCs_el = OxmlElement('w:szCs')
        szCs_el.set(qn('w:val'), str(sz))
        rPr.append(szCs_el)
        c_el = OxmlElement('w:color')
        c_el.set(qn('w:val'), color)
        rPr.append(c_el)
        return rPr

    def H2(text, bm_id, bm_name):
        p = doc.add_paragraph()
        el = p._element
        doc._body._body.remove(el)
        el.append(make_pPr('Heading2', space_before=140, space_after=80, first_line=562))
        bm_s = OxmlElement('w:bookmarkStart')
        bm_s.set(qn('w:id'), str(bm_id))
        bm_s.set(qn('w:name'), bm_name)
        el.append(bm_s)
        r = OxmlElement('w:r')
        r.append(make_rPr(sz=28, bold=True, italic=False))
        t = OxmlElement('w:t')
        t.text = text
        r.append(t)
        el.append(r)
        bm_e = OxmlElement('w:bookmarkEnd')
        bm_e.set(qn('w:id'), str(bm_id))
        el.append(bm_e)
        return el

    def H3(text, bm_id, bm_name):
        p = doc.add_paragraph()
        el = p._element
        doc._body._body.remove(el)
        el.append(make_pPr('Heading3', space_before=100, space_after=60, first_line=562))
        bm_s = OxmlElement('w:bookmarkStart')
        bm_s.set(qn('w:id'), str(bm_id))
        bm_s.set(qn('w:name'), bm_name)
        el.append(bm_s)
        r = OxmlElement('w:r')
        r.append(make_rPr(sz=28, bold=True, italic=True))
        t = OxmlElement('w:t')
        t.text = text
        r.append(t)
        el.append(r)
        bm_e = OxmlElement('w:bookmarkEnd')
        bm_e.set(qn('w:id'), str(bm_id))
        el.append(bm_e)
        return el

    def P(text, bold_prefix=None, first_line=562):
        p = doc.add_paragraph()
        el = p._element
        doc._body._body.remove(el)
        el.append(make_pPr('Normal', space_before=40, space_after=60, first_line=first_line, jc='both'))
        if bold_prefix:
            r1 = OxmlElement('w:r')
            r1.append(make_rPr(sz=26, bold=True))
            t1 = OxmlElement('w:t')
            t1.text = bold_prefix
            r1.append(t1)
            el.append(r1)
        r2 = OxmlElement('w:r')
        r2.append(make_rPr(sz=26, bold=False))
        t2 = OxmlElement('w:t')
        t2.text = text
        r2.append(t2)
        el.append(r2)
        return el

    def Caption(text):
        p = doc.add_paragraph()
        el = p._element
        doc._body._body.remove(el)
        el.append(make_pPr('Normal', space_before=60, space_after=120, first_line=0, jc='center'))
        r = OxmlElement('w:r')
        r.append(make_rPr(sz=26, bold=True, italic=True))
        t = OxmlElement('w:t')
        t.text = text
        r.append(t)
        el.append(r)
        return el

    def set_cell_margins(cell, top=100, bottom=100, left=120, right=120):
        tcPr = cell._tc.get_or_add_tcPr()
        tcMar = OxmlElement('w:tcMar')
        for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
            node = OxmlElement(f'w:{m}')
            node.set(qn('w:w'), str(val))
            node.set(qn('w:type'), 'dxa')
            tcMar.append(node)
        tcPr.append(tcMar)

    def Table(rows_data, col_widths, headers):
        tbl = doc.add_table(rows=len(rows_data) + 1, cols=len(headers))
        tbl_elem = tbl._element
        doc._body._body.remove(tbl_elem)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        tblPr = tbl._tbl.tblPr
        tblBorders = OxmlElement('w:tblBorders')
        for b in ['top', 'bottom', 'insideH', 'insideV']:
            border = OxmlElement(f'w:{b}')
            border.set(qn('w:val'), 'single')
            border.set(qn('w:sz'), '4')
            border.set(qn('w:color'), 'B0B0B0')
            tblBorders.append(border)
        tblPr.append(tblBorders)
        
        hdr_row = tbl.rows[0]
        hdr_row._tr.get_or_add_trPr().append(OxmlElement('w:tblHeader'))
        hdr_row._tr.get_or_add_trPr().append(OxmlElement('w:cantSplit'))
        for c_idx, h_text in enumerate(headers):
            cell = hdr_row.cells[c_idx]
            cell.width = Inches(col_widths[c_idx])
            cell._tc.get_or_add_tcPr().append(parse_xml(f'<w:shd {nsdecls("w")} w:fill="EBF1F5"/>'))
            set_cell_margins(cell, top=120, bottom=120, left=120, right=120)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p._p.append(make_pPr('Normal', space_before=40, space_after=40, first_line=0, jc='center'))
            r = p.runs[0] if p.runs else p.add_run()
            r.font.name = 'Times New Roman'
            r.font.size = Pt(10.5)
            r.font.bold = True
            r.text = h_text
            
        for r_idx, r_data in enumerate(rows_data):
            row = tbl.rows[r_idx + 1]
            row._tr.get_or_add_trPr().append(OxmlElement('w:cantSplit'))
            bg_fill = "F9FBFD" if (r_idx % 2 == 1) else "FFFFFF"
            for c_idx, val in enumerate(r_data):
                cell = row.cells[c_idx]
                cell.width = Inches(col_widths[c_idx])
                cell._tc.get_or_add_tcPr().append(parse_xml(f'<w:shd {nsdecls("w")} w:fill="{bg_fill}"/>'))
                set_cell_margins(cell, top=80, bottom=80, left=100, right=100)
                p = cell.paragraphs[0]
                jc_val = 'center' if (c_idx == 0 or len(str(val)) <= 8 or 'PK' in str(val) or 'FK' in str(val)) else 'left'
                p._p.append(make_pPr('Normal', space_before=20, space_after=20, first_line=0, jc=jc_val))
                r = p.runs[0] if p.runs else p.add_run()
                r.font.name = 'Times New Roman'
                r.font.size = Pt(9.5)
                r.font.bold = (c_idx == 0 and len(headers) >= 4) or ('PK' in str(val))
                r.text = str(val)
        return tbl_elem

    # ====================================================
    # NỘI DUNG 2.1.3: MÔ HÌNH PHÂN RÃ CHỨC NĂNG BFD
    # ====================================================
    elements.append(H3("2.1.3. Mô hình phân rã chức năng (Business Function Diagram - BFD)", 30, "_Toc246082090"))
    elements.append(P("Để có cái nhìn tổng quan, phân cấp rõ ràng toàn bộ các chức năng nghiệp vụ của hệ thống Web Game Minesweeper, sơ đồ phân rã chức năng BFD (Business Function Diagram) được xây dựng theo cấu trúc hình cây. Toàn bộ hệ thống quản lý và vận hành trò chơi được phân rã thành 5 phân hệ cấp 1 và 18 chức năng nghiệp vụ chi tiết cấp 2 như sau:"))
    
    bfd_rows = [
        ["1.0", "Xác thực & Người dùng", "1.1", "Đăng ký tài khoản người chơi mới"],
        ["1.0", "Xác thực & Người dùng", "1.2", "Đăng nhập xác thực bảo mật & Đăng xuất"],
        ["1.0", "Xác thực & Người dùng", "1.3", "Khởi tạo phiên chơi Khách vãng lai (Guest)"],
        ["1.0", "Xác thực & Người dùng", "1.4", "Quản lý hồ sơ cá nhân & Đổi mật khẩu"],
        ["2.0", "Quản lý Ván chơi (Gameplay)", "2.1", "Khởi tạo ván đấu & Cấp Game Token UUID"],
        ["2.0", "Quản lý Ván chơi (Gameplay)", "2.2", "Xử lý Safe First Click & Sinh mìn an toàn"],
        ["2.0", "Quản lý Ván chơi (Gameplay)", "2.3", "Loang ô trống tự động (BFS Flood-fill)"],
        ["2.0", "Quản lý Ván chơi (Gameplay)", "2.4", "Cắm cờ, gỡ cờ & Mở nhanh (Chording)"],
        ["2.0", "Quản lý Ván chơi (Gameplay)", "2.5", "Kích hoạt Gợi ý mìn vùng biên (Hint System)"],
        ["2.0", "Quản lý Ván chơi (Gameplay)", "2.6", "Xác thực ván thắng & Chống gian lận (Anti-Cheat)"],
        ["3.0", "Kinh tế Xu ảo & Cửa hàng Skin", "3.1", "Cộng xu thưởng chiến thắng & Speed Bonus"],
        ["3.0", "Kinh tế Xu ảo & Cửa hàng Skin", "3.2", "Duyệt danh mục 26 skin & Thử nghiệm 5×5"],
        ["3.0", "Kinh tế Xu ảo & Cửa hàng Skin", "3.3", "Giao dịch mua skin an toàn (DB Transaction)"],
        ["3.0", "Kinh tế Xu ảo & Cửa hàng Skin", "3.4", "Trang bị skin bàn cờ và lá cờ đã sở hữu"],
        ["4.0", "Bảng xếp hạng (Leaderboard)", "4.1", "Tra cứu bảng xếp hạng Top người chơi"],
        ["4.0", "Bảng xếp hạng (Leaderboard)", "4.2", "Ghi nhận kỷ lục thời gian tốt nhất (Best Time)"],
        ["5.0", "Quản trị hệ thống (Admin CMS)", "5.1", "Đăng nhập trang quản trị chuyên biệt"],
        ["5.0", "Quản trị hệ thống (Admin CMS)", "5.2", "Thống kê Dashboard tỷ lệ thắng theo chế độ"],
        ["5.0", "Quản trị hệ thống (Admin CMS)", "5.3", "Quản lý người chơi (Khóa/Mở khóa tài khoản)"],
        ["5.0", "Quản trị hệ thống (Admin CMS)", "5.4", "Quản lý kỷ lục & Điều chỉnh xu thử nghiệm"],
    ]
    elements.append(Table(bfd_rows, [0.8, 2.0, 0.8, 2.8], ["Mã Cấp 1", "Phân hệ nghiệp vụ Cấp 1", "Mã Cấp 2", "Chức năng chi tiết Cấp 2"]))
    elements.append(Caption("Bảng 2: Bảng phân rã chức năng nghiệp vụ BFD hệ thống Web Game Minesweeper"))

    # ====================================================
    # NỘI DUNG 2.1.4: ĐẶC TẢ USE CASE
    # ====================================================
    elements.append(H3("2.1.4. Đặc tả chi tiết các Use Case chính của hệ thống", 31, "_Toc246082091"))
    elements.append(P("Để làm rõ hành vi tương tác giữa các tác nhân (Actors) và hệ thống phần mềm, dưới đây là bảng đặc tả chi tiết 3 Use Case nghiệp vụ nòng cốt: (1) Bắt đầu ván đấu & Hoàn thành ván chơi; (2) Mua và trang bị Skin trong Cửa hàng; (3) Quản trị viên quản lý tài khoản người chơi."))
    
    uc1_rows = [
        ["Tên Use Case", "Khởi tạo ván đấu an toàn và Thẩm định hoàn thành ván thắng"],
        ["Mã Use Case", "UC-GAME-01"],
        ["Tác nhân (Actor)", "Người chơi (Khách vãng lai Guest hoặc Thành viên đã đăng nhập)"],
        ["Mục đích", "Cho phép người chơi tạo phiên đấu mới, thao tác 0ms trên lưới ô và được máy chủ thẩm định kết quả thắng trung thực."],
        ["Tiền điều kiện", "Người chơi đã truy cập vào trang chủ hệ thống Web Game."],
        ["Hậu điều kiện", "Ván đấu được ghi nhận kết quả; nếu thắng: cộng xu thưởng, cập nhật kỷ lục Leaderboard nếu đạt Best Time."],
        ["Luồng sự kiện chính", "1. Người chơi chọn Chế độ chơi (Classic/Plus/Corner) và Cấp độ khó (Easy/Medium/Hard).\n2. Hệ thống gọi API POST /api/games cấp mã Game Token UUID và ghi nhận started_at thời gian thực trên máy chủ.\n3. Người chơi nhấp chuột lần đầu vào ô bất kỳ. Game Engine Client kích hoạt Safe First Click đảm bảo ô này là ô số 0 và sinh mìn ngẫu nhiên.\n4. Người chơi tiếp tục suy luận mở ô, cắm cờ hoặc chord mở nhanh.\n5. Khi mở hết toàn bộ các ô an toàn, Client gửi yêu cầu POST /api/games/{token}/verify-win kèm thời gian chơi (client_time_ms).\n6. Máy chủ Server Authority tính toán delta thời gian thực tế, đối chiếu dung sai 2.500ms và chặn kỷ lục phi lý < 200ms.\n7. Nếu hợp lệ: Cập nhật status='won', cộng xu thưởng (kèm Speed Bonus) qua DB Transaction và ghi nhận Leaderboard."],
        ["Luồng rẽ nhánh", "4a. Nếu người chơi bấm trúng ô mìn: Game Engine hiển thị trạng thái Thua, lộ toàn bộ vị trí mìn và kết thúc ván.\n6a. Nếu máy chủ phát hiện gian lận thời gian hoặc ván đấu đã kết thúc: Trả về mã lỗi HTTP 422 hoặc HTTP 409 Conflict, hủy quyền nhận thưởng."],
    ]
    elements.append(Table(uc1_rows, [1.8, 4.6], ["Thuộc tính đặc tả", "Nội dung chi tiết"]))
    elements.append(Caption("Bảng 3: Đặc tả Use Case Khởi tạo và Hoàn thành ván đấu an toàn"))

    uc2_rows = [
        ["Tên Use Case", "Mua và Trang bị Skin Trang phục"],
        ["Mã Use Case", "UC-SHOP-01"],
        ["Tác nhân (Actor)", "Thành viên đã đăng nhập (User)"],
        ["Mục đích", "Sử dụng số dư xu ảo tích lũy từ các ván thắng để mua trang phục bàn cờ/lá cờ và kích hoạt sử dụng trong trận đấu."],
        ["Tiền điều kiện", "Người chơi đã đăng nhập tài khoản hợp lệ và có số dư xu lớn hơn hoặc bằng giá niêm yết của Skin."],
        ["Hậu điều kiện", "Skin được thêm vào kho sở hữu `user_skins`, số dư xu bị trừ chính xác và skin được kích hoạt trang bị."],
        ["Luồng sự kiện chính", "1. Người chơi mở giao diện Cửa hàng (Shop Modal).\n2. Hệ thống tải danh mục 26 skin (13 theme bàn cờ + 13 lá cờ vector SVG).\n3. Người chơi có thể nhấp 'Thử nghiệm' để xem trước hiệu ứng trên Phòng Thử Chiến Thuật mini 5×5.\n4. Người chơi nhấn nút 'Mua Skin' tương ứng.\n5. Hệ thống gửi yêu cầu POST /api/shop/purchase/{skinId}. Máy chủ mở DB::transaction() kèm khóa dòng `lockForUpdate()`, kiểm tra ví xu, trừ tiền và cấp quyền sở hữu vào bảng `user_skins`.\n6. Người chơi nhấn nút 'Trang bị' để cập nhật skin mặc định cho các ván chơi tiếp theo."],
        ["Luồng rẽ nhánh", "5a. Nếu số dư xu không đủ: Máy chủ trả về HTTP 422 Unprocessable Entity với thông báo 'Số dư xu không đủ', giao dịch bị rollback an toàn."],
    ]
    elements.append(Table(uc2_rows, [1.8, 4.6], ["Thuộc tính đặc tả", "Nội dung chi tiết"]))
    elements.append(Caption("Bảng 4: Đặc tả Use Case Mua và Trang bị Skin Trang phục"))

    # ====================================================
    # NỘI DUNG 2.1.5: MÔ HÌNH DÒNG DỮ LIỆU DFD
    # ====================================================
    elements.append(H3("2.1.5. Mô hình luồng dữ liệu (Data Flow Diagram - DFD)", 32, "_Toc246082092"))
    elements.append(P("Mô hình luồng dữ liệu DFD mô tả trực quan các luồng thông tin vào/ra, các tiến trình xử lý nghiệp vụ và các kho lưu trữ dữ liệu trong hệ thống Web Game Minesweeper. Dưới đây là phân tích luồng dữ liệu theo 3 cấp độ:"))
    
    elements.append(P("a. Sơ đồ ngữ cảnh (DFD Mức 0 - Context Diagram):", bold_prefix="• "))
    elements.append(P("Ở mức trừu tượng hóa cao nhất, toàn bộ hệ thống Web Game Minesweeper đóng vai trò là một tiến trình trung tâm duy nhất tương tác với 2 tác nhân ngoài (External Entities): Người chơi (Player) và Quản trị viên (Admin)."))
    elements.append(P("- Người chơi gửi thông tin đăng ký/đăng nhập, yêu cầu khởi tạo ván chơi, tọa độ thao tác, yêu cầu gợi ý Hint, yêu cầu mua skin; nhận lại kết quả phản hồi giao diện, thông tin phiên ván đấu, trạng thái gợi ý mìn và bảng xếp hạng Leaderboard."))
    elements.append(P("- Quản trị viên gửi thông tin xác thực quản trị, lệnh khóa/mở khóa tài khoản, lệnh điều chỉnh xu; nhận lại thông tin báo cáo thống kê ván chơi và danh sách người dùng."))

    elements.append(P("b. Sơ đồ luồng dữ liệu mức đỉnh (DFD Mức 1):", bold_prefix="• "))
    elements.append(P("Phân rã từ mức ngữ cảnh, DFD Mức 1 chia tách hệ thống thành 5 tiến trình xử lý cốt lõi tương ứng với BFD, tương tác với 6 kho dữ liệu (D1: users, D2: game_modes, D3: difficulties, D4: games, D5: records, D6: user_skins):"))
    elements.append(P("1. Tiến trình 1.0 (Xử lý Xác thực & Tài khoản): Tiếp nhận thông tin đăng ký/đăng nhập từ Người chơi, kiểm tra tính hợp lệ và đọc/ghi vào kho D1 (users)."))
    elements.append(P("2. Tiến trình 2.0 (Quản lý Ván chơi & Chống gian lận): Đọc cấu hình từ D2 (game_modes) và D3 (difficulties), khởi tạo phiên ván đấu ghi vào D4 (games); tiếp nhận yêu cầu xác thực ván thắng, tính toán dung sai thời gian và ghi nhận kết quả."))
    elements.append(P("3. Tiến trình 3.0 (Xử lý Giao dịch & Cửa hàng Skin): Đọc số dư xu từ D1, trừ xu gợi ý mìn trong D4; kiểm tra điều kiện mua skin, trừ xu và lưu thông tin sở hữu vào D6 (user_skins)."))
    elements.append(P("4. Tiến trình 4.0 (Ghi nhận & Xếp hạng Leaderboard): Tiếp nhận ván thắng từ Tiến trình 2.0, so sánh kỷ lục thời gian tốt nhất và ghi nhận vào kho D5 (records); cung cấp dữ liệu xếp hạng thời gian thực cho Người chơi."))
    elements.append(P("5. Tiến trình 5.0 (Quản trị & Thống kê CMS): Tiếp nhận yêu cầu từ Admin, truy vấn tổng hợp từ các kho D1, D4, D5 để kết xuất Dashboard; thực hiện cập nhật trạng thái khóa/mở khóa tài khoản trong D1."))

    elements.append(P("c. Sơ đồ luồng dữ liệu mức dưới đỉnh (DFD Mức 2 cho Tiến trình 2.0 - Quản lý Ván chơi):", bold_prefix="• "))
    elements.append(P("Tiến trình 2.0 được phân rã chi tiết thành 4 tiến trình con:"))
    elements.append(P("- 2.1 (Tạo phiên ván đấu): Sinh UUID Token, lấy thời gian hiện tại ms ghi nhận vào D4 với status='playing'."))
    elements.append(P("- 2.2 (Xử lý Gợi ý mìn vùng biên): Tiếp nhận yêu cầu gợi ý từ Client, gọi giao dịch trừ 100 xu trong D1 và trả về tọa độ mìn chính xác."))
    elements.append(P("- 2.3 (Thẩm định ván thắng & Anti-Cheat): Nhận client_time_ms, tính toán delta = finish_time - start_time, kiểm tra delta >= MIN_PLAUSIBLE_TIME_MS (200ms) và |client_time - delta| <= TIME_TOLERANCE_MS (2500ms). Cập nhật D4 status='won'."))
    elements.append(P("- 2.4 (Tính thưởng & Kích hoạt Leaderboard): Tính xu cơ bản theo D3 + 20% bonus biến thể + Speed Bonus; cập nhật số dư D1 và chuyển kết quả sang Tiến trình 4.0."))

    # ====================================================
    # NỘI DUNG 2.2.3: TỪ ĐIỂN DỮ LIỆU CHI TIẾT
    # ====================================================
    elements.append(H3("2.2.3. Từ điển dữ liệu chi tiết các bảng trong CSDL (Data Dictionary)", 33, "_Toc246082093"))
    elements.append(P("Dưới đây là từ điển dữ liệu đặc tả chi tiết toàn bộ các trường, kiểu dữ liệu, độ dài, khóa và ràng buộc toàn vẹn của 6 bảng dữ liệu chính trong CSDL MySQL 8.0:"))

    dd_users = [
        ["1", "id", "Mã người dùng duy nhất", "BIGINT UNSIGNED", "20", "PK, Auto Increment"],
        ["2", "username", "Tên đăng nhập hệ thống", "VARCHAR", "50", "Unique, Not Null"],
        ["3", "display_name", "Tên hiển thị công khai", "VARCHAR", "100", "Not Null"],
        ["4", "password", "Mật khẩu đã băm bcrypt", "VARCHAR", "255", "Not Null"],
        ["5", "role", "Vai trò (user / admin)", "VARCHAR", "20", "Default 'user'"],
        ["6", "coins", "Số dư xu ảo tích lũy", "INT", "11", "Default 0, >= 0"],
        ["7", "equipped_board_skin", "Mã skin bàn cờ đang trang bị", "VARCHAR", "50", "Default 'classic'"],
        ["8", "equipped_flag_skin", "Mã skin lá cờ đang trang bị", "VARCHAR", "50", "Default 'classic'"],
        ["9", "is_active", "Trạng thái hoạt động tài khoản", "TINYINT(1)", "1", "Default 1 (1: Mở, 0: Khóa)"],
        ["10", "created_at", "Thời điểm tạo tài khoản", "TIMESTAMP", "-", "Null"],
        ["11", "updated_at", "Thời điểm cập nhật sau cùng", "TIMESTAMP", "-", "Null"],
    ]
    elements.append(Table(dd_users, [0.6, 1.4, 2.0, 1.2, 0.6, 1.2], ["STT", "Tên thuộc tính", "Diễn giải", "Kiểu dữ liệu", "Kích thước", "Ghi chú"]))
    elements.append(Caption("Bảng 5: Từ điển dữ liệu bảng người dùng (users)"))

    dd_games = [
        ["1", "id", "Mã ván chơi duy nhất", "BIGINT UNSIGNED", "20", "PK, Auto Increment"],
        ["2", "token", "Mã định danh phiên đấu bảo mật", "CHAR(36)", "36", "UUID, Unique, Not Null"],
        ["3", "user_id", "Mã người chơi tham gia ván", "BIGINT UNSIGNED", "20", "FK -> users(id), Nullable"],
        ["4", "mode_id", "Mã chế độ chơi (classic/plus/corner)", "BIGINT UNSIGNED", "20", "FK -> game_modes(id)"],
        ["5", "difficulty_id", "Mã cấp độ khó (easy/medium/hard)", "BIGINT UNSIGNED", "20", "FK -> difficulties(id)"],
        ["6", "status", "Trạng thái ván (playing/won/lost)", "VARCHAR", "20", "Default 'playing'"],
        ["7", "time_ms", "Thời gian hoàn thành ván đấu", "INT UNSIGNED", "10", "Nullable, tính bằng ms"],
        ["8", "started_at", "Thời điểm bắt đầu chính xác ms", "DATETIME(3)", "-", "Not Null"],
        ["9", "finished_at", "Thời điểm kết thúc chính xác ms", "DATETIME(3)", "-", "Nullable"],
        ["10", "seed", "Hạt giống ngẫu nhiên tạo bàn cờ", "BIGINT UNSIGNED", "20", "Not Null"],
        ["11", "hints_used", "Số lần kích hoạt gợi ý trong ván", "INT", "11", "Default 0"],
    ]
    elements.append(Table(dd_games, [0.6, 1.4, 2.0, 1.2, 0.6, 1.2], ["STT", "Tên thuộc tính", "Diễn giải", "Kiểu dữ liệu", "Kích thước", "Ghi chú"]))
    elements.append(Caption("Bảng 6: Từ điển dữ liệu bảng ván chơi (games)"))

    dd_records = [
        ["1", "id", "Mã kỷ lục duy nhất", "BIGINT UNSIGNED", "20", "PK, Auto Increment"],
        ["2", "user_id", "Mã người chơi đạt kỷ lục", "BIGINT UNSIGNED", "20", "FK -> users(id), Not Null"],
        ["3", "mode_id", "Mã chế độ chơi đạt kỷ lục", "BIGINT UNSIGNED", "20", "FK -> game_modes(id)"],
        ["4", "difficulty_id", "Mã cấp độ khó đạt kỷ lục", "BIGINT UNSIGNED", "20", "FK -> difficulties(id)"],
        ["5", "best_time_ms", "Thời gian hoàn thành tốt nhất", "INT UNSIGNED", "10", "Not Null, tính bằng ms"],
        ["6", "achieved_at", "Thời điểm xác lập kỷ lục", "TIMESTAMP", "-", "Default CURRENT_TIMESTAMP"],
    ]
    elements.append(Table(dd_records, [0.6, 1.4, 2.0, 1.2, 0.6, 1.2], ["STT", "Tên thuộc tính", "Diễn giải", "Kiểu dữ liệu", "Kích thước", "Ghi chú"]))
    elements.append(Caption("Bảng 7: Từ điển dữ liệu bảng kỷ lục bảng xếp hạng (records)"))

    dd_skins = [
        ["1", "id", "Mã định danh dòng sở hữu", "BIGINT UNSIGNED", "20", "PK, Auto Increment"],
        ["2", "user_id", "Mã người chơi sở hữu", "BIGINT UNSIGNED", "20", "FK -> users(id), Not Null"],
        ["3", "skin_id", "Mã nhận diện trang phục (ví dụ: 'cyber')", "VARCHAR", "50", "Not Null"],
        ["4", "skin_type", "Loại trang phục ('board' hoặc 'flag')", "VARCHAR", "20", "Not Null"],
        ["5", "unlocked_at", "Thời điểm giao dịch mở khóa thành công", "TIMESTAMP", "-", "Default CURRENT_TIMESTAMP"],
    ]
    elements.append(Table(dd_skins, [0.6, 1.4, 2.0, 1.2, 0.6, 1.2], ["STT", "Tên thuộc tính", "Diễn giải", "Kiểu dữ liệu", "Kích thước", "Ghi chú"]))
    elements.append(Caption("Bảng 8: Từ điển dữ liệu bảng trang phục người dùng (user_skins)"))

    # ====================================================
    # NỘI DUNG 2.2.4: RÀNG BUỘC TOÀN VẸN (RBTV)
    # ====================================================
    elements.append(H3("2.2.4. Ràng buộc toàn vẹn của hệ thống (Integrity Constraints)", 34, "_Toc246082094"))
    elements.append(P("Ràng buộc toàn vẹn (RBTV) đóng vai trò then chốt trong việc bảo đảm dữ liệu luôn đúng đắn, nhất quán và ngăn chặn các hành vi cố tình chèn dữ liệu sai lệch hoặc phá vỡ cấu trúc quan hệ. Dưới đây là đặc tả hình thức toán học các RBTV của hệ thống theo 2 nhóm bối cảnh:"))

    elements.append(P("a. Ràng buộc toàn vẹn có bối cảnh là một quan hệ (Đơn quan hệ):", bold_prefix="• "))
    elements.append(P("R1/ Số dư xu của người chơi không bao giờ được âm:"))
    elements.append(P("Bối cảnh: users\nĐiều kiện: ∀ u ∈ users: u.coins ≥ 0\nÝ nghĩa: Người chơi không thể chi tiêu vượt quá số dư hiện có, chống lỗi âm tiền."))
    elements.append(P("R2/ Thời gian hoàn thành ván đấu hợp lệ phải lớn hơn ngưỡng tối thiểu:"))
    elements.append(P("Bối cảnh: games\nĐiều kiện: ∀ g ∈ games: (g.status = 'won') ⇒ (g.time_ms ≥ 200)\nÝ nghĩa: Chặn đứng các kỷ lục hack thời gian siêu nhân phi thực tế < 200ms."))
    elements.append(P("R3/ Kích thước bảng cờ và số mìn phải tuân thủ giới hạn an toàn:"))
    elements.append(P("Bối cảnh: difficulties\nĐiều kiện: ∀ d ∈ difficulties: (d.board_rows ≥ 9 ∧ d.board_cols ≥ 9 ∧ d.mine_count < d.board_rows * d.board_cols)\nÝ nghĩa: Đảm bảo số lượng mìn luôn nhỏ hơn tổng số ô trên bàn cờ."))
    elements.append(P("R4/ Trạng thái tài khoản người chơi chỉ nhận giá trị nhị phân:"))
    elements.append(P("Bối cảnh: users\nĐiều kiện: ∀ u ∈ users: u.is_active ∈ {0, 1}\nÝ nghĩa: Chỉ có 2 trạng thái: 1 (hoạt động) và 0 (bị khóa do vi phạm gian lận)."))

    elements.append(P("b. Ràng buộc toàn vẹn có bối cảnh gồm nhiều quan hệ (Liên quan hệ):", bold_prefix="• "))
    elements.append(P("R5/ RBTV Tham chiếu ván đấu phải thuộc về người dùng hợp lệ:"))
    elements.append(P("Bối cảnh: games, users\nĐiều kiện: ∀ g ∈ games: (g.user_id ≠ NULL) ⇒ (∃ u ∈ users: g.user_id = u.id)\nÝ nghĩa: Ván chơi của thành viên phải tham chiếu chính xác đến tài khoản đang tồn tại trong bảng users."))
    elements.append(P("R6/ RBTV Tham chiếu kỷ lục thành tích phải thuộc về người chơi thực tế:"))
    elements.append(P("Bối cảnh: records, users\nĐiều kiện: ∀ r ∈ records: ∃ u ∈ users: r.user_id = u.id\nÝ nghĩa: Không thể tồn tại kỷ lục mồ côi không có chủ sở hữu."))
    elements.append(P("R7/ RBTV Tham chiếu trang phục sở hữu phải thuộc về người dùng:"))
    elements.append(P("Bối cảnh: user_skins, users\nĐiều kiện: ∀ s ∈ user_skins: ∃ u ∈ users: s.user_id = u.id\nÝ nghĩa: Đảm bảo quyền sở hữu skin gắn liền với tài khoản người mua."))
    elements.append(P("R8/ RBTV Liên thuộc tính liên quan hệ giữa thời gian kết thúc và bắt đầu ván chơi:"))
    elements.append(P("Bối cảnh: games\nĐiều kiện: ∀ g ∈ games: (g.finished_at ≠ NULL) ⇒ (g.finished_at ≥ g.started_at)\nÝ nghĩa: Thời điểm kết thúc ván đấu luôn phải diễn ra sau hoặc bằng thời điểm bắt đầu."))
    elements.append(P("R9/ RBTV Duy nhất mỗi người chơi chỉ có một kỷ lục tốt nhất cho mỗi bộ (Mode, Difficulty):"))
    elements.append(P("Bối cảnh: records\nĐiều kiện: ∀ r1, r2 ∈ records: (r1.user_id = r2.user_id ∧ r1.mode_id = r2.mode_id ∧ r1.difficulty_id = r2.difficulty_id) ⇒ (r1.id = r2.id)\nÝ nghĩa: Khóa Unique đa cột ngăn trùng lặp kỷ lục, đảm bảo bảng xếp hạng chuẩn xác."))

    # Bảng tổng hợp RBTV
    rbtv_summary = [
        ["R1", "users", "u.coins >= 0", "Thêm, Sửa (coins)", "Từ chối giao dịch"],
        ["R2", "games", "g.time_ms >= 200 khi won", "Sửa (status, time_ms)", "Trả về HTTP 422"],
        ["R3", "difficulties", "mine_count < rows * cols", "Thêm, Sửa", "Báo lỗi cấu hình"],
        ["R4", "users", "u.is_active IN (0, 1)", "Thêm, Sửa", "Từ chối cập nhật"],
        ["R5", "games, users", "games.user_id tham chiếu users.id", "Thêm, Sửa, Xóa (users)", "CASCADE / RESTRICT"],
        ["R6", "records, users", "records.user_id tham chiếu users.id", "Thêm, Sửa, Xóa (users)", "CASCADE"],
        ["R7", "user_skins, users", "user_skins.user_id tham chiếu users.id", "Thêm, Sửa, Xóa (users)", "CASCADE"],
        ["R8", "games", "finished_at >= started_at", "Sửa (finished_at)", "Từ chối ghi nhận"],
        ["R9", "records", "Unique(user_id, mode_id, difficulty_id)", "Thêm mới record", "Chuyển thành UPDATE"],
    ]
    elements.append(Table(rbtv_summary, [0.6, 1.2, 2.2, 1.4, 1.2], ["Mã R", "Bối cảnh", "Nội dung ràng buộc", "Thao tác ảnh hưởng", "Cơ chế xử lý vi phạm"]))
    elements.append(Caption("Bảng 9: Bảng tổng hợp các ràng buộc toàn vẹn của hệ thống CSDL"))

    return elements

print("Module make_chapter2_pttkht ready.")
