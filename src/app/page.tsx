import { Suspense } from "react";
import { env } from "@/config";
import { gitHubRepository } from "@/repositories/github-repository";
import { Container, Heading, Loading, VStack } from "@/ui";
import { PRTabs } from "./pr-stats";

export const revalidate = 300; // 5分間のページキャッシュ

async function getPRsData() {
	const prs = await gitHubRepository.searchPRs(env.NEXT_PUBLIC_GITHUB_USERNAME, { per_page: 50 });

	return { prs };
}

export default async function Home() {
	const { prs } = await getPRsData();

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
