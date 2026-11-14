// --- 多語系：繁體中文（預設）／English／日本語 ---
// 語言由網址決定：?lang=en、?lang=ja（沒有指定時用上次選的語言，都沒有就是繁體中文）
import zh from '../i18n/zh-Hant.js';
import en from '../i18n/en.js';
import ja from '../i18n/ja.js';
import { KEY } from '../config.js';
import { rd, wr } from './util.js';

const DICT = { 'zh-Hant': zh, en, ja };
export const LANGS = [['zh-Hant', '中文'], ['en', 'EN'], ['ja', '日本語']];

const norm = v => !v ? null : v.startsWith('zh') ? 'zh-Hant' : v.startsWith('en') ? 'en' : v.startsWith('ja') ? 'ja' : null;

function detect() {
  const fromUrl = norm(new URLSearchParams(location.search).get('lang'));
  if (fromUrl) { wr(KEY.lang, fromUrl); return fromUrl; }
  return norm(rd(KEY.lang, null)) || 'zh-Hant';
}

export const lang = detect();

const lookup = (d, key) => key.split('.').reduce((o, k) => (o == null ? o : o[k]), d);

/** 取出翻譯文字；字串中的 {name} 會換成 vars.name。陣列、函式等原樣回傳。 */
export function t(key, vars) {
  let v = lookup(DICT[lang], key);
  if (v === undefined) v = lookup(zh, key);
  if (v === undefined) { console.warn('[i18n] missing', key); return key; }
  if (typeof v === 'string' && vars) v = v.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
  return v;
}

/** 把 data-i18n／data-i18n-html／data-i18n-attr 的翻譯填進畫面 */
export function applyI18n(root = document) {
  document.documentElement.lang = lang;
  document.title = t('meta.title');
  const appTitle = document.querySelector('meta[name="apple-mobile-web-app-title"]');
  if (appTitle) appTitle.content = t('meta.appTitle');
  root.querySelectorAll('[data-i18n]').forEach(e => { e.textContent = t(e.dataset.i18n); });
  root.querySelectorAll('[data-i18n-html]').forEach(e => { e.innerHTML = t(e.dataset.i18nHtml); });
  root.querySelectorAll('[data-i18n-attr]').forEach(e => {
    e.dataset.i18nAttr.split(',').forEach(pair => { const [attr, key] = pair.split(':'); e.setAttribute(attr.trim(), t(key.trim())); });
  });
}

/** 換語言：網址加上 ?lang=，各語言版本都有自己的網址可以分享 */
export function switchLang(code) {
  if (code === lang) return;
  wr(KEY.lang, code);
  const u = new URL(location.href);
  if (code === 'zh-Hant') u.searchParams.delete('lang'); else u.searchParams.set('lang', code);
  location.href = u.toString();
}
