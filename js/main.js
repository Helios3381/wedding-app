// --- 進入點：語言、頁籤切換、入席報到、按鈕動作 ---
import { COPYRIGHT } from './config.js';
import { $, Q } from './core/util.js';
import { S, save, app } from './core/store.js';
import { t, applyI18n, LANGS, lang, switchLang } from './core/i18n.js';
import { beep } from './core/sound.js';
import { toast, celebrate, startPetals, renderMute, toggleMute, clearDanmaku } from './core/ui.js';
import { renderHome, initBoard } from './features/home.js';
import { renderAlbum, drawCard, initDraw } from './features/draw.js';
import { renderWish, renderLot, toggleDm, sendWish, renderDmButtons, initWish } from './features/wish.js';
import { openEnv, readLetter, drawFort, takeFort, restoreFortune } from './features/fortune.js';
import { sendPhoto, initPhoto } from './features/photo.js';
import { loadGame, startGame, exitGame, initGame } from './features/game.js';

// 圖示（SVG symbol）集中在生成物資料夾，載入後插進頁面，<use href="#i-…"> 就能直接使用
fetch('assets/generated/icons/sprite.svg').then(r => r.text()).then(svg => {
  const box = document.createElement('div');
  box.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  box.setAttribute('aria-hidden', 'true');
  box.innerHTML = svg;
  document.body.prepend(box);
}).catch(e => console.warn('sprite', e));

function go(v) {
  app.view = v;
  if (v !== 'home' && v !== 'wish') clearDanmaku();
  Q('.v').forEach(e => e.classList.toggle('on', e.id === 'v-' + v));
  Q('nav button').forEach(e => e.classList.toggle('on', e.dataset.go === v));
  if (v === 'home') renderHome();
  if (v === 'game') loadGame();
  scrollTo({ top: 0 }); beep(520, .05);
}

function enter() {
  const n = $('nm').value.trim().slice(0, 12);
  if (!n) { toast(t('wel.need')); return; }
  S.name = n; save();
  $('wel').classList.remove('on'); celebrate(30); renderHome();
}

// 標題下的跳動文字：一個字一個 <i>，依序彈跳
function renderFun() {
  const s = t('header.fun'), el = $('fun');
  el.setAttribute('aria-label', s);
  el.innerHTML = '<b class="h">♥</b>' + [...s].map((c, i) => `<i style="--i:${i}">${c === ' ' ? '&nbsp;' : c}</i>`).join('') + '<b class="h">♥</b>';
}

function renderLangSwitch() {
  $('lang').innerHTML = LANGS.map(([code, label]) => `<button class="${code === lang ? 'on' : ''}" data-lang="${code}">${label}</button>`).join('');
}

// 按鈕動作：HTML 的 data-action="名稱" 對應這裡的函式
const ACTIONS = {
  enter, toggleMute, toggleDm, drawCard, sendWish, openEnv, drawFort, takeFort, sendPhoto, startGame, exitGame,
  readLetterAll: () => readLetter(true),
  closeVoucher: () => $('vo').classList.remove('on'),
  closePost: () => $('post').classList.remove('on'),
  closeViewer: () => $('vw').classList.remove('on')
};

document.addEventListener('click', e => {
  const l = e.target.closest('[data-lang]');
  if (l) { switchLang(l.dataset.lang); return; }
  const g = e.target.closest('[data-go]');
  if (g) { go(g.dataset.go); return; }
  const a = e.target.closest('[data-action]');
  if (a && ACTIONS[a.dataset.action]) ACTIONS[a.dataset.action](e);
});

// --- 起動 ---
applyI18n();
renderFun();
renderLangSwitch();
renderMute();
$('copyright').textContent = COPYRIGHT;
$('nm').addEventListener('keydown', e => { if (e.key === 'Enter') enter(); });
if (S.name) $('wel').classList.remove('on');
initBoard(); initDraw(); initWish(); initPhoto(); initGame();
renderWish(); renderLot(); renderAlbum(); renderHome(); renderDmButtons();
restoreFortune();
startPetals();
