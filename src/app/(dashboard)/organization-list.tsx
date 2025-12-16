import { env } from "@/config";
import type { PullRequestSearchItem } from "@/repositories/github-repository";
import { searchAllPRs } from "@/repositories/github-repository";
import { Avatar, BuildingIcon, Card, Heading, HStack, Text, VStack } from "@/ui";

type Organization = {
	login: string;
	avatarUrl: string;
	totalPRs: number;
	id: number;
};

export async function OrganizationsList() {
	const { items } = await searchAllPRs(env.NEXT_PUBLIC_GITHUB_USERNAME);
	const organizations = countPRsByOrganization(items);

	return (
		<Card.Root overflow="hidden">
			<Card.Header bg="gray.50" px={4} py={3} borderBottomWidth="1px" borderColor="gray.100">
				<HStack gap={2}>
					<BuildingIcon w={4} h={4} color="gray.500" />
					<Heading size="sm" color="gray.700">
						Contributed Organizations
					</Heading>
				</HStack>
			</Card.Header>
			<VStack gap={0}>
				{organizations.length === 0 ? (
					<HStack px={4} py={6} justify="center">
						<Text fontSize="sm" color="gray.500">
							No repository contributions found
						</Text>
					</HStack>
				) : (
					organizations.map((organization) => (
						<HStack
							key={organization.id}
							px={4}
							py={3}
							gap={3}
							w="full"
							_hover={{ bg: "gray.50" }}
							transition="colors"
							cursor="pointer"
							borderBottomWidth="1px"
							borderColor="gray.100"
							_last={{ borderBottomWidth: 0 }}
							justify="space-between"
						>
							<HStack gap={3}>
								<Avatar src={organization.avatarUrl} name={organization.login} size="sm" shape="rounded" />
								<Text fontSize="sm" fontWeight="medium" color="gray.700">
									{organization.login}
								</Text>
							</HStack>
							<Text fontSize="xs" color="gray.500" fontWeight="medium">
								{organization.totalPRs} PRs
							</Text>
						</HStack>
					))
				)}
			</VStack>
		</Card.Root>
	);
}

const countPRsByOrganization = (prs: PullRequestSearchItem[]): Organization[] => {
	const counts = new Map<string, Organization>();

	for (const pr of prs) {
		const owner = parseRepoOwner(pr.repository_url || pr.html_url || "");
		if (!owner) continue;

		const existing = counts.get(owner);
		counts.set(owner, existing ? { ...existing, totalPRs: existing.totalPRs + 1 } : createOrganization(owner));
	}

	return Array.from(counts.values()).sort((a, b) => b.totalPRs - a.totalPRs);
};

const parseRepoOwner = (url: string) => {
	const match = url.match(/github\.com\/(?:repos\/)?([^/]+)/);
	return match?.[1];
};

const createOrganization = (login: string): Organization => ({
	login,
	avatarUrl: `https://github.com/${login}.png`,
	totalPRs: 1,
	id: login.length,
});
