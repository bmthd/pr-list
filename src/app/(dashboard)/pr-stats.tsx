"use client";

import type { AppPullRequest } from "@/interfaces/github.interface";
import {
	Badge,
	Box,
	Button,
	Card,
	ChevronLeftIcon,
	ChevronRightIcon,
	Flex,
	GitMergeIcon,
	GitPullRequestIcon,
	HStack,
	Input,
	SearchIcon,
	Tabs,
	Text,
	VStack,
} from "@/ui";
import { PRListItem } from "./pr-list-item";
import { useMemo, useState } from "react";

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
		<VStack gap={4} w="full">
			{/* Search Header */}
			<Card.Root position="sticky" top="20" zIndex={40}>
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

						<Box position="relative" w={{ base: "full", sm: "64" }}>
							<SearchIcon
								position="absolute"
								left={3}
								top="50%"
								transform="translateY(-50%)"
								w={4}
								h={4}
								color="gray.400"
							/>
							<Input
								pl={9}
								pr={4}
								py={2}
								fontSize="sm"
								borderWidth="1px"
								borderColor="gray.300"
								rounded="md"
								_focus={{
									outline: "none",
									borderWidth: "2px",
									borderColor: "blue.500",
								}}
								placeholder="Filter by title or repo..."
								value={searchQuery}
								onChange={(e) => handleSearch(e.target.value)}
							/>
						</Box>
					</Flex>
				</Card.Body>
			</Card.Root>

			{/* Tabs */}
			<Tabs.Root index={activeTabIndex} onChange={handleTabChange}>
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

				<Tabs.Panels>
					<Tabs.Panel index={0}>
						{/* PR List */}
						<Card.Root overflow="hidden" minH="500px">
							{paginatedPRs.length > 0 ? (
								<VStack gap={0}>
									{paginatedPRs.map((pr, index) => (
										<Box
											key={pr.id}
											borderBottomWidth={index < paginatedPRs.length - 1 ? "1px" : "0px"}
											borderColor="gray.100"
										>
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
					</Tabs.Panel>

					<Tabs.Panel index={1}>
						{/* PR List */}
						<Card.Root overflow="hidden" minH="500px">
							{paginatedPRs.length > 0 ? (
								<VStack gap={0}>
									{paginatedPRs.map((pr, index) => (
										<Box
											key={pr.id}
											borderBottomWidth={index < paginatedPRs.length - 1 ? "1px" : "0px"}
											borderColor="gray.100"
										>
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
					</Tabs.Panel>

					<Tabs.Panel index={2}>
						{/* PR List */}
						<Card.Root overflow="hidden" minH="500px">
							{paginatedPRs.length > 0 ? (
								<VStack gap={0}>
									{paginatedPRs.map((pr, index) => (
										<Box
											key={pr.id}
											borderBottomWidth={index < paginatedPRs.length - 1 ? "1px" : "0px"}
											borderColor="gray.100"
										>
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
					</Tabs.Panel>
				</Tabs.Panels>
			</Tabs.Root>

			{/* Pagination */}
			{filteredPRs.length > itemsPerPage && (
				<Card.Root>
					<Card.Body px={4} py={3}>
						<Flex align="center" justify="space-between">
							<Box display={{ base: "none", sm: "block" }}>
								<Text fontSize="sm" color="gray.700">
									Showing{" "}
									<Text as="span" fontWeight="medium">
										{(currentPage - 1) * itemsPerPage + 1}
									</Text>{" "}
									to{" "}
									<Text as="span" fontWeight="medium">
										{Math.min(currentPage * itemsPerPage, filteredPRs.length)}
									</Text>{" "}
									of{" "}
									<Text as="span" fontWeight="medium">
										{filteredPRs.length}
									</Text>{" "}
									results
								</Text>
							</Box>

							<HStack>
								<Button
									onClick={() => handlePageChange(currentPage - 1)}
									disabled={currentPage === 1}
									variant="outline"
									size="sm"
									px={2}
									py={2}
									borderColor="gray.300"
									bg="white"
									color="gray.500"
									_hover={{ bg: "gray.50" }}
									roundedLeft="md"
									roundedRight="none"
								>
									<ChevronLeftIcon w={4} h={4} />
								</Button>
								<Box
									px={4}
									py={2}
									borderWidth="1px"
									borderColor="gray.300"
									bg="white"
									fontSize="sm"
									fontWeight="medium"
									color="gray.700"
								>
									Page {currentPage} of {totalPages}
								</Box>
								<Button
									onClick={() => handlePageChange(currentPage + 1)}
									disabled={currentPage === totalPages}
									variant="outline"
									size="sm"
									px={2}
									py={2}
									borderColor="gray.300"
									bg="white"
									color="gray.500"
									_hover={{ bg: "gray.50" }}
									roundedLeft="none"
									roundedRight="md"
								>
									<ChevronRightIcon w={4} h={4} />
								</Button>
							</HStack>
						</Flex>
					</Card.Body>
				</Card.Root>
			)}
		</VStack>
	);
}
