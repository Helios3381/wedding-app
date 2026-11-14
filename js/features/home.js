// --- 首頁：集章「百年好合」、排行榜（風雲榜）---
import { CFG, KEY } from '../config.js';
import { $, esc, rd, wr } from '../core/util.js';
import { S, save } from '../core/store.js';
import { t } from '../core/i18n.js';
import { beep } from '../core/sound.js';
import { toast, voucher } from '../core/ui.js';
import { renderAlbum } from './draw.js';

// 四大主線關卡各蓋一枚章；幸福慢遞（photo）是專屬服務，不集章
export const KEYS = ['game', 'draw', 'wish', 'fort'];
const GLY = [...'百年好合'];
const task = k => t('tasks.' + k);   // [標籤, 名稱, 說明]

const tile = (k, no, ok, full) => {
  const [tag, name, desc] = task(k);
  return `<button class="tk ${ok ? 'ok' : ''}" data-go="${k}"${full ? ' style="grid-column:1/-1"' : ''}><svg class="ic"><use href="#i-${k}"/></svg>${ok ? '' : `<span class="no">${no}</span>`}<b><span>${tag}</span>${name}</b><small>${desc}</small></button>`;
};

export function stamp(k) {
  if (S.stamps[k]) return;
  S.stamps[k] = 1; save();
  const i = KEYS.indexOf(k), n = KEYS.filter(x => S.stamps[x]).length;
  toast(t('home.stampToast', { task: task(k)[1], glyph: GLY[i], n }));
  renderHome();
  if (n < 4) beep(880, .12, 'triangle');
  else {
    S.draws += CFG.BONUS; save(); renderAlbum();
    setTimeout(() => voucher(t('home.bonusTitle'), t('home.bonusMsg', { n: CFG.BONUS }), ''), 1400);
  }
}

export function renderHome() {
  const n = KEYS.filter(k => S.stamps[k]).length;
  $('hi').textContent = t('home.hi', { name: S.name || t('home.guest') });
  $('sp').textContent = n === 4 ? t('home.allDone') : t('home.progress', { n });
  $('stamps').innerHTML = KEYS.map((k, i) => `<div class="st ${S.stamps[k] ? 'ok' : ''}">${GLY[i]}</div>`).join('');
  $('tasks').innerHTML = KEYS.map((k, i) => tile(k, i + 1, S.stamps[k])).join('') + tile('photo', '✦', S.printed, 1);
  renderLB();
}

// --- 排行榜（每位賓客只留最高分）---
const SEED = [['台北伴郎阿豪', 8500], ['名古屋代表 Ken', 7200], ['香港好友 Tiffany', 6300], ['金門大雄', 5000], ['師大小張', 4200], ['大學室友阿凱', 3300]];
let LB = rd(KEY.board, null) || SEED.map(([name, score], i) => ({ name, score, ts: i }));

/** 登錄分數，回傳目前名次 */
export function addScore(name, score) {
  const o = LB.find(x => x.name === name);
  if (o) { if (score > o.score) { o.score = score; o.ts = Date.now(); } }
  else LB.push({ name, score, ts: Date.now() });
  LB.sort((a, b) => b.score - a.score || a.ts - b.ts);
  wr(KEY.board, LB);
  return LB.findIndex(x => x.name === name) + 1;
}

// 頒獎台：前 3 名（排列 2-1-3），4～6 名列表
function renderLB() {
  const top = LB.slice(0, 6), M = t('lb.medals');
  $('pod').innerHTML = [1, 0, 2].map(i => {
    const x = top[i];
    if (!x) return '<div class="pc"></div>';
    return `<div class="pc p${i + 1} ${x.name === S.name ? 'me' : ''}">${i === 0 ? '<span class="crown">👑</span>' : ''}<span class="md s${i + 1}">${i + 1}</span><b>${esc(x.name)}</b><small>${t('lb.points', { score: x.score })}</small><div class="st2"><span>${M[i]}</span><i>${t('lb.award')}</i></div></div>`;
  }).join('');
  $('lb').innerHTML = top.slice(3).map((x, i) => `<tr class="${x.name === S.name ? 'me' : ''}"><td>${i + 4}</td><td>${esc(x.name)}</td><td>${x.score}</td></tr>`).join('');
}
