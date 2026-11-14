// --- 幸福慢遞：每人限 1 張，附收件資料 ---
import { CFG } from '../config.js';
import { $, Q } from '../core/util.js';
import { S, save } from '../core/store.js';
import { t } from '../core/i18n.js';
import { beep, noise } from '../core/sound.js';
import { toast, ask, celebrate } from '../core/ui.js';
import { renderHome } from './home.js';

const MAX_BYTES = 15 * 1048576;   // 選擇的照片上限 15MB
const MAX_SIDE = 1600;            // 上傳前縮小到長邊 1600px
const UPLOAD_TIMEOUT = 45000;
// 郵遞區號：台灣 3～6 碼、日本 7 碼（可含「-」）
const ZIP = /^\d{3}(-?\d{1,4})?$/;

let objUrl;
const sendLabel = () => t('photo.send');

function pick() {
  const f = $('pf').files[0];
  if (!f) return;
  if (!f.type.startsWith('image/') || f.size > MAX_BYTES) { toast(t('photo.tooBig')); $('pf').value = ''; return; }
  if (objUrl) URL.revokeObjectURL(objUrl);
  objUrl = URL.createObjectURL(f);
  $('pv').src = objUrl; $('pv').hidden = false; $('dt').textContent = t('photo.picked');
}

// 縮小並轉成 JPEG（HEIC 等讀不出來的格式回傳空字串）
const shrink = async f => {
  const out = (src, w, h) => {
    const k = Math.min(1, MAX_SIDE / Math.max(w, h)), c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(w * k)); c.height = Math.max(1, Math.round(h * k));
    const x = c.getContext('2d');
    x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(src, 0, 0, c.width, c.height);
    return c.toDataURL('image/jpeg', .85);
  };
  try { const i = new Image(), u = URL.createObjectURL(f); i.src = u; try { await i.decode(); } finally { URL.revokeObjectURL(u); } return out(i, i.naturalWidth, i.naturalHeight); } catch (e) { }
  try { const b = await createImageBitmap(f); const r = out(b, b.width, b.height); b.close && b.close(); return r; } catch (e) { }
  return '';
};

function lockPhoto() {
  $('pq').textContent = '0/1'; $('pq').classList.add('out');
  $('pf').disabled = true; $('dz').style.pointerEvents = 'none';
  $('dt').textContent = t('photo.locked'); $('pv').hidden = true;
  Q('.form input').forEach(i => i.disabled = true);
  $('pb').disabled = true; $('pb').textContent = t('photo.sent');
}

export async function sendPhoto() {
  // 全形英數、全形空白與各種破折號換成半形，再檢查格式
  const hw = s => s.replace(/[！-～]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0)).replace(/[　−–—‐]/g, c => c == '　' ? ' ' : '-');
  const f = $('pf').files[0], v = id => hw($(id).value).trim(), n = $('rn').value.trim(), ph = v('rp'), z = v('rz'), a = $('ra').value.trim();
  const bad = !f ? t('photo.errNoPhoto') : !n ? t('photo.errName')
    : !/^[0-9+\-\s()#.]+$/.test(ph) || ph.replace(/\D/g, '').length < 8 ? t('photo.errPhone')
      : !ZIP.test(z) ? t('photo.errZip') : a.length < 6 ? t('photo.errAddr') : '';
  if (bad) { toast(bad); $('pn').textContent = '⚠️ ' + bad; return; }
  if (!await ask(t('photo.confirm'))) return;
  $('pb').disabled = true; $('pb').textContent = t('photo.uploading');
  const imgData = await shrink(f);
  if (!imgData) {
    $('pb').disabled = false; $('pb').textContent = sendLabel();
    toast(t('photo.unreadable')); $('pn').textContent = '⚠️ ' + t('photo.unreadableHelp');
    return;
  }
  const d = { guest: S.name, recipient: n, phone: ph, zip: z, addr: a };
  let ok, err = '';
  // 有 Apps Script：照片＋資料一次送出，由 Apps Script 寫進表單；否則直接送 Google 表單（不含照片）
  if (CFG.PHOTO_API) {
    try {
      const ctl = new AbortController(), tm = setTimeout(() => ctl.abort(), UPLOAD_TIMEOUT);
      const body = JSON.stringify({ ...d, img: imgData });
      try {
        const res = await fetch(CFG.PHOTO_API, { method: 'POST', body, signal: ctl.signal });
        clearTimeout(tm);
        const tx = await res.text(); let r = null;
        try { r = JSON.parse(tx); } catch { }
        if (!r) err = t('photo.errNoReply'); else if (!r.ok) err = t('photo.errServer') + r.error; else ok = true;
      } catch (e) {
        clearTimeout(tm);
        if (e.name === 'AbortError') err = t('photo.errTimeout');
        else {
          // 讀不到回應（常見於瀏覽器擋跨網域回應）：改用 no-cors 直接送，網路有送達即視為成功
          try { await fetch(CFG.PHOTO_API, { method: 'POST', mode: 'no-cors', body }); ok = true; } catch (e2) { err = t('photo.errOffline'); }
        }
      }
    } catch (e) { err = t('photo.errProcess'); }
  } else {
    ok = await gform(d);
    if (!ok) err = t('photo.errForm');
  }
  if (!ok) {
    $('pb').disabled = false; $('pb').textContent = sendLabel();
    toast(t('photo.failed')); $('pn').textContent = '⚠️ ' + t('photo.failedPrefix') + err;
    return;
  }
  const src = objUrl;
  S.printed = true; save(); lockPhoto(); renderHome(); postAnim(src);
}

// 送進 Google 表單（no-cors：Google 不回傳結果，網路送達即視為成功）
function gform(d) {
  const G = CFG.GFORM;
  if (!G.action) return Promise.resolve(true);
  const b = new URLSearchParams();
  for (const k in G.f) if (G.f[k]) b.append(G.f[k], d[k] || '');
  return fetch(G.action, { method: 'POST', mode: 'no-cors', body: b }).then(() => true).catch(() => false);
}

// 拍立得飛入郵筒槽 → 郵筒一吞 → 郵戳蓋下
function postAnim(src) {
  const o = $('post');
  $('polimg').hidden = !src; $('polph').hidden = !!src;
  if (src) $('polimg').src = src;
  o.classList.remove('s1', 's2', 's3'); void o.offsetWidth; o.classList.add('on');
  setTimeout(() => { o.classList.add('s1'); noise(.6, 5000, .6, .2); }, 500);
  setTimeout(() => { o.classList.add('s2'); beep(140, .18); noise(.12, 900, 1.5, .5); }, 1650);
  setTimeout(() => { o.classList.add('s3'); noise(.1, 350, 1, 1); beep(90, .15, 'square'); if (navigator.vibrate) navigator.vibrate(80); }, 2250);
  setTimeout(() => celebrate(40), 2550);
}

export function initPhoto() {
  $('pf').addEventListener('change', pick);
  $('pb').textContent = sendLabel();
  $('pn').textContent = (CFG.PHOTO_API || CFG.GFORM.action) ? t('photo.note') : t('photo.demo');
  if (S.printed) lockPhoto();
}
