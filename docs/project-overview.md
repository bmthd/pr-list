# GitHub PR List Website - Project Overview

## プロジェクト概要

GitHub のプルリクエスト一覧を表示するWebサイトを構築する。
特定のユーザー（bmthd）のプルリクエストを一覧表示し、詳細情報を提供する。

## 主な機能要件

### 1. PR一覧表示機能
- ユーザー「bmthd」のプルリクエストを一覧表示
- PR タイトル、ステータス（Open/Closed/Merged）、作成日時を表示
- リポジトリ名とPR番号の表示

### 2. フィルタリング機能
- ステータス別のフィルタリング（Open/Closed/Merged）
- リポジトリ別のフィルタリング
- 作成日時による並び替え

### 3. 詳細表示機能
- PR の詳細情報表示（説明文、ラベル、アサイニー等）
- GitHub へのリンク

### 4. UI/UX
- レスポンシブデザイン
- モダンで直感的な UI
- 高速な読み込み

## 技術スタック（現在の構成）

- **フレームワーク**: Next.js (App Router)
- **言語**: TypeScript
- **スタイリング**: 設定確認が必要
- **テスト**: Vitest
- **Lint/Format**: ESLint + Biome
- **パッケージマネージャー**: Bun

## GitHub API 連携

- GitHub REST API v4 を使用してPR情報を取得
- レート制限の考慮が必要
- 認証トークンの管理（必要に応じて）

## ディレクトリ構造

```
src/
├── app/              # Next.js App Router ページ
├── ui/               # UIコンポーネント
components/           # 新規作成予定
├── pr/               # PR関連コンポーネント
├── github/           # GitHub API関連
└── types/            # TypeScript型定義
```

## 開発方針

1. GitHub API との連携を最優先で実装
2. コンポーネントベースの設計
3. TypeScript による型安全性の確保
4. テスタブルなコードの作成
5. パフォーマンスを考慮した実装

## 参考サイト

GitHub の公式ドキュメントやAPIリファレンスを参考にした設計