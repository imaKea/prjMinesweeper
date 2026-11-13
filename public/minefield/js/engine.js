/*
 * Minefield game engine — pure logic, no DOM.
 * Chạy được cả trong trình duyệt (window.MinefieldEngine) lẫn Node (require) để test.
 *
 * Ý tưởng chính: mỗi chế độ chơi chỉ khác nhau ở "danh sách ô láng giềng" (offsets).
 * Mọi thuật toán (đếm mìn, loang Flood-fill, chord, sinh mìn an toàn) đều đi qua
 * neighbors(i) nên thêm chế độ mới chỉ cần thêm 1 mục vào MODES.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MinefieldEngine = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const DEFAULT_MODES = {
    classic: {
      id: 'classic', label: 'Cổ điển', hint: 'Tất cả 8 ô xung quanh',
      offsets: [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]],
    },
    plus: {
      id: 'plus', label: 'Dấu cộng', hint: '4 ô kề cạnh (ngang & dọc)',
      offsets: [[-1, 0], [0, -1], [0, 1], [1, 0]],
    },
    corner: {
      id: 'corner', label: 'Góc chéo', hint: '4 ô góc chéo',
      offsets: [[-1, -1], [-1, 1], [1, -1], [1, 1]],
    },
  };

  const DEFAULT_DIFFICULTIES = {
    easy:   { id: 'easy',   label: 'Dễ',        rows: 9,  cols: 9,  mines: 10 },
    medium: { id: 'medium', label: 'Trung bình', rows: 12, cols: 12, mines: 22 },
    hard:   { id: 'hard',   label: 'Khó',        rows: 16, cols: 16, mines: 40 },
  };

  if (typeof window !== 'undefined' && (
    !window.MF_GAME_OPTIONS ||
    !Array.isArray(window.MF_GAME_OPTIONS.modes) ||
    window.MF_GAME_OPTIONS.modes.length === 0 ||
    !Array.isArray(window.MF_GAME_OPTIONS.difficulties) ||
    window.MF_GAME_OPTIONS.difficulties.length === 0
  )) {
    throw new Error('Game options are missing. Run the Minefield database seeders and reload.');
  }

  const MODES = typeof window === 'undefined'
    ? DEFAULT_MODES
    : Object.fromEntries(window.MF_GAME_OPTIONS.modes.map((mode) => [mode.id, {
      id: mode.id,
      label: mode.label,
      hint: mode.hint,
      offsets: mode.offsets,
    }]));
  const DIFFICULTIES = typeof window === 'undefined'
    ? DEFAULT_DIFFICULTIES
    : Object.fromEntries(window.MF_GAME_OPTIONS.difficulties.map((difficulty) => [difficulty.id, {
      id: difficulty.id,
      label: difficulty.label,
      rows: Number(difficulty.rows),
      cols: Number(difficulty.cols),
      mines: Number(difficulty.mines),
    }]));

  class Minesweeper {
    /**
     * @param {{rows:number, cols:number, mines:number, mode?:string,
     *          rng?:()=>number, now?:()=>number}} opts
     */
    constructor({ rows, cols, mines, mode = 'classic', rng = Math.random, now = Date.now }) {
      if (!MODES[mode]) throw new Error('Unknown mode: ' + mode);
      if (!(mines >= 1 && mines < rows * cols)) throw new RangeError('Invalid mine count');
      this.rows = rows;
      this.cols = cols;
      this.mines = mines;
      this.mode = mode;
      this.rng = rng;
      this.now = now;
      this.offsets = MODES[mode].offsets;
      this._nbCache = new Array(rows * cols);
      this.onStateChange = null;
      this.reset();
    }

    /** Đưa bàn chơi về trạng thái 'ready' (chưa đặt mìn — mìn chỉ sinh sau cú click đầu tiên). */
    reset() {
      this.cells = Array.from({ length: this.rows * this.cols }, () => ({
        mine: false, adj: 0, revealed: false, flagged: false, exploded: false,
      }));
      this.state = 'ready'; // ready | playing | won | lost
      this.flags = 0;
      this.revealedCount = 0;
      this.startedAt = null;
      this.endedAt = null;
      this._emit();
    }

    get minesLeft() { return this.mines - this.flags; }

    elapsedMs() {
      if (this.startedAt == null) return 0;
      return (this.endedAt != null ? this.endedAt : this.now()) - this.startedAt;
    }

    /** Các ô láng giềng của ô i theo chế độ đang chơi. */
    neighbors(i) {
      let list = this._nbCache[i];
      if (list) return list;
      const r = Math.floor(i / this.cols);
      const c = i % this.cols;
      list = [];
      for (const [dr, dc] of this.offsets) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) list.push(nr * this.cols + nc);
      }
      this._nbCache[i] = list;
      return list;
    }

    /** Mô tả cách vẽ ô i (UI chỉ cần đọc hàm này). */
    view(i) {
      const c = this.cells[i];
      if (c.revealed) return c.adj > 0 ? { kind: 'number', n: c.adj } : { kind: 'empty', n: 0 };
      if (this.state === 'lost') {
        if (c.exploded) return { kind: 'exploded' };
        if (c.mine && !c.flagged) return { kind: 'mine' };
        if (c.flagged && !c.mine) return { kind: 'wrongflag' };
      }
      if (c.flagged) return { kind: 'flag' };
      return { kind: 'hidden' };
    }

    /** Mở ô i. Trả về danh sách chỉ số ô đã thay đổi. */
    reveal(i) {
      if (!this._canAct(i)) return [];
      const cell = this.cells[i];
      if (cell.revealed || cell.flagged) return [];

      if (this.state === 'ready') {
        this._placeMines(i);
        this.startedAt = this.now();
        this._setState('playing');
      }

      const changed = [];
      if (cell.mine) {
        this._lose(i, changed);
        return changed;
      }
      this._flood(i, changed);
      this._checkWin(changed);
      return changed;
    }

    /** Đặt / gỡ cờ. */
    toggleFlag(i) {
      if (!this._canAct(i)) return [];
      const cell = this.cells[i];
      if (cell.revealed) return [];
      cell.flagged = !cell.flagged;
      this.flags += cell.flagged ? 1 : -1;
      return [i];
    }

    /** Chording: bấm vào ô số đã mở, nếu đủ cờ xung quanh thì mở các ô còn lại. */
    chord(i) {
      if (!this._canAct(i)) return [];
      const cell = this.cells[i];
      if (!cell.revealed || cell.adj === 0) return [];
      const nbs = this.neighbors(i);
      let flagged = 0;
      for (const n of nbs) if (this.cells[n].flagged) flagged++;
      if (flagged !== cell.adj) return [];

      const changed = [];
      for (const n of nbs) {
        const t = this.cells[n];
        if (t.revealed || t.flagged) continue;
        if (t.mine) { this._lose(n, changed); return changed; }
        this._flood(n, changed);
      }
      this._checkWin(changed);
      return changed;
    }

    /** Kiểm tra xem còn ô mìn nào chưa được cắm cờ để gợi ý hay không. */
    hasUnflaggedMine() {
      if (this.state === 'won' || this.state === 'lost') return false;
      if (this.state === 'ready') return true;
      return this.cells.some((c) => c.mine && !c.flagged);
    }

    /**
     * Gợi ý 1 ô mìn chưa cắm cờ (ưu tiên mìn ở vùng biên tiếp giáp ô số đã mở).
     * Trả về { hintIndex, changed } hoặc null nếu không còn mìn chưa cắm cờ.
     */
    applyHint() {
      if (this.state === 'won' || this.state === 'lost') return null;

      if (this.state === 'ready') {
        const safe = Math.floor(this.rows / 2) * this.cols + Math.floor(this.cols / 2);
        this._placeMines(safe);
        this.startedAt = this.now();
        this._setState('playing');
      }

      const frontierMines = [];
      const allUnflaggedMines = [];

      for (let i = 0; i < this.cells.length; i++) {
        const c = this.cells[i];
        if (!c.mine || c.flagged) continue;
        allUnflaggedMines.push(i);
        const nbs = this.neighbors(i);
        if (nbs.some((nb) => this.cells[nb].revealed)) {
          frontierMines.push(i);
        }
      }

      const pool = frontierMines.length > 0 ? frontierMines : allUnflaggedMines;
      if (pool.length === 0) return null;

      const targetIdx = pool[Math.floor(this.rng() * pool.length)];
      this.cells[targetIdx].flagged = true;
      this.flags++;

      return { hintIndex: targetIdx, changed: [targetIdx] };
    }

    // ---------------------------------------------------------------- internals

    _canAct(i) {
      return (this.state === 'ready' || this.state === 'playing') && i >= 0 && i < this.cells.length;
    }

    _setState(s) {
      this.state = s;
      this._emit();
    }

    _emit() {
      if (typeof this.onStateChange === 'function') this.onStateChange(this.state);
    }

    /**
     * Sinh mìn SAU cú click đầu để không bao giờ thua ngay.
     * Vùng an toàn = ô được bấm + láng giềng của nó (theo chế độ) => cú click đầu luôn ra số 0
     * và loang ra. Nếu bàn quá nhỏ không đủ chỗ thì chỉ giữ an toàn cho đúng ô được bấm.
     */
    _placeMines(safe) {
      const n = this.cells.length;
      const banned = new Set([safe, ...this.neighbors(safe)]);
      let pool = [];
      for (let i = 0; i < n; i++) if (!banned.has(i)) pool.push(i);
      if (pool.length < this.mines) {
        pool = [];
        for (let i = 0; i < n; i++) if (i !== safe) pool.push(i);
      }
      // Fisher–Yates từng phần: chỉ xáo `mines` phần tử đầu.
      for (let k = 0; k < this.mines; k++) {
        const j = k + Math.floor(this.rng() * (pool.length - k));
        const tmp = pool[k]; pool[k] = pool[j]; pool[j] = tmp;
        this.cells[pool[k]].mine = true;
      }
      for (let i = 0; i < n; i++) {
        let count = 0;
        for (const nb of this.neighbors(i)) if (this.cells[nb].mine) count++;
        this.cells[i].adj = count;
      }
    }

    /** Thuật toán loang (Flood-fill, dùng stack): ô 0 mở tiếp toàn bộ láng giềng của chế độ hiện tại. */
    _flood(start, changed) {
      const stack = [start];
      while (stack.length) {
        const i = stack.pop();
        const cell = this.cells[i];
        if (cell.revealed || cell.flagged) continue;
        cell.revealed = true;
        this.revealedCount++;
        changed.push(i);
        if (cell.adj === 0) {
          for (const nb of this.neighbors(i)) {
            const t = this.cells[nb];
            if (!t.revealed && !t.flagged) stack.push(nb);
          }
        }
      }
    }

    _checkWin(changed) {
      if (this.revealedCount !== this.cells.length - this.mines) return;
      this.endedAt = this.now();
      for (let i = 0; i < this.cells.length; i++) {
        const c = this.cells[i];
        if (c.mine && !c.flagged) { c.flagged = true; this.flags++; changed.push(i); }
      }
      this._setState('won');
    }

    _lose(hit, changed) {
      this.endedAt = this.now();
      this.cells[hit].exploded = true;
      for (let i = 0; i < this.cells.length; i++) {
        const c = this.cells[i];
        if (i === hit || (c.mine && !c.flagged) || (c.flagged && !c.mine)) changed.push(i);
      }
      this._setState('lost');
    }
  }

  return { Minesweeper, MODES, DIFFICULTIES };
});
