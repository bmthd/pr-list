import "server-only";
import type { Endpoints } from "@octokit/types";
import { Octokit } from "octokit";
import { cache } from "react";
import { env } from "@/config";

const octokit = new Octokit({
	auth: env.GITHUB_TOKEN,
	userAgent: "pr-list-app",
});

interface SearchOptions {
	state?: "open" | "closed" | "all";
	sort?: "created" | "updated" | "comments";
	order?: "asc" | "desc";
	per_page?: number;
	page?: number;
}

export type PullRequestSearchItem = Endpoints["GET /search/issues"]["response"]["data"]["items"][0];

interface SearchResponse {
	totalCount: number;
	incompleteResults: boolean;
	items: PullRequestSearchItem[];
}

export const searchAllPRs = cache(
	async (username: string, options?: Omit<SearchOptions, "page" | "per_page">): Promise<SearchResponse> => {
		let query = `author:${username} type:pr is:public`;

		if (options?.state && options.state !== "all") {
			query += ` state:${options.state}`;
		}

		console.log("GitHub Search Query (All PRs):", query);

		try {
			const allItems = [];
			let page = 1;
			let totalCount = 0;
			let incompleteResults = false;

			// GitHub Search API has a maximum limit of 1000 results
			const perPage = 100; // Maximum allowed per page

			while (true) {
				const response = await octokit.rest.search.issuesAndPullRequests({
					q: query,
					sort: options?.sort || "created",
					order: options?.order || "desc",
					per_page: perPage,
					page,
				});

				if (page === 1) {
					totalCount = response.data.total_count;
					incompleteResults = response.data.incomplete_results;
				}

				allItems.push(...response.data.items);

				// Break if we've fetched all items or reached the last page
				if (response.data.items.length < perPage || allItems.length >= Math.min(totalCount, 1000)) {
					break;
				}

				page++;
			}

			console.log("GitHub API Response (All PRs):", {
				total_count: totalCount,
				items_fetched: allItems.length,
				pages_fetched: page,
			});

			return {
				totalCount: totalCount,
				incompleteResults: incompleteResults,
				items: allItems,
			};
		} catch (error) {
			console.error("GitHub API error:", error);
			throw error;
		}
	}
);

export const getUserAvatarUrl = cache(async (username: string): Promise<string> => {
	try {
		const { data: user } = await octokit.rest.users.getByUsername({
			username,
		});

		return user.avatar_url;
	} catch (error) {
		console.error("GitHub API error (getUserAvatarUrl):", error);
		throw error;
	}
});
