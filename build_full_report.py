# -*- coding: utf-8 -*-
"""
Full build script for BaoCao_ChuanMau.docx
"""
import os
import re
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.section import WD_SECTION
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls

def configure_section_page_setup(section):
    section.page_width = Inches(8.27)   # 21.0 cm
    section.page_height = Inches(11.69) # 29.7 cm
    section.top_margin = Inches(0.59)   # 1.5 cm
    section.bottom_margin = Inches(0.59)# 1.5 cm
    section.left_margin = Inches(1.10)  # 2.8 cm
    section.right_margin = Inches(0.59) # 1.5 cm
    section.footer_distance = Inches(0.50) # 1.27 cm

def add_page_number_to_section(section, num_format='decimal', start_num=None):
    section.header.is_linked_to_previous = False
    section.footer.is_linked_to_previous = False
    
    pgPr = section._sectPr.find(qn('w:pgNumType'))
    if pgPr is None:
        pgPr = OxmlElement('w:pgNumType')
        section._sectPr.append(pgPr)
    pgPr.set(qn('w:fmt'), num_format)
    if start_num is not None:
        pgPr.set(qn('w:start'), str(start_num))
        
    p = section.footer.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.line_spacing = 1.0
    
    run = p.add_run()
    run.font.name = 'Times New Roman'
    run.font.size = Pt(13)
    run.font.color.rgb = RGBColor(0, 0, 0)
    
    fld = OxmlElement('w:fldSimple')
    fld.set(qn('w:instr'), 'PAGE')
    run._r.append(fld)

def format_run(run, font_name='Times New Roman', font_size_pt=14, bold=False, italic=False, color_rgb=(0,0,0)):
    run.font.name = font_name
    run.font.size = Pt(font_size_pt)
    run.bold = bold
    run.italic = italic
    run.font.color.rgb = RGBColor(*color_rgb)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_table_row_header_and_cant_split(table):
    for i, row in enumerate(table.rows):
        trPr = row._tr.get_or_add_trPr()
        cantSplit = OxmlElement('w:cantSplit')
        trPr.append(cantSplit)
        if i == 0:
            tblHeader = OxmlElement('w:tblHeader')
            trPr.append(tblHeader)

def add_toc_field(p):
    r = p.add_run()
    fldChar1 = OxmlElement('w:fldChar')
    fldChar1.set(qn('w:fldCharType'), 'begin')
    instrText = OxmlElement('w:instrText')
    instrText.set(qn('xml:space'), 'preserve')
    instrText.text = 'TOC \\o "1-3" \\h \\z \\u'
    fldChar2 = OxmlElement('w:fldChar')
    fldChar2.set(qn('w:fldCharType'), 'separate')
    fldChar3 = OxmlElement('w:fldChar')
    fldChar3.set(qn('w:fldCharType'), 'end')
    r._r.append(fldChar1)
    r._r.append(instrText)
    r._r.append(fldChar2)
    r._r.append(fldChar3)

def add_caption_field(p, label_text, seq_name):
    # p is already aligned center
    p.paragraph_format.first_line_indent = Inches(0)
    r_label = p.add_run(f'{label_text} ')
    format_run(r_label, font_size_pt=13, bold=True)
    
    # Add SEQ field
    r_seq = p.add_run()
    format_run(r_seq, font_size_pt=13, bold=True)
    fld1 = OxmlElement('w:fldSimple')
    fld1.set(qn('w:instr'), f'SEQ {seq_name} \\* ARABIC')
    r_seq._r.append(fld1)

def add_table_grid_borders(table):
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>\n'
        f'  <w:top w:val="single" w:sz="4" w:space="0" w:color="B0B0B0"/>\n'
        f'  <w:bottom w:val="single" w:sz="4" w:space="0" w:color="B0B0B0"/>\n'
        f'  <w:insideH w:val="single" w:sz="4" w:space="0" w:color="E0E0E0"/>\n'
        f'  <w:insideV w:val="single" w:sz="4" w:space="0" w:color="E0E0E0"/>\n'
        f'  <w:left w:val="none"/>\n'
        f'  <w:right w:val="none"/>\n'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

print("Base setup script template ready.")
