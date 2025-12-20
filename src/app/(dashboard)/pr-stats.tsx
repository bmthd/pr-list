"use client";

import { type ChangeEventHandler, useCallback, useMemo } from "react";
import { CONSTANTS } from "@/constants";
import type { AppPullRequest } from "@/interfaces/github.interface";
import {
	Badge,
	Box,
	Card,
	type Component,
	EmptyState,
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
	Separator,
	Show,
	Tabs,
	Text,
	VStack,
	Wrap,
	XIcon,
} from "@/ui";
import { PRListItem } from "./pr-list-item";
import { usePROrganizationFilter, usePRPagination, usePRSearch, usePRTab } from "./use-pr-state";

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

	const [searchQuery] = usePRSearch();

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

	const handleTabChange = useCallback(
		(index: number) => {
			setActiveTabIndex(index);
			setCurrentPage(1);
		},
		[setActiveTabIndex, setCurrentPage]
	);

	const handlePageChange = useCallback(
		(page: number) => {
			if (page >= 1 && page <= totalPages) {
				setCurrentPage(page);
			}
		},
		[setCurrentPage, totalPages]
	);

	return (
		<VStack gap={4} w="full" display="center">
			<Tabs.Root index={activeTabIndex} onChange={handleTabChange}>
				<Card.Root>
					<Card.Body p={4}>
						<Wrap align={{ base: "center", sm: "center" }} justify="space-between" gap={4} w="full">
							<HStack gap={2}>
								<Text fontSize="lg" fontWeight="bold" color="gray.900" textWrap="nowrap">
									Pull Requests
								</Text>
								<Badge bg="gray.100" color="gray.600" fontSize="xs">
									{filteredPRs.length}
								</Badge>
							</HStack>
							<SearchInput position="relative" w="sm" />
						</Wrap>

						<Box overflowX="auto" w="full">
							<TabsNavigation prs={organizationFilteredPRs} />
						</Box>
					</Card.Body>
				</Card.Root>

				<PRListDisplay paginatedPRs={paginatedPRs} />
			</Tabs.Root>

			<Show when={totalPages > 1}>
				<Pagination.Root page={currentPage} total={totalPages} onChange={handlePageChange} size="sm" />
			</Show>
		</VStack>
	);
}

interface SearchInputProps extends InputGroup.RootProps {}

function SearchInput({ ...props }: SearchInputProps) {
	const [searchQuery, setSearchQuery] = usePRSearch();
	const [, setCurrentPage] = usePRPagination();

	const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
		(e) => {
			setSearchQuery(e.target.value);
			setCurrentPage(1);
		},
		[setSearchQuery, setCurrentPage]
	);

	const handleClear = useCallback(() => {
		setSearchQuery("");
		setCurrentPage(1);
	}, [setSearchQuery, setCurrentPage]);

	return (
		<InputGroup.Root {...props}>
			<InputGroup.Element>
				<SearchIcon />
			</InputGroup.Element>
			<Input placeholder="Filter by title or repo..." value={searchQuery} onChange={handleChange} />

			<InputGroup.Element clickable>
				<Show when={searchQuery}>
					<IconButton variant="ghost" size="sm" icon={<XIcon />} aria-label="Clear search" onClick={handleClear} />
				</Show>
			</InputGroup.Element>
		</InputGroup.Root>
	);
}

interface TabsNavigationProps {
	prs: AppPullRequest[];
}

function TabsNavigation({ prs }: TabsNavigationProps) {
	return (
		<Tabs.List>
			{TAB_DEFINITIONS.map(({ icon: Icon, ...tab }, index) => {
				const filteredPRs = tab.filter ? prs.filter(tab.filter) : prs;
				return (
					<Tabs.Tab key={tab.key} index={index}>
						<HStack gap={2}>
							<Icon w={4} h={4} />
							<Text fontSize={{ base: "md", md: "xs" }}>
								{tab.label} ({filteredPRs.length})
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
	const fallback = (
		<EmptyState.Root
			indicator={<SearchIcon />}
			title="No pull requests found"
			description="Try adjusting your filters or search query."
			py={20}
		/>
	);
	return (
		<Card.Root overflow="hidden" minH="31rem">
			<Show when={paginatedPRs.length !== 0} fallback={fallback}>
				<VStack gap={0} separator={<Separator />}>
					{paginatedPRs.map((pr) => (
						<PRListItem key={pr.id} pr={pr} />
					))}
				</VStack>
			</Show>
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
