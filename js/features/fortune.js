// --- 愛的悄悄話：感謝信 + 元旦開運籤 ---
import { $, Q, esc } from '../core/util.js';
import { S, save } from '../core/store.js';
import { t } from '../core/i18n.js';
import { beep, noise, clack } from '../core/sound.js';
import { celebrate } from '../core/ui.js';
import { stamp } from './home.js';

// 開運籤題庫：趣味款＋正式祈福款（語言檔 fortunes.fun / fortunes.formal，格式：【籤等】內容）。
// 各語言的題數與順序相同，存的是題號，換語言後顯示同一支籤
const FUN = () => t('fortunes.fun'), FORMAL = () => t('fortunes.formal');
const FORT = () => [...FUN(), ...FORMAL()];

// 火漆印放大消散 → 上蓋 3D 翻開 → 迷你信紙抽出 → 滿版感謝信 Q 彈展開
export function openEnv() {
  const e = $('env'), b = $('e3');
  if (e.dataset.busy) return;
  e.dataset.busy = 1;
  noise(.09, 1600, 2, .6); beep(1250, .05, 'square'); b.classList.add('s1');
  setTimeout(() => { b.classList.add('s2'); noise(.35, 4200, .7, .35); }, 420);
  setTimeout(() => { b.classList.add('s3'); noise(.45, 6500, .5, .25); beep(1568, .12, 'triangle'); }, 1000);
  setTimeout(() => b.classList.add('s4'), 1750);
  setTimeout(() => {
    e.hidden = true; $('ltr').hidden = false; $('lt').classList.add('jelly');
    beep(1568, .15, 'triangle'); setTimeout(() => beep(2093, .25, 'triangle'), 110);
    if (navigator.vibrate) navigator.vibrate(30);
    setTimeout(readLetter, 700);
  }, 2050);
}

// 感謝信逐段浮現：重點螢光筆畫上、拜託小卡彈出、最後蓋上囍印；輕點信紙可直接看完
let LT = [];
export function readLetter(all) {
  const ps = [...Q('#lt .lp')];
  if (all === true) {
    if (!S.read) { LT.forEach(clearTimeout); ps.forEach(p => p.classList.add('in')); letterDone(); }
    return;
  }
  let at = 0;
  LT = ps.map((p, i) => {
    const d = at;
    at += p.classList.contains('lill') ? 1800 : p.classList.contains('tip') ? 1100 : Math.min(2200, 700 + p.textContent.trim().length * 28);
    return setTimeout(() => {
      p.classList.add('in');
      const r = p.getBoundingClientRect();
      if (r.bottom > innerHeight - 90) scrollBy({ top: r.bottom - innerHeight + 130, behavior: 'smooth' });
      if (p.classList.contains('tip')) { beep(880, .08, 'triangle'); setTimeout(() => beep(1320, .1, 'triangle'), 80); }
      else if (p.classList.contains('sig')) setTimeout(() => { noise(.1, 350, 1, .8); beep(110, .12); }, 550);
      else noise(.25, 6000, .5, .06);
      if (i === ps.length - 1) setTimeout(letterDone, 1300);
    }, d);
  });
}

function letterDone() {
  if (S.read && !$('tw').hidden) return;
  S.read = 1; save();
  $('skip').style.opacity = 0;
  if (S.fortI == null) {
    $('tw').hidden = $('fb').hidden = $('fbh').hidden = false;
    $('tw').classList.add('after'); $('fb').classList.add('after');
  }
}

// 籤筒搖晃（喀啦喀啦）→ 中央靈籤金光飛出 → 翻轉為籤詩卡
export function drawFort() {
  const b = $('fb');
  if (b.disabled) return;
  b.disabled = true; b.textContent = t('fort.shaking'); $('fbh').hidden = true;
  const fun = FUN(), formal = FORMAL();
  const i = S.fortI ?? (Math.random() < .5 ? Math.floor(Math.random() * fun.length) : fun.length + Math.floor(Math.random() * formal.length));
  const tube = $('tube');
  tube.classList.add('shk');
  if (navigator.vibrate) navigator.vibrate([40, 60, 40, 60, 40, 60, 40]);
  const iv = setInterval(() => { clack(); if (Math.random() < .5) setTimeout(clack, 35); }, 105);
  setTimeout(() => {
    clearInterval(iv); tube.classList.remove('shk');
    $('hero').style.visibility = 'hidden';
    $('fly').querySelector('span').textContent = t('fort.no')(i + 1);
    $('fly').classList.add('go');
    noise(.5, 3000, .6, .3);
    [1047, 1319, 1568, 2093].forEach((x, k) => setTimeout(() => beep(x, .18, 'triangle'), k * 90));
  }, 1500);
  setTimeout(() => { S.fortI = i; save(); showFort(true); celebrate(40); }, 2650);
}

export function showFort(anim) {
  const text = FORT()[S.fortI] || FORT()[0];
  const [a, b] = text.split('】'), o = $('fo');
  $('tw').hidden = true; $('fb').hidden = true; $('fbh').hidden = true; o.hidden = false;
  o.innerHTML = `<i class="rod t"></i><i class="rod b"></i>${[1, 2, 3, 4].map(i => `<i class="cn c${i}"><svg aria-hidden="true"><use href="#i-cloud"/></svg></i>`).join('')}<div class="ms">${t('fort.seal')}</div><span class="hd">${t('fort.head')}</span><small class="fno">${t('fort.no')(S.fortI + 1)}</small><b>${esc(a.replace('【', ''))}</b><p>${esc(b).split(t('fort.split')).map(c => `<span class="cl">${c}</span>`).join('')}</p>`;
  o.insertAdjacentHTML('beforeend', [12, 30, 52, 70, 86].map((l, i) => `<i class="fsp" style="left:${l}%;animation-delay:${i * .7}s">✦</i>`).join(''));
  o.classList.remove('flip');
  if (anim) { void o.offsetWidth; o.classList.add('flip'); }
  $('fk').hidden = !!S.stamps.fort; $('fdone').hidden = !S.stamps.fort;
}

export function takeFort() { stamp('fort'); celebrate(50); $('fk').hidden = true; $('fdone').hidden = false; }

// 重新開啟頁面時：已讀過信就直接顯示整封信；已抽過籤就顯示籤詩
export function restoreFortune() {
  if (S.fortI == null && !S.read) return;
  $('env').hidden = true; $('ltr').hidden = false;
  Q('#lt .lp').forEach(p => p.classList.add('in'));
  $('skip').style.opacity = 0;
  if (S.fortI != null) showFort();
  else $('tw').hidden = $('fb').hidden = $('fbh').hidden = false;
}
