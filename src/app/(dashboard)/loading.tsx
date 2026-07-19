import { Box, Card, HStack, Separator, Text, VStack } from "@/ui";

const pullRequestPlaceholders = ["PR loading 1", "PR loading 2", "PR loading 3", "PR loading 4", "PR loading 5"];

export default function Loading() {
	return (
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
