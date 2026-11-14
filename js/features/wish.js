// --- 愛的留言板：金句一鍵填入 + 跑馬燈 + 全場彈幕 ---
import { KEY, FIREBASE } from '../config.js';
import { $, Q, esc, pick1, rd, wr } from '../core/util.js';
import { S, save, sync, app } from '../core/store.js';
import { firebase } from '../core/firebase.js';
import { t } from '../core/i18n.js';
import { beep } from '../core/sound.js';
import { toast, celebrate } from '../core/ui.js';
import { stamp } from './home.js';

const LOT_MAX = 3;                // 抽獎機會：每則留言算 1 次，最多 3 次
const MQ_SPEED = 65;              // 跑馬燈速度：每秒移動像素，數字越小越慢
const MAX_PICK = 2;               // 金句最多選 2 句
const SHOW = 40;                  // 跑馬燈與彈幕輪播使用最新的幾則留言
const NEW_GAP = 1200;             // 同時收到好幾則新留言時，彈幕間隔（毫秒）

// 目前的金句分頁與已選的金句（金句本身在語言檔的 chips：{ name, sub, items }）
let CG = 0, SEL = [];
// 全場的留言（新的在前）。Firebase 讀到之前、或還沒有任何留言時，先顯示語言檔的範例
let WS = t('wish.seeds');
let dmOn = rd(KEY.danmaku, false);
let dmLane = 0;
// 已經顯示過的留言（Firebase 的 key）。第一次讀取之後才出現的 key 就是別人剛送出的留言
const seen = new Set();
let synced = false;

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

// --- 全場共用的留言：Firebase Realtime Database 的 wedding_messages（沿用舊網站的資料與格式 { name, message, timestamp }）---
function listenWishes() {
  firebase().then(({ db, ref, query, limitToLast, onValue }) => onValue(query(ref(db, FIREBASE.MESSAGES), limitToLast(SHOW)), snap => {
    const list = [];
    snap.forEach(c => {
      const v = c.val() || {};
      if (v.message) list.push({ key: c.key, text: `${v.message} —— ${v.name || t('home.guest')}`, ts: typeof v.timestamp === 'number' ? v.timestamp : 0 });
    });
    list.sort((a, b) => b.ts - a.ts);
    // 別人剛送出的留言：每支手機都飛一次 NEW 彈幕（自己的留言在送出時已經飛過）
    if (synced) list.filter(m => !seen.has(m.key)).reverse().forEach((m, i) => setTimeout(() => danmaku(m.text, true), i * NEW_GAP));
    list.forEach(m => seen.add(m.key));
    synced = true;
    if (list.length) { WS = list.map(m => m.text); renderWish(); }
  }, e => console.warn('[wishes]', e))).catch(e => console.warn('[wishes]', e));
}

async function postWish(name, message) {
  try {
    const { db, ref, push, set, serverTimestamp } = await firebase();
    const r = push(ref(db, FIREBASE.MESSAGES));
    seen.add(r.key);   // 先登記 key，Firebase 回傳這則留言時不會再飛一次
    await set(r, { name, message, timestamp: serverTimestamp() });
  } catch (e) {
    console.error('留言送出失敗：', e);
    toast(t('wish.failed'));
  }
}

export function sendWish() {
  const m = $('wt').value.trim();
  if (!m) { toast(t('wish.empty')); return; }
  S.myW.push(m); save(); renderLot();
  const lot = Math.min(LOT_MAX, S.myW.length);
  const name = S.name || t('home.guest'), w = `${m} —— ${name}`;
  WS.unshift(w); WS = WS.slice(0, SHOW);
  renderWish(); danmaku(w, true); sync('wish', { text: m });
  postWish(name, m);
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
  listenWishes();
}
