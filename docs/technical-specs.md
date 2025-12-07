# 技術仕様書

## アーキテクチャ概要

### フロントエンド
- **フレームワーク**: Next.js 16 (App Router)
- **言語**: TypeScript 5
- **UI フレームワーク**: Yamada UI (@yamada-ui/react v2)
- **状態管理**: React hooks（useState, useEffect等）
- **スタイリング**: Yamada UI のテーマシステム

### データフェッチ
- **API クライアント**: fetch API（Server Components）
- **キャッシュ戦略**: Next.js App Router の fetch caching (force-cache, revalidate)
- **データ取得**: Server Components での直接データフェッチ
- **エラーハンドリング**: Error Boundary + Server Components error handling

### バリデーション・型安全性
- **GitHub API型定義**: @octokit/types v13
- **スキーマ検証**: Valibot v1
- **パターンマッチング**: ts-pattern v5
- **ユーティリティ**: Remeda v2（関数型プログラミングヘルパー）

### 開発ツール
- **リンター**: Biome v2 + ESLint v9
- **テストフレームワーク**: Vitest v4
- **ブラウザテスト**: Playwright (@vitest/browser-playwright)
- **カバレッジ**: @vitest/coverage-v8
- **スペルチェック**: CSpell v9
- **パッケージマネージャー**: Bun

## ディレクトリ構成

```
src/
├── app/                    # Next.js App Router (package by feature)
│   ├── layout.tsx         # ルートレイアウト（Server Component）
│   ├── page.tsx           # ホームページ（Server Component）
│   ├── loading.tsx        # ローディング画面
│   ├── error.tsx          # エラー画面
│   ├── pr-list.tsx        # PR一覧コンポーネント（Server Component）
│   ├── pr-card.tsx        # PRカードコンポーネント（Client Component）
│   ├── pr-stats.tsx       # PR統計コンポーネント（Server Component）
│   ├── pr-filters.tsx     # PRフィルターコンポーネント（Client Component）
│   ├── prs/               # PR関連ページ
│   │   ├── page.tsx       # PR一覧ページ（Server Component）
│   │   ├── loading.tsx    # PR一覧ローディング
│   │   ├── error.tsx      # PR一覧エラー
│   │   └── [id]/          # PR詳細
│   │       ├── page.tsx   # PR詳細ページ（Server Component）
│   │       ├── loading.tsx
│   │       ├── error.tsx
│   │       └── pr-detail.tsx # PR詳細コンポーネント
│   └── api/               # API ルート（必要に応じて）
├── lib/                   # ライブラリ関数
│   └── github/           # GitHub API サーバーサイド関数
│       └── api.ts        # Server Components用データフェッチ関数
├── utils/                # 共通ユーティリティ
├── config/               # 設定ファイル
└── types/                # アプリケーション型定義
    └── app.ts            # アプリケーション独自型
```

## GitHub API 仕様

### 使用エンドポイント
- `GET /search/issues` - PR検索用
- `GET /repos/{owner}/{repo}/pulls` - リポジトリ別PR取得

### 認証
- Personal Access Token（オプション）
- Rate Limiting: 60 requests/hour（未認証）、5000 requests/hour（認証済み）

### 型定義
@octokit/typesを使用してGitHub APIの型を利用:
```typescript
import type { 
  PullRequest,
  SearchIssuesAndPullRequestsResponseData,
  Repository 
} from '@octokit/types';

// アプリケーション固有の型拡張
interface AppPullRequest extends PullRequest {
  repository: Repository;
}
```

## パフォーマンス要件

### 初期読み込み
- First Contentful Paint: < 1.5秒
- Time to Interactive: < 3秒

### データ取得
- API レスポンス: < 2秒
- クライアントサイドナビゲーション: < 500ms

### キャッシュ戦略
- GitHub API レスポンスを5分間キャッシュ
- 画像の遅延読み込み（アバター等）

## セキュリティ考慮事項

### API トークン管理
- 環境変数での管理（GITHUB_TOKEN）
- クライアントサイドでの露出を避ける

### データサニタイゼーション
- XSS対策：HTMLの適切なエスケープ
- GitHub API レスポンスのバリデーション

## テスト戦略

### 単体テスト
- コンポーネントのロジック
- ユーティリティ関数
- カバレッジ目標: 80%以上

### 統合テスト
- API クライアントの動作
- エンドツーエンドのデータフロー

### ブラウザテスト
- UI インタラクション
- レスポンシブデザイン

## 環境変数

```bash
# GitHub API（オプション）
GITHUB_TOKEN=ghp_xxx

# Next.js
NEXT_PUBLIC_GITHUB_USERNAME=bmthd
```