# tech-challenge-party-2026-09-17

## あの日の空 — Birthday Sky

生年月日・時刻・観測地点から、その瞬間の星空を再現するWebアプリです。恒星位置と明るさに基づく観測表示へ一本化し、表示する星の等級を選択できます。

### 主な機能

- 生年月日と時刻を指定
- 都市名・地名検索、現在地取得、緯度経度の手動入力
- 観測地点のIANAタイムゾーンを自動判定
- NASA/HEASARC Bright Star Catalog由来の8,132レコードを主要恒星59星と重複排除して表示
- 1.0〜6.5等級の表示上限を0.5刻みで選択
- 恒星のJ2000座標に歳差補正を適用
- 太陽、月、水星〜土星と9星座を全天星図に表示
- 薄明・月明かりによる肉眼の限界等級を反映
- 星空部分のフルスクリーン表示
- 星座線、天体名、太陽・月・惑星の個別表示切り替え
- ドラッグによる方角変更、ホイール／ボタンによる拡大縮小
- PC・モバイル対応

### セットアップ

Node.js 22以降を推奨します。

```bash
npm install
npm run dev
```

表示されたローカルURLをブラウザで開いてください。現在地取得とフルスクリーン表示は対応ブラウザの`localhost`またはHTTPS環境で利用できます。

### コマンド

```bash
npm run dev         # 開発サーバー
npm run typecheck   # TypeScript型チェック
npm run build       # 本番ビルド
npm run preview     # ビルド結果のプレビュー
npm run data:stars  # NASA/HEASARCから恒星データを再生成
```

通常の起動・ビルドではネットワークから星表を取得しません。生成済みデータをアプリへ同梱しています。

### 使用技術

- React 19 / TypeScript / Vite
- [NASA HEASARC Bright Star Catalog](https://heasarc.gsfc.nasa.gov/W3Browse/all/bsc5p.html) — J2000位置、V等級、B−V色指数
- [Astronomy Engine](https://github.com/cosinekitty/astronomy) — 太陽系天体の位置・月相・座標変換
- Canvas 2D — 全天星図描画
- [OpenStreetMap Nominatim](https://nominatim.org/) — 地名検索・逆ジオコーディング
- [TimeAPI](https://timeapi.io/) — 座標からIANAタイムゾーンを取得
- Browser Geolocation / Fullscreen API

### データと精度

NASA HEASARCで公開されているBright Star Catalog 5th Edition Preliminaryのうち、3.45より暗く6.5等級以下の8,132星を同梱しています。主要恒星59星を名称付きデータとして補完し、恒星位置にはIAU 1976歳差モデルを適用します。太陽系天体にはAstronomy Engineの光行差・視差・歳差・章動を考慮した座標を使用しています。

選択した最大等級と、太陽高度・月明かりから算出した自然な限界等級の小さい方を実際の表示上限とします。晴天時の肉眼表示を概算するもので、過去の雲量、地域ごとの光害、建物・地形による遮蔽は再現していません。

入力できる日付は1900年から2100年です。夏時間開始時に存在しない現地時刻はエラーになり、夏時間終了時に同じ時刻が2回現れる場合は最初の時刻を採用します。

地名検索・タイムゾーン判定・Webフォントにはインターネット接続が必要です。天体位置の計算と星表表示はブラウザ内で行います。
