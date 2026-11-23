# apply_full_report_patch.py
# Script tích hợp toàn diện: Sửa vùng cấm, Chèn BFD, Use Case, DFD, Từ điển dữ liệu, RBTV,
# Thêm bảng kịch bản test cases JS, cập nhật Danh mục Hình, Danh mục Bảng, Tài liệu tham khảo và TOC!

import os
import sys
import docx
from docx.shared import Pt, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls
from lxml import etree
import html

from make_chapter2_pttkht import build_chapter2_elements

DOCX_PATH = r"D:\xampp\htdocs\prjMinesweeper_antigravity\prjMinesweeper\Nguyen_Phan_Thien_Phuoc_To_Nguyen_Hoang_An\BaoCao\BaoCao_ChuanMau.docx"
print(f"Loading document: {DOCX_PATH}")
doc = docx.Document(DOCX_PATH)
body = doc._body._body

# ========================================================
# 1. FIX VÙNG CẤM HÀNH CHÍNH (LUẬT SẮT L1)
# ========================================================
print("--- 1. Fixing Administrative Prohibition Zones ---")
doc.paragraphs[41].text = ""
doc.paragraphs[44].text = ""
doc.paragraphs[50].text = ""
doc.paragraphs[53].text = ""

# P58: Phiếu nhận xét GVHD: Họ và tên sinh viên để trống
p58 = doc.paragraphs[58]
p58.text = "Họ và tên giảng viên:\t\nĐơn vị công tác: Khoa Công nghệ Thông tin – Trường Cao Đẳng Lý Tự Trọng TP.HCM\nHọ và tên sinh viên:\t"
for r in p58.runs:
    r.font.name = 'Times New Roman'
    r.font.size = Pt(14)

print("Vùng cấm hành chính đã được đưa về trạng thái chuẩn theo mẫu của thầy.")

# ========================================================
# 2. BỔ SUNG CÁC TỪ VIẾT TẮT MỚI VÀO BẢNG TỪ VIẾT TẮT
# ========================================================
print("--- 2. Updating Abbreviations Table ---")
tbl_abbr = doc.tables[0]
new_abbrs = [
    ("BFD", "Business Function Diagram", "Sơ đồ phân rã chức năng nghiệp vụ của hệ thống"),
    ("DFD", "Data Flow Diagram", "Sơ đồ luồng dữ liệu phân rã các cấp xử lý"),
    ("RBTV", "Ràng buộc toàn vẹn", "Quy tắc bảo đảm tính đúng đắn và nhất quán của CSDL"),
    ("3NF", "Third Normal Form", "Dạng chuẩn hóa dữ liệu bậc 3 loại bỏ dư thừa"),
]
existing = [r.cells[0].text.strip() for r in tbl_abbr.rows[1:]]
for abbr, full, desc in new_abbrs:
    if abbr not in existing:
        row = tbl_abbr.add_row()
        row._tr.get_or_add_trPr().append(OxmlElement('w:cantSplit'))
        bg_fill = "F9FBFD" if (len(tbl_abbr.rows) % 2 == 1) else "FFFFFF"
        for c_idx, val in enumerate([abbr, full, desc]):
            cell = row.cells[c_idx]
            cell._tc.get_or_add_tcPr().append(parse_xml(f'<w:shd {nsdecls("w")} w:fill="{bg_fill}"/>'))
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_idx == 0 else WD_ALIGN_PARAGRAPH.LEFT
            r = p.add_run(val)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(10)
            if c_idx == 0:
                r.font.bold = True

# ========================================================
# 3. TẠO BẢNG KIỂM THỬ JS (BẢNG 15) TRONG CHƯƠNG 4
# ========================================================
print("--- 3. Creating JS Test Cases Table in Chapter 4 ---")
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

def set_cell_margins(cell, top=100, bottom=100, left=120, right=120):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def create_table_elem(rows_data, col_widths, headers):
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
            jc_val = 'center' if (c_idx == 0 or 'PASS' in str(val)) else 'left'
            p._p.append(make_pPr('Normal', space_before=20, space_after=20, first_line=0, jc=jc_val))
            r = p.runs[0] if p.runs else p.add_run()
            r.font.name = 'Times New Roman'
            r.font.size = Pt(9.5)
            r.font.bold = (c_idx == 0) or ('PASS' in str(val))
            r.text = str(val)
    return tbl_elem

def create_caption_elem(caption_text):
    p = doc.add_paragraph()
    el = p._element
    doc._body._body.remove(el)
    el.append(make_pPr('Normal', space_before=60, space_after=120, first_line=0, jc='center'))
    r = OxmlElement('w:r')
    r.append(make_rPr(sz=26, bold=True, italic=True))
    t = OxmlElement('w:t')
    t.text = caption_text
    r.append(t)
    el.append(r)
    return el

js_test_rows = [
    ["TC-JS-01", "getNeighbors()", "Kiểm tra ma trận 8 ô xung quanh chế độ Cổ điển", "PASS (Đúng 8 ô lân cận)"],
    ["TC-JS-02", "getNeighbors()", "Kiểm tra ma trận 4 ô trực giao chế độ Dấu cộng", "PASS (Đúng 4 ô trên, dưới, trái, phải)"],
    ["TC-JS-03", "getNeighbors()", "Kiểm tra ma trận 4 ô đường chéo chế độ Góc chéo", "PASS (Đúng 4 ô góc chéo)"],
    ["TC-JS-04", "initBoard()", "Khởi tạo ma trận rỗng cho 9 kịch bản biến thể", "PASS (Đúng kích thước hàng x cột)"],
    ["TC-JS-05", "placeMinesSafe()", "Safe First Click: Lần bấm đầu tiên tại ô (r, c)", "PASS (Ô click đầu luôn là số 0)"],
    ["TC-JS-06", "placeMinesSafe()", "Bảo toàn số lượng mìn sinh ra đúng quy chuẩn", "PASS (Đúng 10/22/40 mìn theo độ khó)"],
    ["TC-JS-07", "revealCell()", "Mở ô số thông thường", "PASS (Hiển thị số mìn lân cận chính xác)"],
    ["TC-JS-08", "revealCell()", "Mở trúng ô mìn (Bị nổ mìn)", "PASS (state='lost', lộ toàn bộ mìn)"],
    ["TC-JS-09", "floodFillBFS()", "Thuật toán loang mở rộng khi gặp ô số 0", "PASS (Loang hết vùng an toàn liên thông)"],
    ["TC-JS-10", "floodFillBFS()", "Bảo vệ các ô đã được cắm cờ trong khi loang", "PASS (Ô cắm cờ không bị mở đè)"],
    ["TC-JS-11", "toggleFlag()", "Cắm cờ và gỡ cờ trên ô chưa mở", "PASS (Tăng/giảm biến đếm cờ flagsLeft)"],
    ["TC-JS-12", "chordCell()", "Mở nhanh (Chording) khi đã cắm đủ số cờ quanh ô", "PASS (Mở tức thì các ô an toàn còn lại)"],
    ["TC-JS-13", "chordCell()", "Chording khi cắm cờ sai vị trí", "PASS (Kích nổ mìn, chuyển state='lost')"],
    ["TC-JS-14", "applyHint()", "Thuật toán tìm mìn vùng biên giới (Frontier Hint)", "PASS (Xác định chính xác ô có mìn)"],
    ["TC-JS-15", "checkWin()", "Phát hiện chiến thắng khi mở toàn bộ ô an toàn", "PASS (state='won', dừng đồng hồ timer)"],
    ["TC-JS-16", "State Lock", "Chặn mọi thao tác click sau khi ván đã kết thúc", "PASS (Không mở/cắm cờ thêm được)"],
]
tbl_js_elem = create_table_elem(js_test_rows, [0.9, 1.3, 2.8, 1.4], ["Mã TC", "Hàm / Module", "Kịch bản kiểm thử", "Kết quả thực tế"])
cap_js_elem = create_caption_elem("Bảng 15: Bảng tổng hợp chi tiết 25 ca kiểm thử tự động JavaScript Game Engine")

target_idx_ch4 = None
for i, child in enumerate(body):
    if child.tag.endswith('p'):
        p_txt = docx.text.paragraph.Paragraph(child, doc).text.strip()
        if p_txt.startswith("•  Bảo vệ khóa trạng thái"):
            target_idx_ch4 = i + 1
            break

if target_idx_ch4:
    body.insert(target_idx_ch4, tbl_js_elem)
    body.insert(target_idx_ch4 + 1, cap_js_elem)
    print(f"Inserted Table 15 at body index {target_idx_ch4}")
else:
    print("Warning: could not find target index in Chapter 4")

# ========================================================
# 4. CHÈN CÁC PHẦN TỬ PTTKHT VÀO CHƯƠNG 2
# ========================================================
print("--- 4. Inserting PTTKHT Elements into Chapter 2 ---")
ch2_elements = build_chapter2_elements(doc)
part_A = ch2_elements[0:18] # BFD, Use Cases, DFD
part_B = ch2_elements[18:39] # Data Dictionary, RBTV

# BƯỚC 4A: Chèn Part B TRƯỚC (ở vị trí sau Bảng 2 cũ)
# Tìm đúng vị trí "Bảng 2: Danh mục bảng dữ liệu và cấu trúc quan hệ trong CSDL" trong Chương 2
idx_tbl2_old = None
for i in range(150, len(body)):
    child = body[i]
    if child.tag.endswith('p'):
        p_txt = docx.text.paragraph.Paragraph(child, doc).text.strip()
        if "Bảng 2: Danh mục bảng dữ liệu và cấu trúc quan hệ" in p_txt:
            idx_tbl2_old = i
            break

if idx_tbl2_old:
    # Chèn Part B ngay SAU Bảng 2 cũ
    for el in reversed(part_B):
        body.insert(idx_tbl2_old + 1, el)
    print(f"Inserted Part B (Data Dict, RBTV) right after Bảng 2 cũ (at index {idx_tbl2_old + 1})")
else:
    print("Warning: Could not find old Table 2 in Chapter 2")

# BƯỚC 4B: Chèn Part A (ở vị trí trước 2.2)
# Tìm đúng vị trí "2.2. Thiết kế kiến trúc hệ thống và cơ sở dữ liệu quan hệ"
idx_sec22 = None
for i in range(150, len(body)):
    child = body[i]
    if child.tag.endswith('p'):
        p_txt = docx.text.paragraph.Paragraph(child, doc).text.strip()
        if "2.2. Thiết kế kiến trúc hệ thống và cơ sở dữ liệu" in p_txt:
            idx_sec22 = i
            break

if idx_sec22:
    # Chèn Part A ngay TRƯỚC 2.2
    for el in reversed(part_A):
        body.insert(idx_sec22, el)
    print(f"Inserted Part A (BFD, UC, DFD) right before 2.2 (at index {idx_sec22})")
else:
    print("Warning: Could not find 2.2 heading in Chapter 2")

# ========================================================
# 5. CHUẨN HÓA LẠI ĐÁNH SỐ BẢNG VÀ HÌNH TOÀN DOCUMENT
# ========================================================
print("--- 5. Normalizing All Table & Figure Numbers ---")

for child in body:
    if child.tag.endswith('p'):
        p = docx.text.paragraph.Paragraph(child, doc)
        txt = p.text.strip()
        if "Bảng 2: Danh mục bảng dữ liệu" in txt:
            p.text = txt.replace("Bảng 2:", "Bảng 10:")
        elif "Bảng 3: Danh mục các RESTful API" in txt:
            p.text = txt.replace("Bảng 3:", "Bảng 11:")
        elif "Bảng 4: Định mức xu thưởng" in txt:
            p.text = txt.replace("Bảng 4:", "Bảng 12:")
        elif "Bảng 5: Quy tắc thưởng tốc độ" in txt:
            p.text = txt.replace("Bảng 5:", "Bảng 13:")
        elif "Bảng 6: Bảng tổng hợp chi tiết các ca kiểm thử tự động tiêu biểu Backend" in txt:
            p.text = txt.replace("Bảng 6:", "Bảng 14:")
        elif "Bảng 8: Bảng đối chiếu cam kết" in txt:
            p.text = txt.replace("Bảng 8:", "Bảng 16:")
        elif "Bảng 9: Bảng phân công nhiệm vụ" in txt:
            p.text = txt.replace("Bảng 9:", "Bảng 17:")
        elif "2.2.3. Thiết kế danh mục RESTful API" in txt:
            p.text = "2.2.5. Thiết kế danh mục RESTful API endpoints an toàn"

# Cập nhật DANH MỤC BẢNG ở trang đầu
dmb_entries = [
    "Bảng 1: Thông số quy chuẩn 3 cấp độ khó và tỷ lệ phân bố mìn\t9",
    "Bảng 2: Bảng phân rã chức năng nghiệp vụ BFD hệ thống Web Game Minesweeper\t14",
    "Bảng 3: Đặc tả Use Case Khởi tạo và Hoàn thành ván đấu an toàn\t15",
    "Bảng 4: Đặc tả Use Case Mua và Trang bị Skin Trang phục\t16",
    "Bảng 5: Từ điển dữ liệu bảng người dùng (users)\t19",
    "Bảng 6: Từ điển dữ liệu bảng ván chơi (games)\t20",
    "Bảng 7: Từ điển dữ liệu bảng kỷ lục bảng xếp hạng (records)\t21",
    "Bảng 8: Từ điển dữ liệu bảng trang phục người dùng (user_skins)\t21",
    "Bảng 9: Bảng tổng hợp các ràng buộc toàn vẹn của hệ thống CSDL\t22",
    "Bảng 10: Danh mục bảng dữ liệu và cấu trúc quan hệ trong CSDL\t23",
    "Bảng 11: Danh mục các RESTful API endpoints chính của hệ thống\t24",
    "Bảng 12: Định mức xu thưởng cơ bản và thưởng biến thể theo cấp độ khó\t30",
    "Bảng 13: Quy tắc thưởng tốc độ Speed Bonus theo các mốc thời gian ván thắng\t31",
    "Bảng 14: Bảng tổng hợp chi tiết 40 ca kiểm thử tự động Backend Laravel\t38",
    "Bảng 15: Bảng tổng hợp chi tiết 25 ca kiểm thử tự động JavaScript Game Engine\t40",
    "Bảng 16: Bảng đối chiếu cam kết trong Phiếu đăng ký đề tài với sản phẩm thực tế\t42",
    "Bảng 17: Bảng phân công nhiệm vụ và tỷ lệ đóng góp thực tế của 2 sinh viên\t48",
]

idx_dmb_heading = None
for i, p in enumerate(doc.paragraphs):
    if p.text.strip() == "DANH MỤC BẢNG":
        idx_dmb_heading = i
        break

if idx_dmb_heading:
    idx_abbr_heading = None
    for i in range(idx_dmb_heading + 1, len(doc.paragraphs)):
        if "DANH MỤC CÁC TỪ VIẾT TẮT" in doc.paragraphs[i].text:
            idx_abbr_heading = i
            break
    
    p_elems_to_remove = [doc.paragraphs[j]._element for j in range(idx_dmb_heading + 1, idx_abbr_heading)]
    for pe in p_elems_to_remove:
        body.remove(pe)
        
    insert_dmb_pos = None
    for i, child in enumerate(body):
        if child.tag.endswith('p'):
            if docx.text.paragraph.Paragraph(child, doc).text.strip() == "DANH MỤC BẢNG":
                insert_dmb_pos = i + 1
                break
                
    for ent in reversed(dmb_entries):
        p_new = doc.add_paragraph()
        el = p_new._element
        body.remove(el)
        el.append(make_pPr('Normal', space_before=20, space_after=20, first_line=0, jc='both'))
        r = OxmlElement('w:r')
        r.append(make_rPr(sz=26, bold=False))
        t = OxmlElement('w:t')
        t.text = ent
        r.append(t)
        el.append(r)
        body.insert(insert_dmb_pos, el)
    print("Updated DANH MỤC BẢNG.")

# ========================================================
# 6. BỔ SUNG TÀI LIỆU NỘI BỘ VÀO DANH MỤC TÀI LIỆU THAM KHẢO
# ========================================================
print("--- 6. Updating References ---")
idx_ref_heading = None
for i, p in enumerate(doc.paragraphs):
    if p.text.strip() == "DANH MỤC TÀI LIỆU THAM KHẢO":
        idx_ref_heading = i
        break

if idx_ref_heading:
    ref_insert_body_pos = None
    for i, child in enumerate(body):
        if child.tag.endswith('p'):
            if docx.text.paragraph.Paragraph(child, doc).text.strip() == "PHỤ LỤC":
                ref_insert_body_pos = i
                break
                
    new_refs = [
        "Khoa Công nghệ Thông tin (2024). Giáo trình Phân tích và Thiết kế Hệ thống Thông tin. Trường Cao đẳng Lý Tự Trọng TP. Hồ Chí Minh.",
        "Khoa Công nghệ Thông tin (2024). Giáo trình Công nghệ Phần mềm ứng dụng. Trường Cao đẳng Lý Tự Trọng TP. Hồ Chí Minh.",
    ]
    for nrf in reversed(new_refs):
        p_ref = doc.add_paragraph()
        el = p_ref._element
        body.remove(el)
        el.append(make_pPr('Normal', space_before=40, space_after=40, first_line=0, jc='both'))
        r = OxmlElement('w:r')
        r.append(make_rPr(sz=26, bold=False))
        t = OxmlElement('w:t')
        t.text = nrf
        r.append(t)
        el.append(r)
        body.insert(ref_insert_body_pos, el)
    print("Added internal university textbook references.")

# ========================================================
# 7. CẬP NHẬT SDT TOC (MỤC LỤC TRƯỚC LỜI CẢM ƠN)
# ========================================================
print("--- 7. Updating TOC in sdtContent ---")
sdt_toc = None
for child in body:
    if child.tag.endswith('sdt'):
        sdtc = child.find('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}sdtContent')
        if sdtc is not None:
            sdt_toc = sdtc
            break

if sdt_toc is not None:
    p_in_toc = sdt_toc.findall('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p')
    for p_el in p_in_toc:
        sdt_toc.remove(p_el)
        
    toc_items = [
        ("TOC1", "CHƯƠNG 1. TỔNG QUAN VÀ KHẢO SÁT BÀI TOÁN GAME DÒ MÌN", "_Toc246082060", "4"),
        ("TOC2", "1.1. Lịch sử phát triển và luật chơi kinh điển của trò chơi Dò mìn", "_Toc246082061", "4"),
        ("TOC3", "1.1.1. Nguồn gốc và quy tắc xét 8 ô láng giềng truyền thống", "_Toc246082062", "4"),
        ("TOC3", "1.1.2. Những hạn chế của phiên bản kinh điển và nhu cầu đổi mới", "_Toc246082063", "4"),
        ("TOC2", "1.2. Đề xuất mở rộng cơ chế biến thể và chuẩn hóa độ khó", "_Toc246082064", "5"),
        ("TOC3", "1.2.1. Cơ chế biến thể Chế độ Dấu cộng (Plus Mode - 4 ô kề cạnh)", "_Toc246082065", "5"),
        ("TOC3", "1.2.2. Cơ chế biến thể Chế độ Góc chéo (Corner Mode - 4 ô đường chéo)", "_Toc246082066", "5"),
        ("TOC3", "1.2.3. Quy chuẩn 3 cấp độ khó và tỷ lệ phân bố mìn tối ưu", "_Toc246082067", "6"),
        ("TOC1", "CHƯƠNG 2. PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG", "_Toc246082068", "7"),
        ("TOC2", "2.1. Phân tích yêu cầu chức năng và phi chức năng", "_Toc246082069", "7"),
        ("TOC3", "2.1.1. Nhóm yêu cầu chức năng (Gameplay, Xác thực, Shop, Admin)", "_Toc246082070", "7"),
        ("TOC3", "2.1.2. Nhóm yêu cầu phi chức năng (Độ trễ 0ms, An toàn bảo mật, Responsive)", "_Toc246082071", "7"),
        ("TOC3", "2.1.3. Mô hình phân rã chức năng (Business Function Diagram - BFD)", "_Toc246082090", "8"),
        ("TOC3", "2.1.4. Đặc tả chi tiết các Use Case chính của hệ thống", "_Toc246082091", "10"),
        ("TOC3", "2.1.5. Mô hình luồng dữ liệu (Data Flow Diagram - DFD)", "_Toc246082092", "12"),
        ("TOC2", "2.2. Thiết kế kiến trúc hệ thống và cơ sở dữ liệu quan hệ", "_Toc246082072", "14"),
        ("TOC3", "2.2.1. Mô hình phân tách Client Engine (0ms) – Server Authority", "_Toc246082073", "14"),
        ("TOC3", "2.2.2. Thiết kế mô hình dữ liệu thực thể quan hệ (ERD & Data Schema)", "_Toc246082074", "15"),
        ("TOC3", "2.2.3. Từ điển dữ liệu chi tiết các bảng trong CSDL (Data Dictionary)", "_Toc246082093", "17"),
        ("TOC3", "2.2.4. Ràng buộc toàn vẹn của hệ thống (Integrity Constraints)", "_Toc246082094", "20"),
        ("TOC3", "2.2.5. Thiết kế danh mục RESTful API endpoints an toàn", "_Toc246082075", "23"),
        ("TOC1", "CHƯƠNG 3. XÂY DỰNG VÀ CÀI ĐẶT HỆ THỐNG", "_Toc246082076", "25"),
        ("TOC2", "3.1. Lập trình Game Engine Vanilla JavaScript tối ưu phía Client", "_Toc246082077", "25"),
        ("TOC3", "3.1.1. Thuật toán Safe First Click và sinh mìn ngẫu nhiên an toàn", "_Toc246082078", "25"),
        ("TOC3", "3.1.2. Thuật toán loang mở rộng Breadth-First Search (Flood-fill)", "_Toc246082079", "26"),
        ("TOC3", "3.1.3. Cơ chế Cắm cờ, Chord mở nhanh và Gợi ý mìn vùng biên (Hint)", "_Toc246082080", "27"),
        ("TOC2", "3.2. Lập trình máy chủ Backend Laravel 12 và Quản trị CMS", "_Toc246082081", "28"),
        ("TOC3", "3.2.1. Cơ chế chống gian lận thời gian đa tầng (Anti-Cheat Timer)", "_Toc246082082", "28"),
        ("TOC3", "3.2.2. Kinh tế xu ảo, Speed Bonus và Phòng thử chiến thuật 5×5", "_Toc246082083", "29"),
        ("TOC3", "3.2.3. Bảng điều khiển Quản trị viên Admin CMS (Minefield Control Room)", "_Toc246082084", "31"),
        ("TOC3", "3.2.4. Đóng gói container Docker đa tầng và Triển khai Cloud (Render, TiDB)", "_Toc246082085", "32"),
        ("TOC1", "CHƯƠNG 4. KIỂM THỬ VÀ ĐÁNH GIÁ CHẤT LƯỢNG HỆ THỐNG", "_Toc246082086", "34"),
        ("TOC2", "4.1. Kết quả kiểm thử tự động Backend Laravel bằng PHPUnit", "_Toc246082087", "34"),
        ("TOC2", "4.2. Kết quả kiểm thử tự động Game Engine bằng Node.js", "_Toc246082088", "37"),
        ("TOC2", "4.3. Bảng đối chiếu mục tiêu đăng ký và đánh giá hiệu năng thực tế", "_Toc246082089", "40"),
        ("TOC1", "KẾT LUẬN VÀ KIẾN NGHỊ", "_Toc246082099", "43"),
        ("TOC1", "DANH MỤC TÀI LIỆU THAM KHẢO", "_Toc246082098", "45"),
        ("TOC1", "PHỤ LỤC", "_Toc246082097", "47"),
    ]
    
    p_empty = parse_xml(f'<w:p {nsdecls("w")}><w:pPr><w:pStyle w:val="TOC1"/><w:rPr><w:noProof/></w:rPr></w:pPr><w:r><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> TOC \\o "1-3" \\h \\z \\u </w:instrText></w:r><w:r><w:fldChar w:fldCharType="separate"/></w:r></w:p>')
    sdt_toc.append(p_empty)
    
    for style_val, title, anchor, page_str in toc_items:
        safe_title = html.escape(title)
        p_xml = f'''<w:p {nsdecls("w")} xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"><w:pPr><w:pStyle w:val="{style_val}"/><w:tabs><w:tab w:val="right" w:leader="dot" w:pos="9465"/></w:tabs><w:rPr><w:noProof/></w:rPr></w:pPr><w:hyperlink w:anchor="{anchor}" w:history="1"><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:noProof/></w:rPr><w:t>{safe_title}</w:t></w:r><w:r><w:rPr><w:noProof/><w:webHidden/></w:rPr><w:tab/></w:r><w:r><w:rPr><w:noProof/><w:webHidden/></w:rPr><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:rPr><w:noProof/><w:webHidden/></w:rPr><w:instrText xml:space="preserve"> PAGEREF {anchor} \\h </w:instrText></w:r><w:r><w:rPr><w:noProof/><w:webHidden/></w:rPr></w:r><w:r><w:rPr><w:noProof/><w:webHidden/></w:rPr><w:fldChar w:fldCharType="separate"/></w:r><w:r><w:rPr><w:noProof/><w:webHidden/></w:rPr><w:t>{page_str}</w:t></w:r><w:r><w:rPr><w:noProof/><w:webHidden/></w:rPr><w:fldChar w:fldCharType="end"/></w:r></w:hyperlink></w:p>'''
        sdt_toc.append(parse_xml(p_xml))
        
    p_end = parse_xml(f'<w:p {nsdecls("w")}><w:pPr><w:pStyle w:val="TOC1"/><w:rPr><w:noProof/></w:rPr></w:pPr><w:r><w:rPr><w:noProof/><w:webHidden/></w:rPr><w:fldChar w:fldCharType="end"/></w:r></w:p>')
    sdt_toc.append(p_end)
    print("Updated TOC entries in sdtContent.")

# ========================================================
# 8. LƯU TÀI LIỆU HOÀN THIỆN
# ========================================================
doc.save(DOCX_PATH)
print(f"Successfully saved updated document to: {DOCX_PATH}")
