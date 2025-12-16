import { env } from "@/config";
import type { Owner } from "@/interfaces/github.interface";
import { searchAllPRs } from "@/repositories/github-repository";
import { Avatar, BuildingIcon, Card, Heading, HStack, Text, VStack } from "@/ui";

export async function OrganizationsList() {
	const pullRequests = await searchAllPRs(env.NEXT_PUBLIC_GITHUB_USERNAME);
	const organizations: Owner[] = pullRequests.items
		.map((pr) => pr.repository?.owner)
		.filter((owner): owner is Owner => owner !== undefined)
		.filter((owner, index, self) => self.findIndex((o) => o.login === owner.login) === index);
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
				{organizations.map((org) => (
					<HStack
						key={org.id}
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
					>
						<Avatar src={org.avatar_url} name={org.login} size="sm" shape="rounded" />
						<Text fontSize="sm" fontWeight="medium" color="gray.700" textTransform="capitalize">
							{org.login}
						</Text>
					</HStack>
				))}
			</VStack>
		</Card.Root>
	);
}
