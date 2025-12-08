"use client";

import type { AppPullRequest } from "@/interfaces/github.interface";
import {
	Avatar,
	GitMergeIcon,
	GitPullRequestArrowIcon,
	GitPullRequestClosedIcon,
	HStack,
	NextLink,
	Text,
	VStack,
} from "@/ui";

interface PRCardProps {
	pr: AppPullRequest;
}

export function PRCard({ pr }: PRCardProps) {
	const urlParts = pr.html_url.split("/");
	const repositoryOwner = urlParts[3];
	const repositoryName = urlParts[4];

	const orgAvatarUrl = `https://github.com/${repositoryOwner}.png`;

	return (
		<HStack
			gap={4}
			p={4}
			w="full"
			maxW="4xl"
			mx="auto"
			borderBottom="1px solid"
			borderColor="gray.200"
			transition="all 0.2s"
		>
			<NextLink href={`https://github.com/${repositoryOwner}`}>
				<Avatar src={orgAvatarUrl} name={repositoryOwner} size="md" shape="rounded" />
			</NextLink>

			<VStack gap={2} align="start" flex={1}>
				<NextLink href={pr.html_url} external color="blue.600" fontWeight="semibold" fontSize="md" lineHeight="short">
					{pr.title}
				</NextLink>

				<HStack gap={3} align="center">
					<PRStatusIcon pr={pr} />
					<Text fontSize="sm" color="gray.600">
						<NextLink href={`https://github.com/${repositoryOwner}`}>{repositoryOwner}</NextLink>
						{" / "}
						<NextLink href={`https://github.com/${repositoryOwner}/${repositoryName}`}>{repositoryName}</NextLink>
					</Text>
					<Text fontSize="sm" color="gray.500">
						#{pr.number}
					</Text>
					<Text fontSize="sm" color="gray.500">
						{getDaysAgo(pr.created_at)}
					</Text>
				</HStack>
			</VStack>
		</HStack>
	);
}

function PRStatusIcon({ pr }: { pr: AppPullRequest }) {
	if (pr.pull_request?.merged_at) {
		return <GitMergeIcon color="purple.500" />;
	}
	if (pr.state === "closed") {
		return <GitPullRequestClosedIcon color="red.500" />;
	}
	return <GitPullRequestArrowIcon color="green.500" />;
}

const getDaysAgo = (dateString: string) => {
	const date = new Date(dateString);
	const now = new Date();
	const diffTime = Math.abs(now.getTime() - date.getTime());
	const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

	if (diffDays === 0) return "today";
	if (diffDays === 1) return "1 day ago";
	return `${diffDays} days ago`;
};
