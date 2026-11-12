// Chạy: npm run test:js
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function loadEngine() {
  const file = path.join(__dirname, '../../public/minefield/js/engine.js');
  const mod = { exports: {} };
  new Function('module', 'exports', fs.readFileSync(file, 'utf8'))(mod, mod.exports);
  return mod.exports;
}

const { Minesweeper, MODES, DIFFICULTIES } = loadEngine();

// RNG có seed để test lặp lại được
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let passed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('  ok  ' + name); }
  catch (e) { console.error('FAIL  ' + name + '\n' + e.stack); process.exitCode = 1; }
}
const make = (mode, diff = 'medium', seed = 1) =>
  new Minesweeper({ ...DIFFICULTIES[diff], mode, rng: mulberry32(seed) });

console.log('Neighbors');
test('classic: ô giữa có 8, ô góc có 3', () => {
  const g = make('classic');
  assert.equal(g.neighbors(5 * 12 + 5).length, 8);
  assert.equal(g.neighbors(0).length, 3);
});
test('plus: ô giữa có 4 (trên/dưới/trái/phải), ô góc có 2', () => {
  const g = make('plus');
  assert.deepEqual([...g.neighbors(5 * 12 + 5)].sort((a, b) => a - b),
    [4 * 12 + 5, 5 * 12 + 4, 5 * 12 + 6, 6 * 12 + 5]);
  assert.equal(g.neighbors(0).length, 2);
});
test('corner: ô giữa có 4 đường chéo, ô góc có 1', () => {
  const g = make('corner');
  assert.deepEqual([...g.neighbors(5 * 12 + 5)].sort((a, b) => a - b),
    [4 * 12 + 4, 4 * 12 + 6, 6 * 12 + 4, 6 * 12 + 6]);
  assert.equal(g.neighbors(0).length, 1);
});

console.log('Mine placement');
for (const mode of Object.keys(MODES)) {
  for (const diff of Object.keys(DIFFICULTIES)) {
    test(`${mode}/${diff}: click đầu an toàn, ra số 0, đủ số mìn, số đếm đúng`, () => {
      for (let seed = 1; seed <= 40; seed++) {
        const g = make(mode, diff, seed);
        const first = Math.floor(g.cells.length / 2) + (seed % 7);
        g.reveal(first);
        assert.equal(g.cells[first].mine, false);
        assert.equal(g.cells[first].adj, 0, 'click đầu phải là ô 0');
        assert.equal(g.cells.filter(c => c.mine).length, g.mines);
        // đối chiếu adj bằng cách đếm thủ công theo offsets của chế độ
        g.cells.forEach((c, i) => {
          const r = Math.floor(i / g.cols), col = i % g.cols;
          let n = 0;
          for (const [dr, dc] of MODES[mode].offsets) {
            const rr = r + dr, cc = col + dc;
            if (rr >= 0 && rr < g.rows && cc >= 0 && cc < g.cols && g.cells[rr * g.cols + cc].mine) n++;
          }
          assert.equal(c.adj, n);
        });
      }
    });
  }
}
test('click đầu ở góc vẫn an toàn', () => {
  for (const mode of Object.keys(MODES)) {
    const g = make(mode, 'easy', 7);
    g.reveal(0);
    assert.equal(g.cells[0].mine, false);
    assert.equal(g.state === 'playing' || g.state === 'won', true);
  }
});

console.log('Flood-fill');
test('loang chỉ đi qua láng giềng của chế độ (Corner giữ nguyên tính chẵn/lẻ ô)', () => {
  const g = make('corner', 'hard', 3);
  const first = 8 * 16 + 8;
  const changed = g.reveal(first);
  const parity = (i) => (Math.floor(i / 16) + (i % 16)) % 2;
  for (const i of changed) assert.equal(parity(i), parity(first));
});
test('không mở ô đang cắm cờ khi loang', () => {
  const g = make('classic', 'medium', 5);
  g.toggleFlag(0);
  g.reveal(6 * 12 + 6);
  assert.equal(g.cells[0].revealed, false);
});

console.log('Flags & chord');
test('cờ tăng/giảm minesLeft, không cắm được lên ô đã mở', () => {
  const g = make('classic');
  assert.equal(g.minesLeft, 22);
  g.toggleFlag(3); assert.equal(g.minesLeft, 21);
  g.toggleFlag(3); assert.equal(g.minesLeft, 22);
  g.reveal(6 * 12 + 6);
  const opened = g.cells.findIndex(c => c.revealed);
  assert.deepEqual(g.toggleFlag(opened), []);
});
test('chord mở các ô còn lại khi đủ cờ', () => {
  const g = make('classic', 'medium', 11);
  g.reveal(6 * 12 + 6);
  const i = g.cells.findIndex((c, idx) => c.revealed && c.adj > 0 &&
    g.neighbors(idx).some(n => !g.cells[n].revealed && !g.cells[n].mine));
  assert.ok(i >= 0);
  const nbs = g.neighbors(i);
  assert.deepEqual(g.chord(i), [], 'chưa đủ cờ thì không làm gì');
  for (const n of nbs) if (g.cells[n].mine) g.toggleFlag(n);
  const changed = g.chord(i);
  assert.ok(changed.length > 0);
  for (const n of nbs) if (!g.cells[n].mine) assert.equal(g.cells[n].revealed, true);
  assert.equal(g.state === 'playing' || g.state === 'won', true);
});
test('chord với cờ sai => thua', () => {
  const g = make('classic', 'medium', 11);
  g.reveal(6 * 12 + 6);
  const i = g.cells.findIndex((c, idx) => c.revealed && c.adj > 0 &&
    g.neighbors(idx).some(n => g.cells[n].mine));
  const nbs = g.neighbors(i);
  const mines = nbs.filter(n => g.cells[n].mine);
  const safeHidden = nbs.filter(n => !g.cells[n].mine && !g.cells[n].revealed);
  if (safeHidden.length === 0) return; // seed không tạo được tình huống này
  // cắm cờ sai chỗ cho đủ số adj
  let need = g.cells[i].adj;
  for (const n of safeHidden) { if (need === 0) break; g.toggleFlag(n); need--; }
  for (const n of mines) { if (need === 0) break; g.toggleFlag(n); need--; }
  g.chord(i);
  assert.equal(g.state, 'lost');
});

console.log('Win / lose');
test('mở hết ô an toàn => thắng, tự cắm cờ toàn bộ mìn, dừng đồng hồ', () => {
  let t = 1000;
  const g = new Minesweeper({ ...DIFFICULTIES.easy, mode: 'classic', rng: mulberry32(9), now: () => t });
  const states = [];
  g.onStateChange = (s) => states.push(s);
  g.reveal(40);
  t += 5000;
  g.cells.forEach((c, i) => { if (!c.mine && !c.revealed) g.reveal(i); });
  assert.equal(g.state, 'won');
  assert.equal(g.minesLeft, 0);
  assert.equal(g.elapsedMs(), 5000);
  t += 9999;
  assert.equal(g.elapsedMs(), 5000, 'đồng hồ đã dừng');
  assert.deepEqual(states, ['playing', 'won']);
  assert.deepEqual(g.reveal(0), [], 'hết ván thì không thao tác được nữa');
});
test('bấm trúng mìn => thua, lộ mìn, đánh dấu cờ sai', () => {
  const g = make('classic', 'medium', 4);
  g.reveal(6 * 12 + 6);
  const mineIdx = g.cells.findIndex(c => c.mine);
  const wrong = g.cells.findIndex(c => !c.mine && !c.revealed);
  g.toggleFlag(wrong);
  g.reveal(mineIdx);
  assert.equal(g.state, 'lost');
  assert.equal(g.view(mineIdx).kind, 'exploded');
  assert.equal(g.view(wrong).kind, 'wrongflag');
  const others = g.cells.map((c, i) => i).filter(i => g.cells[i].mine && i !== mineIdx);
  for (const i of others) assert.equal(g.view(i).kind, 'mine');
});
test('reset đưa về ready và xoá mìn', () => {
  const g = make('plus', 'easy', 2);
  g.reveal(40);
  g.reset();
  assert.equal(g.state, 'ready');
  assert.equal(g.cells.some(c => c.mine || c.revealed), false);
  assert.equal(g.elapsedMs(), 0);
});

console.log('Hint');
test('applyHint tìm đúng mìn biên giới, tự cắm cờ và giảm minesLeft', () => {
  const g = make('classic', 'easy', 42);
  assert.equal(g.hasUnflaggedMine(), true);
  g.reveal(40);
  const beforeFlags = g.flags;
  const res = g.applyHint();
  assert.ok(res && typeof res.hintIndex === 'number');
  assert.equal(g.cells[res.hintIndex].mine, true);
  assert.equal(g.cells[res.hintIndex].flagged, true);
  assert.equal(g.flags, beforeFlags + 1);
  assert.deepEqual(res.changed, [res.hintIndex]);
});

test('applyHint hoạt động khi bàn đang ở ready và trả null nếu hết mìn chưa cắm cờ', () => {
  const g = make('classic', 'easy', 9);
  const firstHint = g.applyHint();
  assert.ok(firstHint && g.state === 'playing');
  assert.equal(g.cells[firstHint.hintIndex].mine, true);
  assert.equal(g.cells[firstHint.hintIndex].flagged, true);
  // Cắm cờ toàn bộ mìn còn lại
  g.cells.forEach((c, idx) => {
    if (c.mine && !c.flagged) g.toggleFlag(idx);
  });
  assert.equal(g.hasUnflaggedMine(), false);
  assert.equal(g.applyHint(), null);
});

console.log('Edge cases & state locks');
test('không thể thao tác reveal/flag/chord/hint sau khi ván đã thắng hoặc thua', () => {
  const g = make('classic', 'easy', 6);
  g.reveal(40);
  const mineIdx = g.cells.findIndex(c => c.mine);
  g.reveal(mineIdx);
  assert.equal(g.state, 'lost');
  assert.deepEqual(g.reveal(0), []);
  assert.deepEqual(g.toggleFlag(0), []);
  assert.deepEqual(g.chord(40), []);
  assert.equal(g.hasUnflaggedMine(), false);
  assert.equal(g.applyHint(), null);
});

test('không thể mở trực tiếp ô đang cắm cờ bằng reveal', () => {
  const g = make('classic', 'easy', 12);
  g.toggleFlag(10);
  assert.equal(g.cells[10].flagged, true);
  assert.deepEqual(g.reveal(10), []);
  assert.equal(g.state, 'ready');
});

console.log(`\n${passed} tests passed`);
