"use client";

import type { AppPullRequest } from "@/interfaces/github.interface";
import {
	Badge,
	Box,
	GitMergeIcon,
	GitPullRequestClosedIcon,
	GitPullRequestIcon,
	HStack,
	Link,
	Text,
	VStack,
} from "@/ui";

interface PRListItemProps {
	pr: AppPullRequest;
}

function StatusIcon({ pr }: { pr: AppPullRequest }) {
	if (pr.pull_request?.merged_at) {
		return <GitMergeIcon color="purple.600" w={5} h={5} />;
	}
	if (pr.state === "closed") {
		return <GitPullRequestClosedIcon color="red.600" w={5} h={5} />;
	}
	return <GitPullRequestIcon color="green.600" w={5} h={5} />;
}

function StatusBadge({ pr }: { pr: AppPullRequest }) {
	let status = pr.state;
	let colorScheme = "gray";

	if (pr.pull_request?.merged_at) {
		status = "merged";
		colorScheme = "purple";
	} else if (pr.state === "closed") {
		colorScheme = "red";
	} else if (pr.state === "open") {
		colorScheme = "green";
	}

	return (
		<Badge
			variant="subtle"
			colorScheme={colorScheme}
			textTransform="capitalize"
			fontSize="xs"
			fontWeight="medium"
			rounded="full"
			px={2}
			py={0.5}
		>
			{status}
		</Badge>
	);
}

export function PRListItem({ pr }: PRListItemProps) {
	const urlParts = pr.html_url.split("/");
	const repositoryOwner = urlParts[3];
	const repositoryName = urlParts[4];

	return (
		<Box p={4} _hover={{ bg: "gray.50" }} transition="colors" _groupHover={{}}>
			<HStack gap={3} align="start">
				<Box pt={1} flexShrink={0}>
					<StatusIcon pr={pr} />
				</Box>

				<VStack gap={1} align="start" flex={1} minW={0}>
					<HStack justify="space-between" align="start" gap={4} w="full">
						<Text
							fontSize="base"
							fontWeight="semibold"
							color="gray.900"
							_hover={{ color: "blue.600" }}
							transition="colors"
							cursor="pointer"
							as={Link}
							href={pr.html_url}
							external
							overflow="hidden"
							textOverflow="ellipsis"
							whiteSpace="nowrap"
						>
							{pr.title}
						</Text>
						<Box flexShrink={0}>
							<StatusBadge pr={pr} />
						</Box>
					</HStack>

					<HStack gap={3} flexWrap="wrap" fontSize="xs" color="gray.500">
						<Text fontFamily="mono" color="gray.600" fontWeight="medium">
							#{pr.number}
						</Text>
						<Text>•</Text>
						<Text fontWeight="medium" color="gray.700">
							{repositoryOwner}/{repositoryName}
						</Text>
						<Text>•</Text>
						<Text>opened on {new Date(pr.created_at).toLocaleDateString("ja-JP")}</Text>
					</HStack>
				</VStack>
			</HStack>
		</Box>
	);
}
