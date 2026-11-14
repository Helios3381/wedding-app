// --- 幸福盲盒：蓄力 → 3D 翻牌 → 稀有度特效 ---
import { CFG } from '../config.js';
import { $, esc, pick1 } from '../core/util.js';
import { S, save, sync } from '../core/store.js';
import { t } from '../core/i18n.js';
import { beep } from '../core/sound.js';
import { toast, voucher } from '../core/ui.js';
import { KEYS, stamp } from './home.js';

// 稀有閃卡共 3 款（1 SSR + 2 SR）。卡名與說明在語言檔的 cards.<id>；img 填入真實照片路徑即可取代圖示，例如 img:'photos/ssr.jpg'
const CARDS = {
  SSR: [{ id: 'ssr1', e: '👰', img: '' }],
  SR: [{ id: 'sr1', e: '💍', img: '' }, { id: 'sr2', e: '💏', img: '' }],
  N: [{ id: 'n1', e: '🍔', img: '' }, { id: 'n2', e: '🍜', img: '' }, { id: 'n3', e: '📱', img: '' }]
};
const ALL = Object.entries(CARDS).flatMap(([r, a]) => a.map(c => ({ ...c, r })));
const title = c => t(`cards.${c.id}.t`);

const cardHTML = (c, r) => `<span class="tag">${r}</span>${c.img ? `<img src="${esc(c.img)}" alt="">` : `<em>${c.e}</em>`}<b>${esc(title(c))}</b><small class="mut">${esc(t(`cards.${c.id}.d`))}</small>`;

export function renderAlbum() {
  const tot = CFG.DRAWS + (KEYS.every(k => S.stamps[k]) ? CFG.BONUS : 0);
  $('dl').textContent = `${S.draws}/${tot}`;
  $('dl').classList.toggle('out', S.draws <= 0);
  $('db').disabled = S.draws <= 0;
  $('db').textContent = t(S.draws <= 0 ? 'draw.out' : 'draw.button');
  $('ac').textContent = `${S.album.length} / ${ALL.length}`;
  $('alb').innerHTML = ALL.map((c, j) => {
    const own = S.album.includes(c.id);
    return `<i class="${own ? 'ok' : ''}"${own ? ` data-card="${j}"` : ''}>${own ? c.e : '？'}</i>`;
  }).join('');
}

function viewCard(j) {
  const c = ALL[j];
  $('vf').className = 'face front ' + c.r; $('vf').innerHTML = cardHTML(c, c.r);
  $('vw').classList.add('on');
}

export function drawCard() {
  if (S.draws <= 0) { toast(t('draw.empty')); return; }
  const sc = $('sc'), db = $('db');
  db.disabled = true; db.textContent = t('draw.charging');
  $('cd').classList.remove('f'); sc.classList.add('sh'); $('cap').textContent = '';
  beep(300, .5, 'triangle');
  setTimeout(() => {
    sc.classList.remove('sh'); S.draws--;
    const x = Math.random(), r = x < CFG.RATE.SSR ? 'SSR' : x < CFG.RATE.SSR + CFG.RATE.SR ? 'SR' : 'N', c = pick1(CARDS[r]);
    if (!S.album.includes(c.id)) S.album.push(c.id);
    save();
    $('fr').className = 'face front ' + r; $('fr').innerHTML = cardHTML(c, r);
    $('cd').classList.add('f');
    renderAlbum(); stamp('draw'); sync('draw', { rarity: r, card: c.id });
    if (r === 'N') $('cap').textContent = pick1(t('draw.thanks'));
    else {
      $('cap').textContent = t('draw.won', { r, title: title(c) });
      setTimeout(() => voucher(t('draw.voucherTitle'), t('draw.voucherMsg', { title: title(c) }), r), 1000);
    }
  }, 1000);
}

export function initDraw() {
  $('alb').addEventListener('click', e => { const i = e.target.closest('[data-card]'); if (i) viewCard(+i.dataset.card); });
}
