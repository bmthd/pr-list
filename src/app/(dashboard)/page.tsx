import type { Metadata } from "next";
import { env } from "@/config";
import { searchAllPRs } from "@/repositories/github-repository";
import { Loading } from "@/ui";
import { PRTabs } from "./pr-stats";

export const revalidate = 300; // 5分間のページキャッシュ

export async function generateMetadata(): Promise<Metadata> {
	try {
		const prs = await searchAllPRs(env.NEXT_PUBLIC_GITHUB_USERNAME);
		const openPRs = prs.items.filter((pr) => pr.state === "open").length;
		const closedPRs = prs.items.filter((pr) => pr.state === "closed").length;
		const totalPRs = prs.totalCount;

		return {
			title: "Dashboard",
			description: `View ${env.NEXT_PUBLIC_GITHUB_USERNAME}'s GitHub pull request statistics: ${totalPRs} total PRs, ${openPRs} open, ${closedPRs} closed. Track development contributions and open source activity.`,
			openGraph: {
				title: `${env.NEXT_PUBLIC_GITHUB_USERNAME}'s Pull Requests Dashboard`,
				description: `${totalPRs} total GitHub pull requests • ${openPRs} open • ${closedPRs} closed`,
			},
			twitter: {
				title: `${env.NEXT_PUBLIC_GITHUB_USERNAME}'s PR Dashboard`,
				description: `${totalPRs} total GitHub pull requests • ${openPRs} open • ${closedPRs} closed`,
			},
		};
	} catch {
		return {
			title: "Dashboard",
			description: `View ${env.NEXT_PUBLIC_GITHUB_USERNAME}'s GitHub pull request activity and contributions.`,
		};
	}
}

export default async function Home() {
	const pullRequests = await searchAllPRs(env.NEXT_PUBLIC_GITHUB_USERNAME);

	return (
		<Loading.Suspense loadingScheme="rings">
			<PRTabs allPRs={pullRequests.items} />
		</Loading.Suspense>
	);
}
