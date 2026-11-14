// --- 共用畫面效果：提示、彩帶、花瓣、領獎憑證、確認對話框、音效開關 ---
import { $, Q, rnd, pick1 } from './util.js';
import { S, app } from './store.js';
import { t, lang } from './i18n.js';
import { mute, setMute, fanfare } from './sound.js';

let tt;
export function toast(m) {
  const e = $('toast');
  e.textContent = m; e.classList.add('show');
  clearTimeout(tt); tt = setTimeout(() => e.classList.remove('show'), 2600);
}

// 彩帶
export function celebrate(n = 60) {
  for (let i = 0; i < n; i++) {
    const p = document.createElement('i');
    p.className = 'cf'; p.textContent = pick1(['✦', '♥', '🧧', '✿', '✦']);
    p.style.cssText = `left:${rnd(0, 100)}vw;font-size:${rnd(11, 22)}px;color:${pick1(['#c9a24f', '#e6cb8a', '#b82d4d', '#f08aa3', '#fff'])};animation-duration:${rnd(2.4, 4)}s;animation-delay:${rnd(0, .6)}s;--dx:${rnd(-80, 80)}px;font-style:normal`;
    document.body.appendChild(p); setTimeout(() => p.remove(), 4800);
  }
  fanfare();
  if (navigator.vibrate) navigator.vibrate([100, 50, 160]);
}

// 飄落的花瓣（遊戲、抽卡時暫停）
export function startPetals() {
  setInterval(() => {
    if (document.hidden || app.gameOn || app.view === 'draw' || app.view === 'game') return;
    const p = document.createElement('i');
    p.className = 'pt'; p.textContent = pick1(['🌸', '✿', '🌸']);
    p.style.cssText = `left:${rnd(0, 100)}vw;font-size:${rnd(12, 22)}px;opacity:.7;animation-duration:${rnd(9, 15)}s;--dx:${rnd(-90, 90)}px;font-style:normal`;
    document.body.appendChild(p); setTimeout(() => p.remove(), 15500);
  }, 2200);
}

// 領獎憑證（已經開著時，等前一張關掉再顯示）
export function voucher(title, msg, pre) {
  if ($('vo').classList.contains('on')) { setTimeout(() => voucher(title, msg, pre), 1500); return; }
  $('vt').textContent = title; $('vm').textContent = msg;
  $('vcode').hidden = $('vnote').hidden = !pre;
  $('vcode').textContent = `${pre}-${Math.random().toString(36).slice(2, 6).toUpperCase()}｜${S.name}｜${new Date().toLocaleTimeString(lang, { hour12: false, hour: '2-digit', minute: '2-digit' })}`;
  $('vo').classList.add('on'); celebrate(80);
}

export function ask(html) {
  return new Promise(r => {
    $('askm').innerHTML = html; $('ask').classList.add('on');
    $('asky').onclick = () => { $('ask').classList.remove('on'); r(true); };
    $('askn').onclick = () => { $('ask').classList.remove('on'); r(false); };
  });
}

export const renderMute = () => { $('mt').innerHTML = `<svg width="18" height="18" aria-hidden="true"><use href="#i-spk-${mute ? 'off' : 'on'}"/></svg>`; };
export function toggleMute() { setMute(!mute); renderMute(); toast(t(mute ? 'sound.off' : 'sound.on')); }

export const clearDanmaku = () => Q('.dm').forEach(e => e.remove());
