# 生成物一覧

ツールで作成した画像・アイコンです。手で書いたコードとは分けてここに置いています。

| ファイル | 内容 | 作成方法 | 使用箇所 |
|---|---|---|---|
| `icons/apple-touch-icon.png` | ホーム画面用アイコン（180×180）。金の縁の赤い円に金色の「囍」、ハートときらめき | `tools/make-icon.swift`（CoreGraphics で描画。文字は Songti TC Bold） | `index.html` の `apple-touch-icon` |
| `icons/favicon.png` | ブラウザのタブ用アイコン（64×64）。上と同じデザイン | 同上 | `index.html` の `icon` |
| `icons/sprite.svg` | 画面内のアイコン（SVG symbol 16 個：`i-home`、`i-game`、`i-draw`、`i-wish`、`i-photo`、`i-feast`、`i-gift`、`i-polaroid`、`i-gem`、`i-fort`、`i-egg`、`i-alarm`、`i-dm`、`i-spk-on`、`i-spk-off`、`i-cloud`） | 元の `wedding_party.html` に埋め込まれていた SVG を切り出したもの | `js/main.js` が読み込んでページに挿入し、各所の `<use href="#i-…">` から参照 |
| `images/letter-illustration.webp` | 感謝信の挿絵（900×600）。金門から香港へ向かう新郎新婦 | 元の `wedding_party.html` に base64 で埋め込まれていた画像を切り出したもの | 感謝信（`.lill`）と封筒の中の便箋（`.ep-ill`） |

アイコンの作り直し：

```bash
swift tools/make-icon.swift assets/generated/icons STSongti-TC-Bold
```

出力された `icon-512.png` は使用していないため削除してかまいません。
