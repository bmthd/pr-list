"use client";

import { useMemo } from "react";
import { CONSTANTS } from "@/constants";
import { usePROrganizationFilter, usePRPagination, usePRSearch, usePRTab } from "@/hooks/use-pr-state";
import type { AppPullRequest } from "@/interfaces/github.interface";
import {
	Badge,
	Box,
	Card,
	type Component,
	EmptyState,
	Flex,
	GitMergeIcon,
	GitPullRequestClosedIcon,
	GitPullRequestIcon,
	HStack,
	IconButton,
	type IconProps,
	Input,
	InputGroup,
	Pagination,
	SearchIcon,
	Tabs,
	Text,
	VStack,
	XIcon,
} from "@/ui";
import { PRListItem } from "./pr-list-item";

interface TabDefinition {
	label: string;
	icon: Component<"svg", IconProps>;
	key: "all" | "open" | "merged" | "closed";
	filter?: (pr: AppPullRequest) => boolean;
}

const TAB_DEFINITIONS: TabDefinition[] = [
	{
		label: "All",
		icon: GitPullRequestIcon,
		key: "all" as const,
	},
	{
		label: "Open",
		icon: GitPullRequestIcon,
		key: "open" as const,
		filter: (pr) => pr.state === "open",
	},
	{
		label: "Merged",
		icon: GitMergeIcon,
		key: "merged" as const,
		filter: (pr) => Boolean(pr.pull_request?.merged_at),
	},
	{
		label: "Closed",
		icon: GitPullRequestClosedIcon,
		key: "closed" as const,
		filter: (pr) => pr.state === "closed" && !pr.pull_request?.merged_at,
	},
];

interface PRTabsProps {
	allPRs: AppPullRequest[];
}

export function PRTabs({ allPRs }: PRTabsProps) {
	const [selectedOrganization] = usePROrganizationFilter();
	const [currentPage, setCurrentPage] = usePRPagination();
	const [activeTabIndex, setActiveTabIndex] = usePRTab();

	const organizationFilteredPRs = useMemo(() => {
		if (!selectedOrganization) return allPRs;
		const normalizedOrganization = selectedOrganization.toLowerCase();
		return allPRs.filter((pr) => getRepositoryOwner(pr).toLowerCase() === normalizedOrganization);
	}, [allPRs, selectedOrganization]);

	const tabFilteredPRs = useMemo(() => {
		const categorizedPRs = getPRsByCategory(organizationFilteredPRs);
		const tabKey = TAB_DEFINITIONS[activeTabIndex].key;
		return categorizedPRs[tabKey];
	}, [organizationFilteredPRs, activeTabIndex]);

	const [searchQuery, setSearchQuery] = usePRSearch();

	const filteredPRs = useMemo(() => {
		if (!searchQuery) {
			return tabFilteredPRs;
		}

		const query = searchQuery.toLowerCase();
		return tabFilteredPRs.filter((pr) => {
			return (
				pr.title.toLowerCase().includes(query) ||
				pr.html_url.toLowerCase().includes(query) ||
				pr.number.toString().includes(query)
			);
		});
	}, [tabFilteredPRs, searchQuery]);

	const totalPages = Math.ceil(filteredPRs.length / CONSTANTS.ITEMS_PER_PAGE);
	const paginatedPRs = filteredPRs.slice(
		(currentPage - 1) * CONSTANTS.ITEMS_PER_PAGE,
		currentPage * CONSTANTS.ITEMS_PER_PAGE
	);

	const handleTabChange = (index: number) => {
		setActiveTabIndex(index);
	};

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	const handleSearchWithReset = (query: string) => {
		setSearchQuery(query);
	};

	return (
		<VStack gap={4} w="full" display="center">
			<Tabs.Root index={activeTabIndex} onChange={handleTabChange}>
				<Card.Root position="sticky" top="2" shadow="lg">
					<Card.Body p={4}>
						<Flex
							direction={{ base: "column", sm: "row" }}
							align={{ base: "start", sm: "center" }}
							justify="space-between"
							gap={4}
						>
							<HStack gap={2}>
								<Text fontSize="lg" fontWeight="bold" color="gray.900">
									Pull Requests
								</Text>
								<Badge bg="gray.100" color="gray.600" fontSize="xs">
									{filteredPRs.length}
								</Badge>
							</HStack>
							<InputGroup.Root position="relative" w={{ base: "full", sm: "64" }}>
								<InputGroup.Element>
									<SearchIcon />
								</InputGroup.Element>
								<Input
									placeholder="Filter by title or repo..."
									value={searchQuery}
									onChange={(e) => handleSearchWithReset(e.target.value)}
								/>
								<InputGroup.Element clickable>
									<IconButton
										variant="ghost"
										size="sm"
										icon={<XIcon />}
										aria-label="Clear search"
										onClick={() => handleSearchWithReset("")}
									/>
								</InputGroup.Element>
							</InputGroup.Root>
						</Flex>

						<TabsNavigation allPRs={organizationFilteredPRs} />
					</Card.Body>
				</Card.Root>

				<PRListDisplay paginatedPRs={paginatedPRs} />
			</Tabs.Root>

			{totalPages > 1 && (
				<Pagination.Root page={currentPage} total={totalPages} onChange={handlePageChange} size="sm" />
			)}
		</VStack>
	);
}

interface TabsNavigationProps {
	allPRs: AppPullRequest[];
}

function TabsNavigation({ allPRs }: TabsNavigationProps) {
	return (
		<Tabs.List>
			{TAB_DEFINITIONS.map(({ icon: Icon, ...tab }, index) => {
				const prs = tab.filter ? allPRs.filter(tab.filter) : allPRs;
				return (
					<Tabs.Tab key={tab.key} index={index}>
						<HStack gap={2}>
							<Icon w={4} h={4} />
							<Text>
								{tab.label} ({prs.length})
							</Text>
						</HStack>
					</Tabs.Tab>
				);
			})}
		</Tabs.List>
	);
}

interface PRListDisplayProps {
	paginatedPRs: AppPullRequest[];
}

function PRListDisplay({ paginatedPRs }: PRListDisplayProps) {
	return (
		<Card.Root overflow="hidden" minH="500px">
			{paginatedPRs.length > 0 ? (
				<VStack gap={0}>
					{paginatedPRs.map((pr, index) => (
						<Box key={pr.id} borderBottomWidth={index < paginatedPRs.length - 1 ? "1px" : "0px"} borderColor="gray.100">
							<PRListItem pr={pr} />
						</Box>
					))}
				</VStack>
			) : (
				<EmptyState.Root
					indicator={<SearchIcon />}
					title="No pull requests found"
					description="Try adjusting your filters or search query."
					py={20}
				/>
			)}
		</Card.Root>
	);
}

function getRepositoryOwner(pr: AppPullRequest) {
	const parts = pr.html_url.split("/");
	return parts[3] ?? "";
}

function getPRsByCategory(prs: AppPullRequest[]) {
	return {
		all: prs,
		open: prs.filter((pr) => pr.state === "open"),
		merged: prs.filter((pr) => pr.pull_request?.merged_at),
		closed: prs.filter((pr) => pr.state === "closed" && !pr.pull_request?.merged_at),
	};
}
