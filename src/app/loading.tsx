import { Box, Card, GithubIcon, Grid, GridItem, Heading, HStack, Separator, Text, VStack } from "@/ui";

const organizationPlaceholders = ["Organization loading 1", "Organization loading 2", "Organization loading 3"];
const pullRequestPlaceholders = ["PR loading 1", "PR loading 2", "PR loading 3", "PR loading 4", "PR loading 5"];

export default function () {
	return (
		<Box minH="100vh" bg="gray.50" color="gray.800" display="flex" flexDirection="column">
			<Box as="header" bg="sky.950" color="white" px={6} py={4} shadow="md">
				<HStack justify="space-between" align="center">
					<HStack gap={3}>
						<GithubIcon w={8} h={8} />
						<Heading as="h1" size="lg" fontWeight="bold" letterSpacing="tight">
							My Contribution Dashboard
						</Heading>
					</HStack>
					<HStack gap={3}>
						<Box w="8" h="8" borderRadius="full" bg="whiteAlpha.300" />
						<Box w="24" h="4" borderRadius="md" bg="whiteAlpha.300" />
					</HStack>
				</HStack>
			</Box>

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
						<Card.Root w="full">
							<Card.Body p={6}>
								<VStack align="center" gap={4}>
									<Box w="24" h="24" borderRadius="full" bg="gray.200" />
									<VStack gap={2} align="center">
										<Heading size="md" color="gray.700">
											Loading contribution overview
										</Heading>
										<Text color="gray.500" fontSize="sm">
											Preparing GitHub activity
										</Text>
									</VStack>
									<Grid w="full" templateColumns="1fr 1fr" gap={2}>
										<MetricPlaceholder label="Total PRs" />
										<MetricPlaceholder label="Merged PRs" />
									</Grid>
								</VStack>
							</Card.Body>
						</Card.Root>

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
					</VStack>
				</GridItem>

				<GridItem minW={0}>
					<VStack gap={4} w="full">
						<Card.Root w="full">
							<Card.Body p={4}>
								<HStack justify="space-between" gap={4} align="center" flexWrap="wrap">
									<VStack gap={2} align="start">
										<HStack gap={2}>
											<Text fontSize="lg" fontWeight="bold" color="gray.900">
												Pull Requests
											</Text>
											<Box w="10" h="5" borderRadius="full" bg="gray.100" />
										</HStack>
										<Text color="gray.500" fontSize="sm">
											Fetching the latest contribution list
										</Text>
									</VStack>
									<Box w={{ base: "sm", sm: "full" }} maxW="full" h="10" borderRadius="md" bg="gray.100" />
								</HStack>
								<HStack gap={2} mt={4} overflowX="auto">
									<TabPlaceholder label="All" />
									<TabPlaceholder label="Open" />
									<TabPlaceholder label="Merged" />
									<TabPlaceholder label="Closed" />
								</HStack>
							</Card.Body>
						</Card.Root>

						<Card.Root w="full" overflow="hidden" minH="31rem">
							<VStack gap={0} separator={<Separator />}>
								{pullRequestPlaceholders.map((label) => (
									<HStack key={label} gap={4} p={4} w="full" align="start">
										<Box w="10" h="10" borderRadius="md" bg="gray.200" flexShrink={0} />
										<VStack gap={3} align="start" flex={1}>
											<Box w="full" h="5" borderRadius="md" bg="gray.200" />
											<HStack gap={3} w="full">
												<Box w="4" h="4" borderRadius="full" bg="gray.200" />
												<Box w="36" h="4" borderRadius="md" bg="gray.100" />
												<Box w="16" h="4" borderRadius="md" bg="gray.100" />
											</HStack>
										</VStack>
									</HStack>
								))}
							</VStack>
						</Card.Root>
					</VStack>
				</GridItem>
			</Grid>
		</Box>
	);
}

function MetricPlaceholder({ label }: { label: string }) {
	return (
		<VStack align="start" gap={2} borderWidth="1px" borderColor="gray.100" borderRadius="md" p={3}>
			<Text fontSize="xs" color="gray.500">
				{label}
			</Text>
			<Box w="16" h="7" borderRadius="md" bg="gray.200" />
		</VStack>
	);
}

function TabPlaceholder({ label }: { label: string }) {
	return (
		<HStack gap={2} px={3} py={2} borderWidth="1px" borderColor="gray.200" borderRadius="md" color="gray.500">
			<Box w="4" h="4" borderRadius="full" bg="gray.200" />
			<Text fontSize="sm">{label}</Text>
		</HStack>
	);
}
