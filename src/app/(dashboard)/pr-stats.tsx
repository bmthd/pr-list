"use client";

import { useMemo, useState } from "react";
import type { AppPullRequest } from "@/interfaces/github.interface";
import {
	Badge,
	Box,
	Card,
	Flex,
	GitMergeIcon,
	GitPullRequestIcon,
	HStack,
	Input,
	InputGroup,
	Pagination,
	SearchIcon,
	Tabs,
	Text,
	VStack,
} from "@/ui";
import { PRListItem } from "./pr-list-item";

interface PRTabsProps {
	allPRs: AppPullRequest[];
}

export function PRTabs({ allPRs }: PRTabsProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [activeTabIndex, setActiveTabIndex] = useState(0);
	const itemsPerPage = 15;

	const openPRs = allPRs.filter((pr) => pr.state === "open");
	const mergedPRs = allPRs.filter((pr) => pr.pull_request?.merged_at);

	const filteredPRs = useMemo(() => {
		let prsToFilter = allPRs;
		if (activeTabIndex === 1) prsToFilter = openPRs;
		if (activeTabIndex === 2) prsToFilter = mergedPRs;

		return prsToFilter.filter((pr) => {
			if (!searchQuery) return true;
			const query = searchQuery.toLowerCase();
			return (
				pr.title.toLowerCase().includes(query) ||
				pr.html_url.toLowerCase().includes(query) ||
				pr.number.toString().includes(query)
			);
		});
	}, [allPRs, openPRs, mergedPRs, activeTabIndex, searchQuery]);

	const totalPages = Math.ceil(filteredPRs.length / itemsPerPage);
	const paginatedPRs = filteredPRs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	const handleTabChange = (index: number) => {
		setActiveTabIndex(index);
		setCurrentPage(1);
	};

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	const handleSearch = (query: string) => {
		setSearchQuery(query);
		setCurrentPage(1);
	};

	return (
		<VStack gap={4} w="full" display="center">
			<Tabs.Root index={activeTabIndex} onChange={handleTabChange}>
				<Card.Root position="sticky" top="20" shadow="lg">
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
									onChange={(e) => handleSearch(e.target.value)}
								/>
							</InputGroup.Root>
						</Flex>

						<TabsNavigation allPRs={allPRs} openPRs={openPRs} mergedPRs={mergedPRs} />
					</Card.Body>
				</Card.Root>

				<Tabs.Panels>
					<Tabs.Panel index={0}>
						<PRListDisplay paginatedPRs={paginatedPRs} />
					</Tabs.Panel>

					<Tabs.Panel index={1}>
						<PRListDisplay paginatedPRs={paginatedPRs} />
					</Tabs.Panel>

					<Tabs.Panel index={2}>
						<PRListDisplay paginatedPRs={paginatedPRs} />
					</Tabs.Panel>
				</Tabs.Panels>
			</Tabs.Root>

			{totalPages > 1 && (
				<Pagination.Root page={currentPage} total={totalPages} onChange={handlePageChange} size="sm" />
			)}
		</VStack>
	);
}

interface TabsNavigationProps {
	allPRs: AppPullRequest[];
	openPRs: AppPullRequest[];
	mergedPRs: AppPullRequest[];
	activeTabIndex: number;
	onTabChange: (index: number) => void;
}

function TabsNavigation({ allPRs, openPRs, mergedPRs }: Pick<TabsNavigationProps, "allPRs" | "openPRs" | "mergedPRs">) {
	return (
		<Tabs.List>
			<Tabs.Tab index={0}>
				<HStack gap={2}>
					<GitPullRequestIcon w={4} h={4} />
					<Text>All ({allPRs.length})</Text>
				</HStack>
			</Tabs.Tab>
			<Tabs.Tab index={1}>
				<HStack gap={2}>
					<GitPullRequestIcon w={4} h={4} />
					<Text>Open ({openPRs.length})</Text>
				</HStack>
			</Tabs.Tab>
			<Tabs.Tab index={2}>
				<HStack gap={2}>
					<GitMergeIcon w={4} h={4} />
					<Text>Merged ({mergedPRs.length})</Text>
				</HStack>
			</Tabs.Tab>
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
				<Flex direction="column" align="center" justify="center" py={20} color="gray.500">
					<SearchIcon w={12} h={12} color="gray.300" mb={4} />
					<Text fontSize="lg" fontWeight="medium">
						No pull requests found
					</Text>
					<Text fontSize="sm">Try adjusting your filters or search query.</Text>
				</Flex>
			)}
		</Card.Root>
	);
}
