# Express v5 Routing Experiment

Express v5のルーティング優先順位を検証するための実験プロジェクトです。

## 🎯 実験目的

下記の順序でルーティングを定義した時、`/users/:id/contents` および `/users/:id/contents/:id` へのリクエストが `/users/:id` に吸収されるかどうかを確認する。

### ルート定義順
1. `GET /users`
2. `GET /users/:id`
3. `GET /users/:id/contents`
4. `GET /users/:id/contents/:id`

## 📊 実験結果

✅ **Express v5では、より具体的なパスが優先的にルーティングされます！**

### テストケース結果

| リクエストパス | マッチしたルート | 説明 |
|---------------|----------------|------|
| `/users` | `/users` | ユーザー一覧 |
| `/users/123` | `/users/:id` | ユーザー123の詳細 |
| `/users/123/contents` | `/users/:id/contents` | ✅ `/users/:id`に**吸収されない** |
| `/users/123/contents/456` | `/users/:id/contents/:contentId` | ✅ 正しく最も具体的なルートにマッチ |
| `/users/contents` | `/users/:id` | IDが'contents'のユーザーとして解釈される |

### 重要な発見

🔍 **Express v5のルーティングアルゴリズムは「より具体的なパス」を優先します**

- `/users/:id/contents` のような具体的なパスは、定義順に関わらず `/users/:id` より優先されます
- これにより、パラメータルートと具体的なパスを混在させても安全にルーティングできます
- ただし、`/users/contents` は `/users/:id` にマッチするため、特別な文字列をパスパラメータとして使う場合は注意が必要です

## 🚀 使い方

### インストール

```bash
npm install
```

### テスト実行

```bash
npm test
```

### サーバー起動

```bash
npm start
```

サーバーが起動したら、以下のエンドポイントをテストできます：

- http://localhost:3000/users
- http://localhost:3000/users/123
- http://localhost:3000/users/123/contents
- http://localhost:3000/users/123/contents/456

## 📁 プロジェクト構成

```
.
├── app.js              # Expressアプリケーション定義
├── server.js           # サーバー起動スクリプト
├── app.test.js         # ルーティング実験テスト
├── package.json        # プロジェクト設定
└── .github/
    └── workflows/
        └── test.yml    # CI/CDワークフロー
```

## 🧪 テスト内容

1. **基本ルートテスト**: `/users` が正しくユーザー一覧を返すか
2. **パラメータルートテスト**: `/users/123` が正しくユーザー詳細を返すか
3. **ネストルートテスト**: `/users/123/contents` が `/users/:id` に吸収されないか
4. **深いネストルートテスト**: `/users/123/contents/456` が正しくマッチするか
5. **エッジケーステスト**: `/users/contents` がどのように解釈されるか

## 📦 依存関係

- **Express v5**: 最新のExpressフレームワーク
- **Jest**: テストフレームワーク
- **Supertest**: HTTPアサーションライブラリ

## 🔄 CI/CD

GitHub Actionsにより、プッシュ時に自動でテストが実行されます。
複数のNode.jsバージョン（18.x, 20.x, 22.x）でテストされます。

## 📝 結論

Express v5では、ルーティングの定義順序に関わらず、**より具体的なパス（静的セグメントが多い）が優先**されます。したがって、`/users/:id/contents` のようなルートは、`/users/:id` の後に定義しても正しく機能します。

これにより、RESTful APIの設計がより柔軟になり、パラメータルートと具体的なパスを自由に組み合わせることができます。
