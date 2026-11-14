// --- Firebase Realtime Database ---
import { FIREBASE } from '../config.js';

let ready;

/**
 * 資料庫與 firebase-database 的函式。SDK 在第一次呼叫時才從 CDN 載入：
 * 用靜態 import 的話，CDN 連不上時整個網站都會停住；這樣只有排行榜受影響
 */
export function firebase() {
  ready = ready || Promise.all([import(FIREBASE.SDK + 'firebase-app.js'), import(FIREBASE.SDK + 'firebase-database.js')])
    .then(([fbApp, fbDb]) => ({ ...fbDb, db: fbDb.getDatabase(fbApp.initializeApp(FIREBASE.config)) }));
  return ready;
}
