import Link from "next/link";
import { Footer } from "@/app/(dashboard)/footer";
import { env } from "@/config";
import { getUserPRStats } from "@/repositories/github-repository";
import { Box, Card, GithubIcon, Grid, GridItem, Heading, HStack, Stat, Text, VStack } from "@/ui";
import { GithubAvatar } from "./github-avatar";
import { ContributedOrganizations } from "./organization-list";

export default function Layout({ children }: LayoutProps<"/">) {
	return (
		<Box minH="100vh" bg="gray.50" color="gray.800" display="flex" flexDirection="column">
			<NavigationHeader />

			<Grid
				templateColumns={{ base: "sm 1fr", lg: "1fr" }}
				gap={8}
				mx="auto"
				w="full"
				maxW="7xl"
				px={4}
				py={8}
				flex="1"
			>
				<GridItem>
					<VStack gap={6}>
						<UserProfileSummary />
						<ContributedOrganizations />
					</VStack>
				</GridItem>

				<GridItem minW={0}>{children}</GridItem>
			</Grid>

			<Footer />
		</Box>
	);
}

function NavigationHeader() {
	const username = env.NEXT_PUBLIC_GITHUB_USERNAME;

	return (
		<Box as="header" bg="sky.950" color="white" px={6} py={4} shadow="md">
			<HStack justify="space-between" align="center">
				<Link href="/">
					<HStack gap={3}>
						<GithubIcon w={8} h={8} />
						<Heading as="h1" size="lg" fontWeight="bold" letterSpacing="tight">
							My Contribution Dashboard
						</Heading>
					</HStack>
				</Link>
				<HStack gap={4}>
					<HStack gap={2}>
						<GithubAvatar username={username} size="sm" borderWidth="1px" borderColor="gray.600" />
						<Text fontSize="sm" fontWeight="medium">
							{username}
						</Text>
					</HStack>
				</HStack>
			</HStack>
		</Box>
	);
}

async function UserProfileSummary() {
	const username = env.NEXT_PUBLIC_GITHUB_USERNAME;
	const stats = await getUserPRStats(username);

	return (
		<Card.Root>
			<Card.Body p={6}>
				<VStack align="center" gap={4}>
					<GithubAvatar username={username} size="xl" outline="4px solid" outlineColor="gray.100" />
					<VStack gap={1} align="center">
						<Heading size="xl" color="gray.900">
							{username}
						</Heading>
						<Text color="gray.500" fontSize="sm">
							Software Engineer
						</Text>
					</VStack>
					<Grid w="full" templateColumns="1fr 1fr" gap={2}>
						<Stat.Root>
							<Stat.Label>Total PRs</Stat.Label>
							<Stat.Value>{stats.totalCount}</Stat.Value>
						</Stat.Root>
						<Stat.Root>
							<Stat.Label>Merged PRs</Stat.Label>
							<Stat.Value color="green.600">{stats.mergedCount}</Stat.Value>
						</Stat.Root>
					</Grid>
				</VStack>
			</Card.Body>
		</Card.Root>
	);
}
