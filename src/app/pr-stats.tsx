import type { AppPullRequest } from "@/interfaces/github.interface";
import { Tabs, VStack } from "@/ui";
import { PRCard } from "./pr-card";

interface PRTabsProps {
	allPRs: AppPullRequest[];
}

export function PRTabs({ allPRs }: PRTabsProps) {
	const openPRs = allPRs.filter((pr) => pr.state === "open");
	const mergedPRs = allPRs.filter((pr) => pr.pull_request?.merged_at);

	return (
		<VStack gap={4} w="full">
			<Tabs.Root defaultIndex={0}>
				<Tabs.List>
					<Tabs.Tab index={0}>All ({allPRs.length})</Tabs.Tab>
					<Tabs.Tab index={1}>Open ({openPRs.length})</Tabs.Tab>
					<Tabs.Tab index={2}>Merged ({mergedPRs.length})</Tabs.Tab>
				</Tabs.List>

				<Tabs.Panels>
					<Tabs.Panel index={0}>
						<VStack gap={4} w="full" maxW="4xl">
							{allPRs.map((pr) => (
								<PRCard key={pr.id} pr={pr} />
							))}
						</VStack>
					</Tabs.Panel>

					<Tabs.Panel index={1}>
						<VStack gap={4} w="full" maxW="4xl">
							{openPRs.map((pr) => (
								<PRCard key={pr.id} pr={pr} />
							))}
						</VStack>
					</Tabs.Panel>

					<Tabs.Panel index={2}>
						<VStack gap={4} w="full" maxW="4xl">
							{mergedPRs.map((pr) => (
								<PRCard key={pr.id} pr={pr} />
							))}
						</VStack>
					</Tabs.Panel>
				</Tabs.Panels>
			</Tabs.Root>
		</VStack>
	);
}
