import { Octokit } from "octokit";
import { env } from "@/config";
import type {
	IGitHubRepository,
	PRStatistics,
	PullRequestDetails,
	SearchOptions,
	SearchResponse,
} from "@/interfaces/github.interface";

class GitHubRepository implements IGitHubRepository {
	private readonly octokit: Octokit;

	constructor() {
		this.octokit = new Octokit({
			auth: env.GITHUB_TOKEN,
			userAgent: "pr-list-app",
		});
	}

	async searchPRs(username: string, options?: SearchOptions): Promise<SearchResponse> {
		let query = `author:${username} type:pr is:public`;

		if (options?.state && options.state !== "all") {
			query += ` state:${options.state}`;
		}

		console.log("GitHub Search Query:", query);

		try {
			const response = await this.octokit.rest.search.issuesAndPullRequests({
				q: query,
				sort: options?.sort || "created",
				order: options?.order || "desc",
				per_page: options?.per_page || 30,
				page: options?.page || 1,
			});

			console.log("GitHub API Response:", {
				total_count: response.data.total_count,
				items_length: response.data.items.length,
			});

			return {
				total_count: response.data.total_count,
				incomplete_results: response.data.incomplete_results,
				items: response.data.items,
			};
		} catch (error) {
			console.error("GitHub API error:", error);
			throw error;
		}
	}

	async getPRDetails(owner: string, repo: string, pullNumber: number): Promise<PullRequestDetails> {
		try {
			const response = await this.octokit.rest.pulls.get({
				owner,
				repo,
				pull_number: pullNumber,
			});

			return response.data;
		} catch (error) {
			console.error("GitHub API error:", error);
			throw error;
		}
	}

	async getPRStatistics(username: string): Promise<PRStatistics> {
		const allPRs = await this.searchPRs(username, { state: "all", per_page: 100 });

		return {
			total: allPRs.total_count,
			open: allPRs.items.filter((pr) => pr.state === "open").length,
			closed: allPRs.items.filter((pr) => pr.state === "closed" && !pr.pull_request?.merged_at).length,
			merged: allPRs.items.filter((pr) => pr.pull_request?.merged_at).length,
		};
	}
}

export const gitHubRepository = new GitHubRepository();
