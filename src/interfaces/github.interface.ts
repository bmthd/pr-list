import type { Endpoints } from "@octokit/types";

// Octokitの実際の型を使用
export type SearchIssuesAndPullRequestsResponse = Endpoints["GET /search/issues"]["response"]["data"];

export type PullRequestSearchItem = Endpoints["GET /search/issues"]["response"]["data"]["items"][0];

export type PullRequestDetails = Endpoints["GET /repos/{owner}/{repo}/pulls/{pull_number}"]["response"]["data"];

export type Owner = NonNullable<PullRequestSearchItem["repository"]>["owner"];

// アプリケーション固有の型定義
export interface SearchResponse {
	total_count: number;
	incomplete_results: boolean;
	items: PullRequestSearchItem[];
}

export type AppPullRequest = PullRequestSearchItem;

export interface PRStatistics {
	total: number;
	open: number;
	closed: number;
	merged: number;
}

export interface SearchOptions {
	state?: "open" | "closed" | "all";
	sort?: "created" | "updated" | "comments";
	order?: "asc" | "desc";
	per_page?: number;
	page?: number;
}

// GitHub Repository インターフェース
export interface IGitHubRepository {
	searchPRs(username: string, options?: SearchOptions): Promise<SearchResponse>;
	searchAllPRs(username: string, options?: Omit<SearchOptions, "page" | "per_page">): Promise<SearchResponse>;
	getPRDetails(owner: string, repo: string, pullNumber: number): Promise<PullRequestDetails>;
	getPRStatistics(username: string): Promise<PRStatistics>;
}
