import type { AppPullRequest } from "@/interfaces/github.interface";
import {
	Avatar,
	Badge,
	Box,
	GitMergeIcon,
	GitPullRequestClosedIcon,
	GitPullRequestIcon,
	HStack,
	NextLink,
	Text,
	VStack,
} from "@/ui";

interface PRListItemProps {
	pr: AppPullRequest;
}

export function PRListItem({ pr }: PRListItemProps) {
	const urlParts = pr.html_url.split("/");
	const repositoryOwner = urlParts[3];
	const repositoryName = urlParts[4];
	const orgAvatarUrl = `https://github.com/${repositoryOwner}.png`;

	return (
		<Box p={4} _hover={{ bg: `color-mix(in srgb, bg.panel, gray 5%)` }} transition="colors" _groupHover={{}}>
			<HStack gap={3} align="start">
				<Box pt={1} flexShrink={0}>
					<StatusIcon pr={pr} />
				</Box>

				<VStack gap={1} align="start" flex={1} minW={0}>
					<HStack justify="space-between" align="start" gap={4} w="full">
						<NextLink
							href={pr.html_url}
							external
							colorScheme="black"
							fontWeight="semibold"
							overflow="hidden"
							textOverflow="ellipsis"
							whiteSpace="nowrap"
							flex={1}
							minW={0}
						>
							{pr.title}
						</NextLink>
						<Box flexShrink={0}>
							<StatusBadge pr={pr} />
						</Box>
					</HStack>

					<HStack gap={3} flexWrap="wrap" fontSize="xs" color="gray.500">
						<NextLink
							href={pr.html_url}
							external
							fontFamily="mono"
							colorScheme="gray"
							fontWeight="medium"
							w="2rem"
							textAlign="right"
							flexShrink={0}
						>
							#{pr.number}
						</NextLink>
						<HStack gap={2} fontWeight="medium">
							<NextLink
								href={`https://github.com/${repositoryOwner}`}
								external
								aria-label={`${repositoryOwner} organization`}
							>
								<Avatar src={orgAvatarUrl} name={repositoryOwner} w={4} h={4} shape="square" />
							</NextLink>
							<Text>
								<NextLink
									href={`https://github.com/${repositoryOwner}`}
									external
									fontWeight="medium"
									colorScheme="gray"
								>
									{repositoryOwner}
								</NextLink>
								/
								<NextLink
									href={`https://github.com/${repositoryOwner}/${repositoryName}`}
									external
									fontWeight="medium"
									colorScheme="gray"
								>
									{repositoryName}
								</NextLink>
							</Text>
						</HStack>
						<Text>opened on {new Date(pr.created_at).toLocaleDateString("ja-JP")}</Text>
					</HStack>
				</VStack>
			</HStack>
		</Box>
	);
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
			px={2}
			py={0.5}
			w="3.5rem"
			display="center"
		>
			{status}
		</Badge>
	);
}
