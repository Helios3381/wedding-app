// --- 賓客資料（存在這支手機的 localStorage）---
import { CFG, KEY } from '../config.js';
import { rd, wr } from './util.js';

export const S = { name: '', stamps: {}, draws: CFG.DRAWS, album: [], printed: false, myW: [], ...rd(KEY.state, {}) };
export const save = () => wr(KEY.state, S);

// 畫面狀態：目前的頁籤，以及遊戲是否全螢幕中（全螢幕時暫停花瓣與彈幕）
export const app = { view: 'home', gameOn: false };

const post = (type, data) => CFG.API
  ? fetch(CFG.API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, name: S.name, ts: Date.now(), ...data }) }).then(r => r.ok).catch(() => false)
  : Promise.resolve(true);
export const sync = (type, data) => { post(type, data); };
