import { env } from "@/config";
import type { PullRequestSearchItem } from "@/repositories/github-repository";
import { searchAllPRs } from "@/repositories/github-repository";
import { OrganizationsClient } from "./organizations-client";

type Organization = {
	login: string;
	avatarUrl: string;
	totalPRs: number;
	id: number;
};

export async function ContributedOrganizations() {
	const { items } = await searchAllPRs(env.NEXT_PUBLIC_GITHUB_USERNAME);
	const organizations = countPullRequestsByOrganization(items);
	return <OrganizationsClient organizations={organizations} />;
}

const countPullRequestsByOrganization = (pullRequests: PullRequestSearchItem[]): Organization[] => {
	const counts = new Map<string, Organization>();

	for (const pullRequest of pullRequests) {
		const owner = parseRepositoryOwner(pullRequest.repository_url || pullRequest.html_url || "");
		if (!owner) continue;

		const existing = counts.get(owner);
		counts.set(owner, existing ? { ...existing, totalPRs: existing.totalPRs + 1 } : createOrganization(owner));
	}

	return Array.from(counts.values()).sort((a, b) => b.totalPRs - a.totalPRs);
};

const parseRepositoryOwner = (url: string) => {
	const match = url.match(/github\.com\/(?:repos\/)?([^/]+)/);
	return match?.[1];
};

const createOrganization = (organizationLogin: string): Organization => ({
	login: organizationLogin,
	avatarUrl: `https://github.com/${organizationLogin}.png`,
	totalPRs: 1,
	id: organizationLogin.length,
});
