// --- 愛的留言板：金句一鍵填入 + 跑馬燈 + 全場彈幕 ---
import { KEY } from '../config.js';
import { $, Q, esc, pick1, rd, wr } from '../core/util.js';
import { S, save, sync, app } from '../core/store.js';
import { t } from '../core/i18n.js';
import { beep } from '../core/sound.js';
import { toast, celebrate } from '../core/ui.js';
import { stamp } from './home.js';

const LOT_MAX = 3;                // 抽獎機會：每則留言算 1 次，最多 3 次
const MQ_SPEED = 65;              // 跑馬燈速度：每秒移動像素，數字越小越慢
const MAX_PICK = 2;               // 金句最多選 2 句

// 目前的金句分頁與已選的金句（金句本身在語言檔的 chips：{ name, sub, items }）
let CG = 0, SEL = [];
let WS = rd(KEY.wishes, null) || t('wish.seeds');
let dmOn = rd(KEY.danmaku, false);
let dmLane = 0;

// 祝福內容與署名分色：「內容 —— 名字」
const wHTML = w => {
  const i = w.lastIndexOf(' —— ');
  return i < 0 ? `<span class="wm">${esc(w)}</span>` : `<span class="wm">${esc(w.slice(0, i))}</span><span class="wn">—— ${esc(w.slice(i + 4))}</span>`;
};

export function renderWish() {
  const m = $('mq');
  m.innerHTML = WS.slice(0, 14).map(wHTML).join('<b class="wh">♥</b>');
  m.style.animation = 'none'; void m.offsetWidth; m.style.animation = '';
  m.style.animationDuration = Math.max(20, m.scrollWidth / MQ_SPEED) + 's';
  $('wl').innerHTML = WS.slice(0, 5).map(w => `<li>🌸 ${wHTML(w)}</li>`).join('');
}

function renderChips() {
  const groups = t('chips');
  $('chips').innerHTML =
    `<div class="ctabs">${groups.map((g, i) => `<button class="${i === CG ? 'on' : ''}" data-tab="${i}">${g.name}${g.sub ? `<small>${g.sub}</small>` : ''}</button>`).join('')}</div>` +
    groups[CG].items.map((c, i) => `<button class="ch ${SEL.includes(c) ? 'sel' : ''}" data-chip="${i}">${c}</button>`).join('') +
    `<p class="chint">${t('wish.chipHint', { n: SEL.length })}</p>`;
}

function pickChip(c) {
  const ta = $('wt');
  if (SEL.includes(c)) {
    SEL = SEL.filter(x => x !== c);
    ta.value = ta.value.replace(c, '').replace(/\s{2,}/g, ' ').trim();
  } else {
    if (SEL.length >= MAX_PICK) { toast(t('wish.max')); return; }
    SEL.push(c);
    ta.value = ((ta.value.trim() ? ta.value.trim() + ' ' : '') + c).slice(0, 80);
  }
  renderChips(); beep(700, .05);
}

export function renderDmButtons() { Q('.dmt').forEach(e => e.classList.toggle('off', !dmOn)); }

// 彈幕：預設只在有新留言時飛一次；開啟後輪播舊留言
export function toggleDm() {
  dmOn = !dmOn; wr(KEY.danmaku, dmOn); renderDmButtons();
  if (!dmOn) Q('.dm').forEach(e => e.remove());
  toast(t(dmOn ? 'dm.on' : 'dm.off')); beep(520, .05);
}

// 彈幕固定在畫面上方兩條軌道、最上層；新留言加金框 NEW，輪播舊留言較淡
function danmaku(text, isNew) {
  if (document.hidden || app.gameOn || (app.view !== 'home' && app.view !== 'wish')) return;
  const d = document.createElement('div');
  d.className = 'dm' + (isNew ? ' new' : ''); d.innerHTML = '🌸 ' + wHTML(text);
  dmLane ^= 1;
  d.style.setProperty('--w', innerWidth + 'px');
  d.style.top = `calc(${dmLane ? 64 : 116}px + env(safe-area-inset-top))`;
  d.style.animation = 'dm 11s linear forwards,dmpop .5s cubic-bezier(.3,1.6,.5,1)';
  document.body.appendChild(d); setTimeout(() => d.remove(), 11500);
}

export function renderLot() {
  const n = Math.min(LOT_MAX, S.myW.length), e = $('lotn');
  e.textContent = `${n}/${LOT_MAX}`; e.classList.toggle('full', n >= LOT_MAX);
}

export function sendWish() {
  const m = $('wt').value.trim();
  if (!m) { toast(t('wish.empty')); return; }
  S.myW.push(m); save(); renderLot();
  const lot = Math.min(LOT_MAX, S.myW.length);
  const w = `${m} —— ${S.name || t('home.guest')}`;
  WS.unshift(w); WS = WS.slice(0, 40); wr(KEY.wishes, WS);
  renderWish(); danmaku(w, true); sync('wish', { text: m });
  $('wt').value = ''; SEL = []; renderChips();
  stamp('wish'); celebrate(50);
  setTimeout(() => toast(S.myW.length <= LOT_MAX ? t('wish.sent', { lot, max: LOT_MAX }) : t('wish.sentFull')), S.stamps.wish && S.myW.length > 1 ? 0 : 2700);
}

export function initWish() {
  renderChips();
  $('chips').addEventListener('click', e => {
    const tab = e.target.closest('[data-tab]');
    if (tab) { CG = +tab.dataset.tab; renderChips(); return; }
    const chip = e.target.closest('[data-chip]');
    if (chip) pickChip(t('chips')[CG].items[+chip.dataset.chip]);
  });
  setInterval(() => { if (dmOn) danmaku(pick1(WS)); }, 4500);
}
