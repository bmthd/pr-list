# API設計書

## GitHub API 統合設計

### 1. データ取得戦略

#### メインエンドポイント
```
GET /search/issues?q=author:bmthd+type:pr&sort=created&order=desc
```

#### 補完エンドポイント
```
GET /repos/{owner}/{repo}/pulls/{pull_number}
```

### 2. データモデル

#### 型定義（@octokit/types使用）
```typescript
import type { 
  PullRequest,
  SearchIssuesAndPullRequestsResponseData,
  Repository 
} from '@octokit/types';

// アプリケーション固有の型
type GitHubSearchResponse = SearchIssuesAndPullRequestsResponseData;

interface AppPullRequest extends PullRequest {
  repository: Repository;
}

interface PRStatistics {
  total: number;
  open: number;
  closed: number;
  merged: number;
}
```

### 3. Server Components データフェッチ設計

#### GitHub API サーバーサイド関数
```typescript
// lib/github/api.ts - Server Components用データフェッチ関数

export async function searchPRs(username: string, options?: {
  state?: 'open' | 'closed' | 'all';
  sort?: 'created' | 'updated' | 'comments';
  order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}): Promise<GitHubSearchResponse> {
  const token = process.env.GITHUB_TOKEN;
  const url = buildSearchURL(username, options);
  
  const response = await fetch(url, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : undefined,
      'Accept': 'application/vnd.github.v3+json',
    },
    cache: 'force-cache',
    next: { revalidate: 300 }, // 5分間キャッシュ
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return response.json();
}

export async function getPRDetails(owner: string, repo: string, pullNumber: number): Promise<PullRequest> {
  const token = process.env.GITHUB_TOKEN;
  const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : undefined,
      'Accept': 'application/vnd.github.v3+json',
    },
    cache: 'force-cache',
    next: { revalidate: 600 }, // 10分間キャッシュ
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return response.json();
}

function buildSearchURL(username: string, options?: any): string {
  const baseUrl = 'https://api.github.com/search/issues';
  const params = new URLSearchParams({
    q: `author:${username}+type:pr`,
    sort: options?.sort || 'created',
    order: options?.order || 'desc',
    per_page: String(options?.per_page || 30),
    page: String(options?.page || 1),
  });

  if (options?.state && options.state !== 'all') {
    params.set('q', params.get('q') + `+state:${options.state}`);
  }

  return `${baseUrl}?${params}`;
}
```

### 4. Next.js App Router キャッシュ戦略

#### Server Components キャッシュ
- **Data Cache**: fetch の `cache` と `next.revalidate` オプションを使用
- **Request Memoization**: 同一リクエスト内での重複APIコール防止
- **Full Route Cache**: 静的ページの完全キャッシュ

```typescript
// 異なるキャッシュ戦略の例

// 1. 長期キャッシュ（詳細ページ）
export async function getPRDetails(owner: string, repo: string, pullNumber: number) {
  const response = await fetch(url, {
    cache: 'force-cache',
    next: { revalidate: 3600 }, // 1時間キャッシュ
  });
}

// 2. 短期キャッシュ（一覧ページ）
export async function searchPRs(username: string, options?: any) {
  const response = await fetch(url, {
    cache: 'force-cache',
    next: { revalidate: 300 }, // 5分間キャッシュ
  });
}

// 3. 動的データ（リアルタイム性が重要）
export async function getPRStats(username: string) {
  const response = await fetch(url, {
    cache: 'no-cache', // キャッシュなし
  });
}

// 4. ページレベルでの revalidate 設定
export const revalidate = 300; // 5分間のページキャッシュ
```

### 5. エラーハンドリング

#### エラー型定義
```typescript
interface APIError {
  code: string;
  message: string;
  status?: number;
  details?: any;
}

type APIResult<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: APIError;
}
```

#### エラーケース
- **404**: ユーザーまたはリポジトリが見つからない
- **403**: Rate limit exceeded
- **401**: 認証エラー（トークン無効）
- **422**: 検索クエリ無効
- **500**: サーバーエラー

### 6. Server Components での Rate Limiting 対策

#### 制限値
- 未認証: 60 requests/hour
- 認証済み: 5000 requests/hour

#### 対策
Server Components では Next.js のキャッシュ機能により自然にRate Limitingが緩和されます:

```typescript
// Server Components での Rate Limiting 対策

// 1. キャッシュによる自動制限
export async function searchPRs(username: string, options?: any) {
  // 5分間キャッシュにより、同じクエリでの重複APIコールを防止
  const response = await fetch(url, {
    cache: 'force-cache',
    next: { revalidate: 300 },
  });
}

// 2. 環境変数での認証トークン必須化
export async function makeGitHubRequest(url: string) {
  const token = process.env.GITHUB_TOKEN;
  
  if (!token) {
    throw new Error('GITHUB_TOKEN is required for API requests');
  }
  
  return fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
    },
    cache: 'force-cache',
    next: { revalidate: 300 },
  });
}

// 3. バッチ処理での効率化
export async function getPRsWithStats(username: string): Promise<{
  prs: GitHubSearchResponse;
  stats: PRStatistics;
}> {
  // 1回のAPIコールで複数の情報を取得
  const allPRs = await searchPRs(username, { state: 'all', per_page: 100 });
  
  const stats = {
    total: allPRs.total_count,
    open: allPRs.items.filter(pr => pr.state === 'open').length,
    closed: allPRs.items.filter(pr => pr.state === 'closed').length,
    merged: allPRs.items.filter(pr => pr.merged_at).length,
  };

  return { prs: allPRs, stats };
}
```

### 7. データ変換層

#### レスポンス正規化
```typescript
function normalizePR(githubPR: any): PullRequest {
  return {
    id: githubPR.id,
    number: githubPR.number,
    title: githubPR.title,
    state: githubPR.merged_at ? 'merged' : githubPR.state,
    created_at: githubPR.created_at,
    updated_at: githubPR.updated_at,
    closed_at: githubPR.closed_at,
    merged_at: githubPR.merged_at,
    // ... 他のフィールド
  };
}
```

### 8. Server Components での統計情報とフィルタリング

#### 統計情報取得（Server Components）
```typescript
// Server Components内で直接実行
export async function getPRStatistics(username: string): Promise<PRStatistics> {
  const allPRs = await searchPRs(username, { state: 'all', per_page: 100 });
  
  return {
    total: allPRs.total_count,
    open: allPRs.items.filter(pr => pr.state === 'open').length,
    closed: allPRs.items.filter(pr => pr.state === 'closed').length,
    merged: allPRs.items.filter(pr => pr.merged_at).length,
  };
}

// ページコンポーネントでの使用例
export default async function HomePage() {
  const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME!;
  const [prs, stats] = await Promise.all([
    searchPRs(username, { per_page: 30 }),
    getPRStatistics(username),
  ]);

  return (
    <main>
      <PRStats stats={stats} />
      <PRList prs={prs.items} />
    </main>
  );
}
```

#### フィルタリング機能（URL パラメータ + Server Components）
```typescript
// URL searchParams を使用したフィルタリング
interface PRFilters {
  state?: 'open' | 'closed' | 'merged' | 'all';
  repository?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
  sortBy?: 'created' | 'updated' | 'merged';
  order?: 'asc' | 'desc';
}

// ページコンポーネントでのSearchParams活用
export default async function PRsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME!;
  const filters: PRFilters = {
    state: (searchParams.state as any) || 'all',
    sortBy: (searchParams.sortBy as any) || 'created',
    order: (searchParams.order as any) || 'desc',
  };

  const prs = await searchPRs(username, filters);

  return (
    <div>
      <PRFilters currentFilters={filters} />
      <PRList prs={prs.items} />
    </div>
  );
}

// Client Componentでのフィルター操作
'use client';
export function PRFilters({ currentFilters }: { currentFilters: PRFilters }) {
  const router = useRouter();
  const pathname = usePathname();

  const updateFilters = (newFilters: Partial<PRFilters>) => {
    const params = new URLSearchParams();
    Object.entries({ ...currentFilters, ...newFilters }).forEach(([key, value]) => {
      if (value) params.set(key, String(value));
    });
    
    router.push(`${pathname}?${params.toString()}`);
  };

  // フィルターUI実装...
}
```