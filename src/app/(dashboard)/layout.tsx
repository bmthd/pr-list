import { env } from "@/config";
import { Avatar, Box, Card, GithubIcon, Grid, GridItem, Heading, HStack, Text, VStack } from "@/ui";
import { ContributedOrganizations } from "./organization-list";

export default function Layout({ children }: LayoutProps<"/">) {
	return (
		<Box minH="100vh" bg="gray.50" color="gray.800">
			<NavigationHeader />

			<Box maxW="7xl" mx="auto" px={4} py={8}>
				<Grid templateColumns={{ base: "1fr 3fr", lg: "1fr" }} gap={8}>
					<GridItem>
						<VStack gap={6}>
							<UserProfileSummary />
							<ContributedOrganizations />
						</VStack>
					</GridItem>

					<GridItem>{children}</GridItem>
				</Grid>
			</Box>
		</Box>
	);
}

function NavigationHeader() {
	const username = env.NEXT_PUBLIC_GITHUB_USERNAME;

	return (
		<Box as="header" bg="gray.900" color="white" px={6} py={4} shadow="md">
			<HStack justify="space-between" align="center">
				<HStack gap={3}>
					<GithubIcon w={8} h={8} />
					<Heading as="h1" size="lg" fontWeight="bold" letterSpacing="tight">
						My Contribution Dashboard
					</Heading>
				</HStack>
				<HStack gap={4}>
					<HStack gap={2}>
						<Avatar
							src={`https://github.com/${username}.png`}
							name={username}
							size="sm"
							borderWidth="1px"
							borderColor="gray.600"
						/>
						<Text fontSize="sm" fontWeight="medium">
							{username}
						</Text>
					</HStack>
				</HStack>
			</HStack>
		</Box>
	);
}

function UserProfileSummary() {
	const username = env.NEXT_PUBLIC_GITHUB_USERNAME;

	return (
		<Card.Root>
			<Card.Body p={6}>
				<VStack align="center" gap={4}>
					<Avatar
						src={`https://github.com/${username}.png`}
						name={username}
						size="xl"
						outline="4px solid"
						outlineColor="gray.100"
					/>
					<VStack gap={1} align="center">
						<Heading size="xl" color="gray.900">
							{username}
						</Heading>
						<Text color="gray.500" fontSize="sm">
							Software Engineer
						</Text>
					</VStack>
					<Grid w="full" templateColumns="1fr 1fr" gap={2}>
						<Card.Root bg="bg.subtle">
							<Card.Body p={2} display="center">
								<Text fontWeight="bold" color="gray.900">
									250
								</Text>
								<Text fontSize="xs" color="gray.500">
									Total PRs
								</Text>
							</Card.Body>
						</Card.Root>
						<Card.Root bg="bg.subtle">
							<Card.Body p={2} display="center">
								<Text fontWeight="bold" color="green.600">
									189
								</Text>
								<Text fontSize="xs" color="gray.500">
									Merged
								</Text>
							</Card.Body>
						</Card.Root>
					</Grid>
				</VStack>
			</Card.Body>
		</Card.Root>
	);
}
