"use client";

import { usePROrganizationFilter } from "@/hooks/use-pr-state";
import {
	Avatar,
	BuildingIcon,
	Card,
	Heading,
	HStack,
	IconButton,
	NextLink,
	RadioGroup,
	Text,
	VStack,
	XIcon,
} from "@/ui";

type Organization = {
	login: string;
	avatarUrl: string;
	totalPRs: number;
	id: number;
};

interface OrganizationsClientProps {
	organizations: Organization[];
}

export function OrganizationsClient({ organizations }: OrganizationsClientProps) {
	const [selectedOrganization, setSelectedOrganization] = usePROrganizationFilter();

	const handleClearFilter = () => {
		setSelectedOrganization("");
	};

	return (
		<Card.Root overflow="hidden">
			<Card.Header bg="bg.muted" px={4} py={3} borderBottomWidth="1px" borderColor="gray.100">
				<HStack justify="space-between">
					<HStack gap={2}>
						<BuildingIcon w={4} h={4} color="gray.500" />
						<Heading size="sm" color="gray.700">
							Contributed Organizations
						</Heading>
					</HStack>
					{selectedOrganization ? (
						<IconButton
							variant="ghost"
							size="2xs"
							colorScheme="danger"
							aria-label="Clear organization filter"
							icon={<XIcon w={3} h={3} color="gray.500" />}
							onClick={handleClearFilter}
						/>
					) : null}
				</HStack>
			</Card.Header>
			<RadioGroup.Root value={selectedOrganization || undefined} onChange={setSelectedOrganization}>
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
								borderBottomWidth="1px"
								borderColor="gray.100"
								_last={{ borderBottomWidth: 0 }}
								justify="space-between"
							>
								<HStack gap={3}>
									<NextLink href={`https://github.com/${organization.login}`} external>
										<Avatar src={organization.avatarUrl} name={organization.login} size="sm" shape="rounded" />
									</NextLink>
									<Text fontSize="sm" color="gray.700" lineClamp={1}>
										{organization.login}
									</Text>
								</HStack>
								<RadioGroup.Item value={organization.login}>
									<Text fontSize="xs" color="gray.500" fontWeight="medium">
										{organization.totalPRs} PRs
									</Text>
								</RadioGroup.Item>
							</HStack>
						))
					)}
				</VStack>
			</RadioGroup.Root>
		</Card.Root>
	);
}
