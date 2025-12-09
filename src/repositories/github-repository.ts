import { Octokit } from "octokit";
import { env } from "@/config";
import type { SearchOptions, SearchResponse } from "@/interfaces/github.interface";

const octokit = new Octokit({
	auth: env.GITHUB_TOKEN,
	userAgent: "pr-list-app",
});

export async function searchAllPRs(
	username: string,
	options?: Omit<SearchOptions, "page" | "per_page">
): Promise<SearchResponse> {
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
			total_count: totalCount,
			incomplete_results: incompleteResults,
			items: allItems,
		};
	} catch (error) {
		console.error("GitHub API error:", error);
		throw error;
	}
}
