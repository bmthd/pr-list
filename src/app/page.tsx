import { Suspense } from "react";
import type { Metadata } from "next";
import { env } from "@/config";
import { searchAllPRs } from "@/repositories/github-repository";
import { Container, Heading, Loading, VStack } from "@/ui";
import { PRTabs } from "./pr-stats";

export const revalidate = 300; // 5分間のページキャッシュ

export async function generateMetadata(): Promise<Metadata> {
	try {
		const prs = await searchAllPRs(env.NEXT_PUBLIC_GITHUB_USERNAME);
		const openPRs = prs.items.filter((pr) => pr.state === "open").length;
		const closedPRs = prs.items.filter((pr) => pr.state === "closed").length;
		const totalPRs = prs.total_count;

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
	const prs = await searchAllPRs(env.NEXT_PUBLIC_GITHUB_USERNAME);

	return (
		<Container.Root maxW="8xl" py={8}>
			<VStack gap={8}>
				<VStack gap={4}>
					<Heading as="h1" size="2xl" textAlign="center">
						bmthd's Pull Requests
					</Heading>
				</VStack>

				<Suspense fallback={<Loading.Dots />}>
					<PRTabs allPRs={prs.items} />
				</Suspense>
			</VStack>
		</Container.Root>
	);
}
