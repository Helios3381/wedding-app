// --- 設定 ---

export const CFG = {
  DRAWS: 5,                       // 每人抽卡次數
  BONUS: 1,                       // 集滿四枚印章加碼的抽卡次數
  RATE: { SSR: .01, SR: .03 },    // 稀有閃卡機率
  // 填入後端網址後，分數／祝福會同步送出（大螢幕、實體沖印需後端支援）
  API: '',
  // 幸福慢遞 → Google 表單：action 填表單的 formResponse 網址，f 填各題的 entry 編號（從「取得預先填入的連結」取得）
  GFORM: {
    action: 'https://docs.google.com/forms/d/e/1FAIpQLScI11oPrDsBQ3wV6MT1gDHbTU-2eEd5GKy2hX7jSGKy5o1P3w/formResponse',
    f: { guest: '', recipient: 'entry.1922581356', phone: 'entry.265215586', zip: 'entry.771315019', addr: 'entry.1002799348', photo: '' }
  },
  // 部署附檔的 Apps Script 後把 …/exec 網址填這裡：照片存雲端硬碟，全部資料（含照片連結）由它寫進表單，GFORM 就不再使用
  PHOTO_API: 'https://script.google.com/macros/s/AKfycbyaCfEdx2_Q-auVzPGBN4XIVYgaMIg0S5WZXNpBVOQmEmmWQCqZ-V0uwg98q655t_d4/exec'
};

// 著作權表記（全頁共用）。年份寫死為發佈年，不從裝置日期計算
export const COPYRIGHT = '© 2026 Helios Studios All rights reserved.';

// localStorage 鍵名（沿用原本的鍵名，已存的資料可以繼續使用）
export const KEY = { state: 'wd_s', mute: 'wd_m', danmaku: 'wd_dm2', lang: 'wd_lang' };

// Firebase Realtime Database：風雲榜（wedding_scores）與祝福留言（wedding_messages）全場共用，沿用舊網站的專案與資料。
// Web 用的設定是公開值，資料的讀寫權限由 Firebase 主控台的安全規則控管
export const FIREBASE = {
  SDK: 'https://www.gstatic.com/firebasejs/10.7.1/',
  SCORES: 'wedding_scores',
  MESSAGES: 'wedding_messages',
  config: {
    apiKey: 'AIzaSyAWY1ZrLeEwZ1397Lxz2LbxMS-bo4s0OqA',
    authDomain: 'weddinggame-93bad.firebaseapp.com',
    databaseURL: 'https://weddinggame-93bad-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId: 'weddinggame-93bad',
    storageBucket: 'weddinggame-93bad.firebasestorage.app',
    messagingSenderId: '243961475300',
    appId: '1:243961475300:web:24d003b1b162fb8a5ebcf1',
    measurementId: 'G-7TDS50SNNN'
  }
};

// Unity WebGL 遊戲（Jumpman 專案的 WebGL 輸出）
export const GAME_URL = 'JumpmanGL/index.html';
