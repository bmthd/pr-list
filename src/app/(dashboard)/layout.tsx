import { Suspense } from "react";
import Link from "next/link";
import { Footer } from "@/app/(dashboard)/footer";
import { env } from "@/config";
import { getUserPRStats } from "@/repositories/github-repository";
import { Box, Card, GithubIcon, Grid, GridItem, Heading, HStack, Separator, Stat, Text, VStack } from "@/ui";
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
						<Suspense fallback={<UserProfileSummaryFallback />}>
							<UserProfileSummary />
						</Suspense>
						<Suspense fallback={<ContributedOrganizationsFallback />}>
							<ContributedOrganizations />
						</Suspense>
					</VStack>
				</GridItem>

				<GridItem minW={0}>{children}</GridItem>
			</Grid>

			<Footer />
		</Box>
	);
}

function UserProfileSummaryFallback() {
	return (
		<Card.Root w="full">
			<Card.Body p={6}>
				<VStack align="center" gap={4}>
					<Box w="24" h="24" borderRadius="full" bg="gray.200" />
					<VStack gap={2} align="center">
						<Box w="32" h="8" borderRadius="md" bg="gray.200" />
						<Box w="28" h="4" borderRadius="md" bg="gray.100" />
					</VStack>
					<Grid w="full" templateColumns="1fr 1fr" gap={2}>
						<MetricFallback label="Total PRs" />
						<MetricFallback label="Merged PRs" />
					</Grid>
				</VStack>
			</Card.Body>
		</Card.Root>
	);
}

function MetricFallback({ label }: { label: string }) {
	return (
		<VStack align="start" gap={2}>
			<Text fontSize="sm" color="gray.500">
				{label}
			</Text>
			<Box w="16" h="8" borderRadius="md" bg="gray.200" />
		</VStack>
	);
}

function ContributedOrganizationsFallback() {
	const organizationPlaceholders = ["Organization loading 1", "Organization loading 2", "Organization loading 3"];

	return (
		<Card.Root w="full" overflow="hidden">
			<Card.Body p={0}>
				<Box bg="bg.muted" p="md">
					<Heading size="sm" color="gray.700">
						Contributed Organizations
					</Heading>
				</Box>
				<VStack gap={0} separator={<Separator />}>
					{organizationPlaceholders.map((label) => (
						<HStack key={label} w="full" p={3} gap={3}>
							<Box w="8" h="8" borderRadius="md" bg="gray.200" />
							<Box h="4" flex="1" borderRadius="md" bg="gray.200" />
							<Box w="12" h="4" borderRadius="md" bg="gray.100" />
						</HStack>
					))}
				</VStack>
			</Card.Body>
		</Card.Root>
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
