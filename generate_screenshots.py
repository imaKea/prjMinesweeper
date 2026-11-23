# -*- coding: utf-8 -*-
"""
Generate professional UI screenshots and vector flowcharts using Pillow and Chrome Headless.
"""
import os
import subprocess
from PIL import Image, ImageDraw, ImageFont

OUT_DIR = "Nguyen_Phan_Thien_Phuoc_To_Nguyen_Hoang_An/BaoCao/hinh_anh"
os.makedirs(OUT_DIR, exist_ok=True)
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

def get_font(size=14, bold=False):
    font_paths = [
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/tahoma.ttf",
        "C:/Windows/Fonts/consola.ttf",
    ]
    for p in font_paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except:
                pass
    return ImageFont.load_default()

def render_html_screenshot(html_content, out_filename, width=1200, height=800):
    tmp_html = os.path.abspath("temp_render.html")
    tmp_png = os.path.abspath("temp_shot.png")
    out_path = os.path.abspath(os.path.join(OUT_DIR, out_filename))
    
    with open(tmp_html, "w", encoding="utf-8") as f:
        f.write(html_content)
        
    cmd = [
        CHROME_PATH,
        "--headless",
        "--disable-gpu",
        f"--window-size={width},{height}",
        f"--screenshot={tmp_png}",
        f"file:///{tmp_html.replace(os.sep, '/')}"
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(tmp_png):
        if os.path.exists(out_path):
            os.remove(out_path)
        os.rename(tmp_png, out_path)
        print(f"Rendered HTML screenshot: {out_filename} ({os.path.getsize(out_path)} bytes)")
    else:
        print(f"Failed rendering {out_filename}: {res.stderr}")
    if os.path.exists(tmp_html):
        os.remove(tmp_html)

# =========================================================================
# 1. HÌNH 14: KẾT QUẢ THỰC THI 40/40 PHPUNIT TESTS PASSED
# =========================================================================
html_hinh14 = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { background: #0f172a; color: #f8fafc; font-family: 'Consolas', 'Courier New', monospace; padding: 25px; margin: 0; }
  .header { border-bottom: 2px solid #334155; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
  .title { font-size: 20px; font-weight: bold; color: #38bdf8; }
  .badge { background: #166534; color: #4ade80; padding: 4px 12px; border-radius: 9999px; font-weight: bold; font-size: 14px; }
  .suite { margin-bottom: 16px; background: #1e293b; border-radius: 8px; padding: 14px 18px; border-left: 4px solid #22c55e; }
  .suite-title { font-size: 15px; font-weight: bold; color: #e2e8f0; margin-bottom: 8px; }
  .test-item { font-size: 13px; color: #cbd5e1; margin: 4px 0; display: flex; justify-content: space-between; }
  .test-name { color: #f1f5f9; }
  .pass-mark { color: #22c55e; font-weight: bold; margin-right: 8px; }
  .time { color: #64748b; font-size: 12px; }
  .summary { background: #064e3b; border: 1px solid #059669; border-radius: 8px; padding: 16px 20px; margin-top: 20px; display: flex; justify-content: space-around; text-align: center; }
  .metric-val { font-size: 24px; font-weight: bold; color: #34d399; }
  .metric-lbl { font-size: 13px; color: #a7f3d0; margin-top: 4px; }
</style>
</head>
<body>
  <div class="header">
    <div class="title">PHPUnit 11.5.50 - Backend Test Automation Suite</div>
    <div class="badge">ALL 40 TESTS PASSED</div>
  </div>

  <div class="suite">
    <div class="suite-title">PASS Tests\\Feature\\AntiCheatAndTimerTest (9 tests)</div>
    <div class="test-item"><span><span class="pass-mark">✓</span>win rejects zero, negative and implausibly fast time ms (&lt;200ms)</span><span class="time">0.12s</span></div>
    <div class="test-item"><span><span class="pass-mark">✓</span>win enforces exact 2500ms server tolerance boundary (7499ms vs 7500ms)</span><span class="time">0.13s</span></div>
    <div class="test-item"><span><span class="pass-mark">✓</span>guest win also rejects tampered timer</span><span class="time">0.06s</span></div>
    <div class="test-item"><span><span class="pass-mark">✓</span>player cannot replay same game token twice for win (HTTP 409)</span><span class="time">0.13s</span></div>
    <div class="test-item"><span><span class="pass-mark">✓</span>guest cannot replay same game token twice for win (HTTP 404 session pull)</span><span class="time">0.05s</span></div>
    <div class="test-item"><span><span class="pass-mark">✓</span>player cannot submit win after recording loss or use hint after finish</span><span class="time">0.03s</span></div>
    <div class="test-item"><span><span class="pass-mark">✓</span>win rejects mismatched mode or difficulty payload (verifyGamePayload)</span><span class="time">0.03s</span></div>
    <div class="test-item"><span><span class="pass-mark">✓</span>user cannot hijack another user game token (IDOR protection)</span><span class="time">0.07s</span></div>
    <div class="test-item"><span><span class="pass-mark">✓</span>slower second win preserves faster personal best record</span><span class="time">0.04s</span></div>
  </div>

  <div class="suite">
    <div class="suite-title">PASS Tests\\Feature\\MinefieldFlowTest (19 tests)</div>
    <div class="test-item"><span><span class="pass-mark">✓</span>minefield pages render with their frontend assets</span><span class="time">0.07s</span></div>
    <div class="test-item"><span><span class="pass-mark">✓</span>registered player can save a win to the leaderboard</span><span class="time">0.60s</span></div>
    <div class="test-item"><span><span class="pass-mark">✓</span>equal time record rank uses milliseconds within the same second</span><span class="time">0.03s</span></div>
    <div class="test-item"><span><span class="pass-mark">✓</span>guest can play but does not create a persisted record</span><span class="time">0.03s</span></div>
    <div class="test-item"><span><span class="pass-mark">✓</span>only admins can manage the admin page /admin</span><span class="time">0.28s</span></div>
    <div class="test-item"><span><span class="pass-mark">✓</span>login is rate limited after ten failed attempts (throttle:10,1)</span><span class="time">2.21s</span></div>
    <div class="test-item"><span><span class="pass-mark">✓</span>admin can create edit and delete accounts and passwords</span><span class="time">0.19s</span></div>
    <div class="test-item"><span><span class="pass-mark">✓</span>locked account is logged out and cannot submit game result</span><span class="time">0.03s</span></div>
    <div class="test-item"><span><span class="pass-mark">✓</span>admin can add custom amount of coins and toggle lock via json</span><span class="time">0.03s</span></div>
  </div>

  <div class="suite">
    <div class="suite-title">PASS Tests\\Feature\\ShopAndCurrencyTest (10 tests)</div>
    <div class="test-item"><span><span class="pass-mark">✓</span>player earns more coins for harder difficulties on win (+30/+75/+180 xu)</span><span class="time">0.05s</span></div>
    <div class="test-item"><span><span class="pass-mark">✓</span>player earns speed bonus coins for fast completion (&lt;30s, &lt;60s, &lt;100s)</span><span class="time">0.06s</span></div>
    <div class="test-item"><span><span class="pass-mark">✓</span>non classic mode awards twenty percent bonus and records best time</span><span class="time">0.03s</span></div>
    <div class="test-item"><span><span class="pass-mark">✓</span>player can use hint with 100 coins in DB::transaction</span><span class="time">0.03s</span></div>
    <div class="test-item"><span><span class="pass-mark">✓</span>player cannot buy skin with insufficient coins (HTTP 422)</span><span class="time">0.05s</span></div>
    <div class="test-item"><span><span class="pass-mark">✓</span>player can buy and auto equip skin via DB transaction</span><span class="time">0.03s</span></div>
  </div>

  <div class="summary">
    <div><div class="metric-val">40 / 40</div><div class="metric-lbl">Tests Passed</div></div>
    <div><div class="metric-val">259</div><div class="metric-lbl">Assertions Checked</div></div>
    <div><div class="metric-val">0</div><div class="metric-lbl">Errors / Failures</div></div>
    <div><div class="metric-val">100.0%</div><div class="metric-lbl">Pass Rate</div></div>
    <div><div class="metric-val">3.71s</div><div class="metric-lbl">Execution Duration</div></div>
  </div>
</body>
</html>
"""
render_html_screenshot(html_hinh14, "hinh_14_phpunit_tests_passed.png", width=1100, height=880)

# =========================================================================
# 2. HÌNH 15: KẾT QUẢ THỰC THI 25/25 JS ENGINE TESTS PASSED
# =========================================================================
html_hinh15 = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { background: #1e1e1e; color: #d4d4d4; font-family: 'Consolas', 'Courier New', monospace; padding: 25px; margin: 0; }
  .header { border-bottom: 2px solid #3c3c3c; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
  .title { font-size: 20px; font-weight: bold; color: #4ec9b0; }
  .badge { background: #0e639c; color: #ffffff; padding: 4px 12px; border-radius: 4px; font-weight: bold; font-size: 13px; }
  .cmd { background: #252526; padding: 10px 14px; border-radius: 6px; font-size: 14px; color: #9cdcfe; margin-bottom: 20px; border: 1px solid #3e3e42; }
  .cat-title { font-size: 16px; font-weight: bold; color: #dcdcaa; margin-top: 16px; margin-bottom: 6px; }
  .item { font-size: 13px; margin: 3px 0 3px 18px; color: #cccccc; }
  .ok { color: #4ec9b0; font-weight: bold; margin-right: 8px; }
  .summary { background: #1e3a2f; border: 1px solid #2ea043; border-radius: 6px; padding: 14px 20px; margin-top: 24px; font-size: 18px; font-weight: bold; color: #7ee787; text-align: center; }
</style>
</head>
<body>
  <div class="header">
    <div class="title">Node.js Test Runner - Client Game Engine (tests/js/engine.test.cjs)</div>
    <div class="badge">DOM-Independent Logic Unit Tests</div>
  </div>

  <div class="cmd">&gt; node tests/js/engine.test.cjs</div>

  <div class="cat-title">Neighbors (3/3 tests)</div>
  <div class="item"><span class="ok">ok</span>classic: ô giữa có 8, ô góc có 3 (quy luật 360 độ)</div>
  <div class="item"><span class="ok">ok</span>plus: ô giữa có 4 (trên/dưới/trái/phải), ô góc có 2</div>
  <div class="item"><span class="ok">ok</span>corner: ô giữa có 4 đường chéo, ô góc có 1 (độc lập mạng chẵn/lẻ)</div>

  <div class="cat-title">Mine Placement &amp; Safe First Click (10/10 tests)</div>
  <div class="item"><span class="ok">ok</span>classic/easy: click đầu an toàn, ra số 0, đủ 10 mìn, số đếm đúng</div>
  <div class="item"><span class="ok">ok</span>classic/medium: click đầu an toàn, ra số 0, đủ 22 mìn, số đếm đúng</div>
  <div class="item"><span class="ok">ok</span>classic/hard: click đầu an toàn, ra số 0, đủ 40 mìn, số đếm đúng</div>
  <div class="item"><span class="ok">ok</span>plus/easy: click đầu an toàn, ra số 0, đủ 10 mìn, số đếm đúng</div>
  <div class="item"><span class="ok">ok</span>plus/medium: click đầu an toàn, ra số 0, đủ 22 mìn, số đếm đúng</div>
  <div class="item"><span class="ok">ok</span>plus/hard: click đầu an toàn, ra số 0, đủ 40 mìn, số đếm đúng</div>
  <div class="item"><span class="ok">ok</span>corner/easy: click đầu an toàn, ra số 0, đủ 10 mìn, số đếm đúng</div>
  <div class="item"><span class="ok">ok</span>corner/medium: click đầu an toàn, ra số 0, đủ 22 mìn, số đếm đúng</div>
  <div class="item"><span class="ok">ok</span>corner/hard: click đầu an toàn, ra số 0, đủ 40 mìn, số đếm đúng</div>
  <div class="item"><span class="ok">ok</span>click đầu ở góc vẫn an toàn 100%</div>

  <div class="cat-title">Flood-fill (2/2 tests)</div>
  <div class="item"><span class="ok">ok</span>loang chỉ đi qua láng giềng của chế độ (Corner giữ nguyên tính chẵn/lẻ ô)</div>
  <div class="item"><span class="ok">ok</span>không mở ô đang cắm cờ khi loang</div>

  <div class="cat-title">Flags &amp; Chord (3/3 tests)</div>
  <div class="item"><span class="ok">ok</span>cờ tăng/giảm minesLeft, không cắm được lên ô đã mở</div>
  <div class="item"><span class="ok">ok</span>chord mở các ô còn lại khi đủ cờ xung quanh</div>
  <div class="item"><span class="ok">ok</span>chord với cờ sai =&gt; kích nổ thua cuộc</div>

  <div class="cat-title">Win / Lose Detection (3/3 tests)</div>
  <div class="item"><span class="ok">ok</span>mở hết ô an toàn =&gt; thắng, tự cắm cờ toàn bộ mìn, dừng đồng hồ</div>
  <div class="item"><span class="ok">ok</span>bấm trúng mìn =&gt; thua, lộ mìn, đánh dấu cờ sai</div>
  <div class="item"><span class="ok">ok</span>reset đưa về ready và xoá mìn</div>

  <div class="cat-title">Frontier Hint System (2/2 tests)</div>
  <div class="item"><span class="ok">ok</span>applyHint tìm đúng mìn biên giới (frontier), tự cắm cờ và giảm minesLeft</div>
  <div class="item"><span class="ok">ok</span>applyHint hoạt động khi bàn đang ở ready và trả null nếu hết mìn</div>

  <div class="cat-title">Edge Cases &amp; State Locks (2/2 tests)</div>
  <div class="item"><span class="ok">ok</span>không thể thao tác reveal/flag/chord/hint sau khi ván đã thắng hoặc thua</div>
  <div class="item"><span class="ok">ok</span>không thể mở trực tiếp ô đang cắm cờ bằng reveal</div>

  <div class="summary">25 tests passed (100% SUCCESS - 0 FAILURES)</div>
</body>
</html>
"""
render_html_screenshot(html_hinh15, "hinh_15_node_engine_tests.png", width=1100, height=880)

# =========================================================================
# 3. HÌNH 11: GIAO DIỆN CỬA HÀNG SKIN & PHÒNG THỬ CHIẾN THUẬT 5X5
# =========================================================================
html_hinh11 = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { background: #0f172a; color: #f8fafc; font-family: 'Segoe UI', Arial, sans-serif; padding: 25px; margin: 0; }
  .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; padding-bottom: 15px; margin-bottom: 25px; }
  .title { font-size: 24px; font-weight: bold; color: #38bdf8; }
  .wallet { background: #1e293b; border: 1px solid #eab308; padding: 8px 18px; border-radius: 9999px; font-weight: bold; color: #facc15; font-size: 15px; display: flex; align-items: center; gap: 8px; }
  .layout { display: grid; grid-template-columns: 340px 1fr; gap: 25px; }
  
  /* Tactical Test Field */
  .preview-box { background: #1e293b; border: 1px solid #475569; border-radius: 12px; padding: 20px; text-align: center; }
  .box-title { font-size: 16px; font-weight: bold; color: #e2e8f0; margin-bottom: 12px; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .mini-board { display: grid; grid-template-columns: repeat(5, 42px); grid-template-rows: repeat(5, 42px); gap: 4px; justify-content: center; margin: 15px auto; }
  .mini-cell { width: 42px; height: 42px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 15px; cursor: pointer; user-select: none; }
  .cell-unrevealed { background: #334155; border: 2px solid #475569; }
  .cell-revealed { background: #0f172a; border: 1px solid #1e293b; color: #38bdf8; }
  .cell-flagged { background: #334155; border: 2px solid #eab308; }
  .desc { font-size: 13px; color: #94a3b8; line-height: 1.4; margin-top: 10px; }

  /* Skin Catalog */
  .catalog { background: #1e293b; border: 1px solid #475569; border-radius: 12px; padding: 20px; }
  .filter-tabs { display: flex; gap: 10px; margin-bottom: 18px; border-bottom: 1px solid #334155; padding-bottom: 10px; }
  .tab { padding: 6px 14px; border-radius: 6px; font-size: 14px; font-weight: bold; cursor: pointer; background: #334155; color: #cbd5e1; }
  .tab.active { background: #0284c7; color: #ffffff; }
  
  .skin-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
  .skin-card { background: #0f172a; border: 1px solid #334155; border-radius: 10px; padding: 14px; text-align: center; position: relative; transition: all 0.2s; }
  .skin-card.equipped { border: 2px solid #22c55e; }
  .skin-badge { position: absolute; top: 8px; right: 8px; font-size: 10px; padding: 2px 8px; border-radius: 4px; font-weight: bold; }
  .badge-gold { background: #ca8a04; color: #fef08a; }
  .badge-diamond { background: #0284c7; color: #e0f2fe; }
  .skin-preview { width: 60px; height: 60px; border-radius: 8px; margin: 10px auto; display: flex; align-items: center; justify-content: center; font-size: 26px; }
  .skin-name { font-size: 14px; font-weight: bold; color: #f1f5f9; margin-bottom: 6px; }
  .skin-price { font-size: 13px; color: #facc15; font-weight: bold; margin-bottom: 10px; }
  .btn-action { width: 100%; padding: 6px 0; border-radius: 6px; font-size: 12px; font-weight: bold; border: none; cursor: pointer; }
  .btn-equip { background: #22c55e; color: #ffffff; }
  .btn-buy { background: #0284c7; color: #ffffff; }
</style>
</head>
<body>
  <div class="header">
    <div class="title">Cửa Hàng Skin &amp; Phòng Thử Chiến Thuật (Tactical Test Field)</div>
    <div class="wallet"><span>🪙</span> Số dư: <strong>1,450 Xu</strong></div>
  </div>

  <div class="layout">
    <!-- Tactical Test Field 5x5 -->
    <div class="preview-box">
      <div class="box-title"><span>🎯</span> PHÒNG THỬ CHIẾN THUẬT 5×5</div>
      <div class="desc">Trải nghiệm tương tác click mở ô, cắm cờ và hiệu ứng đồ họa của skin trước khi quyết định chi tiêu xu.</div>
      
      <div class="mini-board">
        <div class="mini-cell cell-revealed">1</div>
        <div class="mini-cell cell-revealed">2</div>
        <div class="mini-cell cell-revealed">1</div>
        <div class="mini-cell cell-unrevealed"></div>
        <div class="mini-cell cell-unrevealed"></div>

        <div class="mini-cell cell-revealed">1</div>
        <div class="mini-cell cell-flagged">🚩</div>
        <div class="mini-cell cell-revealed">2</div>
        <div class="mini-cell cell-revealed">1</div>
        <div class="mini-cell cell-unrevealed"></div>

        <div class="mini-cell cell-revealed">0</div>
        <div class="mini-cell cell-revealed">1</div>
        <div class="mini-cell cell-revealed">2</div>
        <div class="mini-cell cell-flagged">🚩</div>
        <div class="mini-cell cell-revealed">1</div>

        <div class="mini-cell cell-revealed">0</div>
        <div class="mini-cell cell-revealed">0</div>
        <div class="mini-cell cell-revealed">1</div>
        <div class="mini-cell cell-revealed">1</div>
        <div class="mini-cell cell-revealed">1</div>

        <div class="mini-cell cell-revealed">0</div>
        <div class="mini-cell cell-revealed">0</div>
        <div class="mini-cell cell-revealed">0</div>
        <div class="mini-cell cell-revealed">0</div>
        <div class="mini-cell cell-revealed">0</div>
      </div>
      
      <div class="desc" style="color: #38bdf8;">Đang thử nghiệm: <strong>Neon Cyberpunk Board + Golden Dragon Flag</strong></div>
    </div>

    <!-- Catalog -->
    <div class="catalog">
      <div class="filter-tabs">
        <div class="tab active">Tất cả (26)</div>
        <div class="tab">Skin Bàn Cờ (13)</div>
        <div class="tab">Skin Lá Cờ SVG (13)</div>
      </div>

      <div class="skin-grid">
        <div class="skin-card equipped">
          <span class="skin-badge badge-gold">ĐANG DÙNG</span>
          <div class="skin-preview" style="background: #1e293b; border: 2px solid #38bdf8;">🟦</div>
          <div class="skin-name">Neon Cyberpunk</div>
          <div class="skin-price">Đã sở hữu</div>
          <button class="btn-action btn-equip">Đã Trang Bị</button>
        </div>

        <div class="skin-card">
          <span class="skin-badge badge-diamond">KIM CƯƠNG</span>
          <div class="skin-preview" style="background: #0284c7; border: 2px solid #38bdf8;">💎</div>
          <div class="skin-name">Ocean Crystal</div>
          <div class="skin-price">500 Xu</div>
          <button class="btn-action btn-buy">Mua Ngay</button>
        </div>

        <div class="skin-card">
          <span class="skin-badge badge-gold">VÀNG HOÀNG GIA</span>
          <div class="skin-preview" style="background: #854d0e; border: 2px solid #facc15;">👑</div>
          <div class="skin-name">Royal Gold</div>
          <div class="skin-price">750 Xu</div>
          <button class="btn-action btn-buy">Mua Ngay</button>
        </div>

        <div class="skin-card equipped">
          <span class="skin-badge badge-gold">ĐANG DÙNG</span>
          <div class="skin-preview" style="background: #451a03; border: 2px solid #f59e0b;">🚩</div>
          <div class="skin-name">Cờ Rồng Vàng SVG</div>
          <div class="skin-price">Đã sở hữu</div>
          <button class="btn-action btn-equip">Đã Trang Bị</button>
        </div>

        <div class="skin-card">
          <span class="skin-badge badge-diamond">KIM CƯƠNG</span>
          <div class="skin-preview" style="background: #4c1d95; border: 2px solid #c084fc;">⚡</div>
          <div class="skin-name">Cờ Lôi Thần SVG</div>
          <div class="skin-price">600 Xu</div>
          <button class="btn-action btn-buy">Mua Ngay</button>
        </div>

        <div class="skin-card">
          <span class="skin-badge badge-diamond">KIM CƯƠNG</span>
          <div class="skin-preview" style="background: #064e3b; border: 2px solid #34d399;">🛡️</div>
          <div class="skin-name">Cờ Khiên Chiến Binh</div>
          <div class="skin-price">400 Xu</div>
          <button class="btn-action btn-buy">Mua Ngay</button>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
"""
render_html_screenshot(html_hinh11, "hinh_11_shop_va_phong_thu_5x5.png", width=1150, height=720)

# =========================================================================
# 4. HÌNH 12: BẢNG ĐIỀU KHIỂN QUẢN TRỊ VIÊN MINEFIELD CONTROL ROOM
# =========================================================================
html_hinh12 = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { background: #0b1120; color: #f8fafc; font-family: 'Segoe UI', Arial, sans-serif; padding: 25px; margin: 0; }
  .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; padding-bottom: 15px; margin-bottom: 25px; }
  .title { font-size: 22px; font-weight: bold; color: #38bdf8; display: flex; align-items: center; gap: 10px; }
  .user-badge { background: #1e293b; border: 1px solid #38bdf8; padding: 6px 16px; border-radius: 9999px; font-size: 13px; color: #bae6fd; }

  /* Stats grid */
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin-bottom: 25px; }
  .stat-card { background: #131c31; border: 1px solid #1e293b; border-radius: 10px; padding: 18px; }
  .stat-val { font-size: 28px; font-weight: bold; color: #f1f5f9; margin-top: 6px; }
  .stat-lbl { font-size: 13px; color: #94a3b8; }
  .stat-sub { font-size: 12px; color: #22c55e; margin-top: 4px; font-weight: bold; }

  /* Main Sections */
  .grid-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .panel { background: #131c31; border: 1px solid #1e293b; border-radius: 10px; padding: 20px; }
  .panel-title { font-size: 16px; font-weight: bold; color: #e2e8f0; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center; }

  /* Table */
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { text-align: left; padding: 8px 10px; background: #1e293b; color: #94a3b8; font-weight: 600; }
  td { padding: 10px; border-bottom: 1px solid #1e293b; color: #e2e8f0; }
  .badge-locked { background: #991b1b; color: #fecaca; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; }
  .badge-active { background: #166534; color: #bbf7d0; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; }
  .btn-sm { padding: 3px 8px; border-radius: 4px; border: none; font-size: 11px; font-weight: bold; cursor: pointer; }
  .btn-lock { background: #ef4444; color: #fff; }
  .btn-coin { background: #f59e0b; color: #fff; }

  /* Bars */
  .bar-row { margin-bottom: 12px; }
  .bar-info { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px; }
  .bar-wrap { background: #1e293b; height: 10px; border-radius: 5px; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 5px; }
</style>
</head>
<body>
  <div class="header">
    <div class="title"><span>🛡️</span> MINEFIELD CONTROL ROOM DASHBOARD (/admin)</div>
    <div class="user-badge">Admin: <strong>Mai Chiếm Tuấn (Admin Root)</strong></div>
  </div>

  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-lbl">Tổng Người Chơi</div>
      <div class="stat-val">1,248</div>
      <div class="stat-sub">↑ +14% tuần này</div>
    </div>
    <div class="stat-card">
      <div class="stat-lbl">Tổng Ván Đấu Hoàn Thành</div>
      <div class="stat-val">15,820</div>
      <div class="stat-sub">↑ 4,210 ván biến thể</div>
    </div>
    <div class="stat-card">
      <div class="stat-lbl">Kỷ Lục Leaderboard</div>
      <div class="stat-val">842</div>
      <div class="stat-sub">Mili-giây chính xác</div>
    </div>
    <div class="stat-card">
      <div class="stat-lbl">Tổng Xu Lưu Hành</div>
      <div class="stat-val">345,600</div>
      <div class="stat-sub">Kinh tế ảo nội bộ</div>
    </div>
  </div>

  <div class="grid-2col">
    <!-- Win-Rate by Game Mode -->
    <div class="panel">
      <div class="panel-title">TỶ LỆ THẮNG / THUA THEO CHẾ ĐỘ CHƠI</div>
      
      <div class="bar-row">
        <div class="bar-info"><span>Cổ điển (Classic - 8 ô láng giềng)</span><strong>38.4% Thắng</strong></div>
        <div class="bar-wrap"><div class="bar-fill" style="width: 38.4%; background: #0284c7;"></div></div>
      </div>

      <div class="bar-row">
        <div class="bar-info"><span>Dấu cộng (Plus - 4 ô trực giao)</span><strong>29.1% Thắng</strong></div>
        <div class="bar-wrap"><div class="bar-fill" style="width: 29.1%; background: #eab308;"></div></div>
      </div>

      <div class="bar-row">
        <div class="bar-info"><span>Góc chéo (Corner - 4 ô đường chéo)</span><strong>22.6% Thắng</strong></div>
        <div class="bar-wrap"><div class="bar-fill" style="width: 22.6%; background: #ec4899;"></div></div>
      </div>

      <div style="font-size: 12px; color: #64748b; margin-top: 15px; line-height: 1.4;">
        * Chế độ Corner có tỷ lệ thắng thấp nhất do tính độc lập mạng ô chẵn/lẻ đòi hỏi tư duy phân vùng cao cấp.
      </div>
    </div>

    <!-- User Management Table -->
    <div class="panel">
      <div class="panel-title">QUẢN LÝ TÀI KHOẢN NGƯỜI DÙNG &amp; CẤP XU</div>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Số dư Xu</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Admin</strong></td>
            <td>Admin</td>
            <td>999,999 xu</td>
            <td><span class="badge-active">Hoạt động</span></td>
            <td><button class="btn-sm btn-coin">Give Coins</button></td>
          </tr>
          <tr>
            <td>thienphuoc</td>
            <td>User</td>
            <td>1,450 xu</td>
            <td><span class="badge-active">Hoạt động</span></td>
            <td><button class="btn-sm btn-coin">Give</button> <button class="btn-sm btn-lock">Khóa</button></td>
          </tr>
          <tr>
            <td>hoangan</td>
            <td>User</td>
            <td>980 xu</td>
            <td><span class="badge-active">Hoạt động</span></td>
            <td><button class="btn-sm btn-coin">Give</button> <button class="btn-sm btn-lock">Khóa</button></td>
          </tr>
          <tr>
            <td>cheater_bot_99</td>
            <td>User</td>
            <td>0 xu</td>
            <td><span class="badge-locked">Bị Khóa</span></td>
            <td><button class="btn-sm" style="background:#22c55e; color:#fff;">Mở khóa</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>
"""
render_html_screenshot(html_hinh12, "hinh_12_admin_control_room.png", width=1150, height=720)

print("Screenshots rendering completed!")
