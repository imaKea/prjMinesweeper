# update_report_pttkht.py
# Script cập nhật hoàn thiện Báo cáo Đồ án Chuyên ngành chuẩn PTTKHT & CNPM
# Tuân thủ nghiêm ngặt Luật sắt L1-L5, Mẫu thầy & Mã nguồn thực tế

import os
import docx
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls
from lxml import etree

DOCX_PATH = r"D:\xampp\htdocs\prjMinesweeper_antigravity\prjMinesweeper\Nguyen_Phan_Thien_Phuoc_To_Nguyen_Hoang_An\BaoCao\BaoCao_ChuanMau.docx"

print(f"Loading document: {DOCX_PATH}")
doc = docx.Document(DOCX_PATH)
body = doc._body._body

# ==========================================
# HELPER FUNCTIONS
# ==========================================

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

def create_heading_paragraph(style_name, text, bookmark_id, bookmark_name):
    p = doc.add_paragraph()
    p_elem = p._element
    doc._body._body.remove(p_elem) # unhook from end
    
    # Set pPr
    if style_name == 'Heading2':
        p_elem.append(make_pPr('Heading2', space_before=120, space_after=80, first_line=562))
        bm_start = OxmlElement('w:bookmarkStart')
        bm_start.set(qn('w:id'), str(bookmark_id))
        bm_start.set(qn('w:name'), bookmark_name)
        p_elem.append(bm_start)
        
        r = OxmlElement('w:r')
        r.append(make_rPr(sz=28, bold=True, italic=False))
        t = OxmlElement('w:t')
        t.text = text
        r.append(t)
        p_elem.append(r)
        
        bm_end = OxmlElement('w:bookmarkEnd')
        bm_end.set(qn('w:id'), str(bookmark_id))
        p_elem.append(bm_end)
        
    elif style_name == 'Heading3':
        p_elem.append(make_pPr('Heading3', space_before=80, space_after=80, first_line=562))
        bm_start = OxmlElement('w:bookmarkStart')
        bm_start.set(qn('w:id'), str(bookmark_id))
        bm_start.set(qn('w:name'), bookmark_name)
        p_elem.append(bm_start)
        
        r = OxmlElement('w:r')
        r.append(make_rPr(sz=28, bold=True, italic=True))
        t = OxmlElement('w:t')
        t.text = text
        r.append(t)
        p_elem.append(r)
        
        bm_end = OxmlElement('w:bookmarkEnd')
        bm_end.set(qn('w:id'), str(bookmark_id))
        p_elem.append(bm_end)
        
    return p_elem

def create_normal_paragraph(text, bold_prefix=None, first_line=562):
    p = doc.add_paragraph()
    p_elem = p._element
    doc._body._body.remove(p_elem)
    p_elem.append(make_pPr('Normal', space_before=40, space_after=60, first_line=first_line, jc='both'))
    
    if bold_prefix:
        r1 = OxmlElement('w:r')
        r1.append(make_rPr(sz=26, bold=True))
        t1 = OxmlElement('w:t')
        t1.text = bold_prefix
        r1.append(t1)
        p_elem.append(r1)
        
    r2 = OxmlElement('w:r')
    r2.append(make_rPr(sz=26, bold=False))
    t2 = OxmlElement('w:t')
    t2.text = text
    r2.append(t2)
    p_elem.append(r2)
    
    return p_elem

def create_caption_paragraph(caption_text):
    p = doc.add_paragraph()
    p_elem = p._element
    doc._body._body.remove(p_elem)
    p_elem.append(make_pPr('Normal', space_before=60, space_after=120, first_line=0, jc='center'))
    r = OxmlElement('w:r')
    r.append(make_rPr(sz=26, bold=True, italic=True))
    t = OxmlElement('w:t')
    t.text = caption_text
    r.append(t)
    p_elem.append(r)
    return p_elem

def set_cell_margins(cell, top=100, bottom=100, left=120, right=120):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def create_styled_table(rows_data, col_widths, headers):
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
    
    # Header row
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
        r.font.size = Pt(11)
        r.font.bold = True
        r.text = h_text
        
    # Data rows
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
            jc_val = 'center' if (c_idx == 0 or len(str(val)) <= 8) else 'left'
            p._p.append(make_pPr('Normal', space_before=20, space_after=20, first_line=0, jc=jc_val))
            r = p.runs[0] if p.runs else p.add_run()
            r.font.name = 'Times New Roman'
            r.font.size = Pt(10)
            r.font.bold = (c_idx == 0 and len(headers) > 4) or ('PK' in str(val))
            r.text = str(val)
            
    return tbl_elem

print("Helper functions compiled successfully.")
