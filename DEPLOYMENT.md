# デプロイメントガイド

このWebアプリケーションを本番環境にデプロイする手順を説明します。

## 🚀 Vercelでのデプロイ（推奨）

### 前提条件
- GitHubアカウント
- Vercelアカウント（無料）

### 手順

1. **GitHubリポジトリの準備**
```bash
# Gitリポジトリを初期化
git init

# すべてのファイルをステージング
git add .

# 初回コミット
git commit -m "Initial commit: 忘れ物・持ち物チェッカー Web アプリ"

# GitHubリポジトリにプッシュ（事前にGitHubでリポジトリを作成）
git remote add origin https://github.com/[username]/check-for-forgotten-items.git
git branch -M main
git push -u origin main
```

2. **Vercelでのデプロイ**
   - [Vercel Dashboard](https://vercel.com/dashboard)にアクセス
   - "New Project" をクリック
   - GitHubリポジトリをインポート
   - プロジェクト設定:
     - Framework Preset: `Vite`
     - Root Directory: `./`
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - "Deploy" をクリック

3. **自動デプロイの確認**
   - 以降、mainブランチへのプッシュで自動デプロイされます
   - プレビューデプロイもプルリクエストで自動作成されます

## 🌐 その他のホスティングサービス

### Netlify

1. **ビルド**
```bash
npm run build
```

2. **Netlify Deploy**
   - [Netlify](https://www.netlify.com/)にログイン
   - "New site from Git" を選択
   - GitHubリポジトリを選択
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`

### GitHub Pages

1. **GitHub Actions設定**
`.github/workflows/deploy.yml` を作成:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### Firebase Hosting

1. **Firebase CLIのインストール**
```bash
npm install -g firebase-tools
```

2. **Firebase初期化**
```bash
firebase login
firebase init hosting
```

3. **設定（firebase.json）**
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/service-worker.js",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache"
          }
        ]
      }
    ]
  }
}
```

4. **デプロイ**
```bash
npm run build
firebase deploy
```

## 🔧 デプロイ前のチェックリスト

### 必須項目
- [ ] アイコンファイルを実際の画像に差し替え
- [ ] アプリ名・説明文の確認
- [ ] 各機能のテスト完了
- [ ] レスポンシブデザインの確認

### PWA設定
- [ ] manifest.jsonの内容確認
- [ ] Service Workerの動作確認
- [ ] オフライン機能のテスト

### パフォーマンス
- [ ] Lighthouse監査の実行
- [ ] 画像サイズの最適化
- [ ] 不要なコードの削除

## 📱 デプロイ後の確認項目

### 基本動作
- [ ] 全ページの正常な表示
- [ ] カテゴリの作成・編集・削除
- [ ] アイテムの管理機能
- [ ] チェック機能の動作
- [ ] 履歴の保存と表示
- [ ] 設定の保存

### PWA機能
- [ ] "ホーム画面に追加" の表示
- [ ] オフライン時の動作
- [ ] 通知機能（HTTPS環境でのみ）

### モバイル対応
- [ ] スマートフォンでの表示
- [ ] タッチ操作の快適性
- [ ] 縦・横画面の対応

## 🚨 トラブルシューティング

### よくある問題

1. **ルーティングエラー**
   - SPAリダイレクト設定を確認
   - `vercel.json`の rewrites 設定

2. **PWA機能が動作しない**
   - HTTPS環境での動作確認
   - Service Workerの登録確認

3. **通知が表示されない**
   - ブラウザの通知許可設定
   - HTTPS環境の確認

4. **ビルドエラー**
   - Node.jsバージョンの確認
   - 依存関係の再インストール: `rm -rf node_modules package-lock.json && npm install`

### デバッグ方法

```bash
# ローカルでのビルドテスト
npm run build
npm run preview

# 型チェック
npm run type-check

# リンター実行
npm run lint
```

## 📞 サポート

デプロイに関する問題や質問がある場合は、以下をご確認ください：

1. [プロジェクトのREADME](./README.md)
2. [Vercelドキュメント](https://vercel.com/docs)
3. [Viteドキュメント](https://vitejs.dev/guide/)

---

**最終更新**: 2025-08-24