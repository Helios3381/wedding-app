// --- 愛的大冒險：Unity WebGL 遊戲（Jumpman 專案的 WebGL 輸出，放在 JumpmanGL/）---
// 頁面 → 遊戲：iframe 內的 callUnityStartBGM／callUnityStopBGM／callUnitySetLanguage（JumpmanGL/index.html）
// 遊戲 → 頁面：ReceiveScoreFromUnity(score)（每局結束）、deactivateFullScreen()（遊戲內的「返回網頁」）
import { GAME_URL } from '../config.js';
import { $ } from '../core/util.js';
import { S, app, sync } from '../core/store.js';
import { t, lang } from '../core/i18n.js';
import { celebrate, clearDanmaku } from '../core/ui.js';
import { addScore, stamp } from './home.js';

const SLOW_LOAD_MS = 20000;
// iPadOS Safari 預設回報為 Macintosh，要用觸控點數來判斷
const isIPad = /iPad/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);

const frame = () => $('unity');
const unityWin = () => { try { return frame().contentWindow; } catch { return null; } };
const unityReady = () => { const w = unityWin(); return !!(w && w.unityInstance); };
function callUnity(fn, arg) {
  try { const w = unityWin(); if (w && typeof w[fn] === 'function') w[fn](arg); } catch (e) { console.warn(e); }
}

// 遊戲約 11MB，第一次打開「大冒險」頁籤時才開始下載，首頁可以先快速顯示
export function loadGame() {
  const f = frame();
  if (f.getAttribute('src')) return;
  f.addEventListener('load', () => callUnity('callUnitySetLanguage', lang));   // 遊戲文字跟網頁語言一致
  f.src = GAME_URL;
  setTimeout(() => { if (!unityReady()) $('ugo-text').innerHTML = t('game.slow'); }, SLOW_LOAD_MS);
}

export function startGame() {
  if (!S.name) { $('wel').classList.add('on'); return; }
  loadGame();
  const box = $('ugame');
  app.gameOn = true; clearDanmaku();
  box.classList.add('fs'); document.documentElement.classList.add('fs-lock');
  $('ugo').hidden = true; syncBackButton();
  // iPad Safari 的原生全螢幕「往下滑」就會退出（網頁無法關閉此手勢），會跟遊戲的滑行衝突，所以 iPad 只用 CSS 滿版
  if (!isIPad) {
    if (box.requestFullscreen) box.requestFullscreen().catch(() => { });
    else if (box.webkitRequestFullscreen) box.webkitRequestFullscreen();
  }
  callUnity('callUnityStartBGM');
}

export function exitGame() {
  if (!app.gameOn) return;
  app.gameOn = false;
  $('ugame').classList.remove('fs'); document.documentElement.classList.remove('fs-lock');
  $('ugo').hidden = false; $('ugx').hidden = true;
  if (document.fullscreenElement) document.exitFullscreen().catch(() => { });
  else if (document.webkitFullscreenElement) document.webkitExitFullscreen();
  callUnity('callUnityStopBGM');
}

// 遊戲讀取完成後，「返回網頁」改由遊戲畫面內的按鈕提供（主畫面／暫停／結算），這顆按鈕會蓋住分數，只在讀取中顯示
function syncBackButton() { $('ugx').hidden = !(app.gameOn && !unityReady()); }

// 每局結束時由遊戲呼叫：登上風雲榜、蓋「百」字章
function onScore(score) {
  const s = Math.max(0, Math.round(Number(score) || 0));
  if (!S.name) return;
  const rank = addScore(S.name, s);
  sync('score', { score: s });
  stamp('game');
  $('rt').textContent = t('game.resultTitle');
  $('rm').innerHTML = t(rank <= 3 ? 'game.rankTop3' : rank <= 6 ? 'game.rankTop6' : 'game.rankOther', { score: s, rank });
  $('res').hidden = false;
  if (!app.gameOn) celebrate(rank <= 6 ? 90 : 50);
}

export function initGame() {
  // 這兩個名稱由遊戲端（WebGLPlugin.jslib）呼叫，不能改名
  window.ReceiveScoreFromUnity = onScore;
  window.deactivateFullScreen = exitGame;
  setInterval(syncBackButton, 500);
  // 用 Esc 或系統手勢離開原生全螢幕時，頁面也一起復原
  const onFsChange = () => { if (!document.fullscreenElement && !document.webkitFullscreenElement && app.gameOn && !isIPad) exitGame(); };
  document.addEventListener('fullscreenchange', onFsChange);
  document.addEventListener('webkitfullscreenchange', onFsChange);
}
