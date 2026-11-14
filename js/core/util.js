// --- 共用小工具 ---

export const $ = id => document.getElementById(id);
export const Q = s => document.querySelectorAll(s);
export const esc = v => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const rnd = (a, b) => a + Math.random() * (b - a);
export const pick1 = a => a[Math.floor(Math.random() * a.length)];

// localStorage 在無痕模式等情況可能丟出例外，讀寫失敗時當作沒有資料
export const rd = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch { return d; } };
export const wr = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { } };

// 國字數字（籤號用）：12 → 十二、25 → 二十五
export const cnum = n => {
  const D = '〇一二三四五六七八九';
  return n < 10 ? D[n] : n < 20 ? '十' + (n % 10 ? D[n % 10] : '') : D[Math.floor(n / 10)] + '十' + (n % 10 ? D[n % 10] : '');
};
