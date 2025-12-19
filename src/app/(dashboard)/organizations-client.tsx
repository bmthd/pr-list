"use client";

import { useCallback, useMemo } from "react";
import { usePROrganizationFilter } from "@/hooks/use-pr-state";
import {
	Avatar,
	BuildingIcon,
	createColumnHelper,
	Heading,
	HStack,
	IconButton,
	NextLink,
	RadioGroup,
	Table,
	Text,
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

const columnHelper = createColumnHelper<Organization>();

export function OrganizationsClient({ organizations }: OrganizationsClientProps) {
	const [selectedOrganization, setSelectedOrganization] = usePROrganizationFilter();

	const ClearFilterButton = useCallback(
		() =>
			selectedOrganization ? (
				<IconButton
					variant="ghost"
					size="2xs"
					colorScheme="danger"
					aria-label="Clear organization filter"
					icon={<XIcon w={3} h={3} color="gray.500" />}
					onClick={() => setSelectedOrganization("")}
				/>
			) : null,
		[selectedOrganization, setSelectedOrganization]
	);

	const columns = useMemo(
		() => [
			columnHelper.display({
				id: "organization",
				header: () => (
					<HStack gap={2}>
						<BuildingIcon w={4} h={4} color="gray.500" />
						<Heading size="sm" color="gray.700">
							Contributed Organizations
						</Heading>
					</HStack>
				),
				cell: ({ row }) => {
					const organization = row.original;
					return (
						<HStack gap={3}>
							<NextLink href={`https://github.com/${organization.login}`} external>
								<Avatar src={organization.avatarUrl} name={organization.login} size="sm" shape="rounded" />
							</NextLink>
							<Text fontSize="sm" color="gray.700" lineClamp={1}>
								{organization.login}
							</Text>
						</HStack>
					);
				},
			}),
			columnHelper.accessor("totalPRs", {
				header: ClearFilterButton,
				cell: ({ getValue, row }) => (
					<HStack justify="flex-start" alignItems="center">
						<RadioGroup.Item value={row.original.login}>
							<Text fontSize="xs" color="gray.500" fontWeight="medium">
								{getValue()} PRs
							</Text>
						</RadioGroup.Item>
					</HStack>
				),
			}),
		],
		[ClearFilterButton]
	);

	const getRowId = useCallback((row: Organization) => row.id.toString(), []);

	return (
		<RadioGroup.Root
			overflow="hidden"
			borderRadius="md"
			borderWidth="1px"
			borderColor="gray.200"
			value={selectedOrganization || undefined}
			onChange={setSelectedOrganization}
		>
			<Table
				columns={columns}
				data={organizations}
				getRowId={getRowId}
				headerProps={({ id }) => ({ bg: "bg.muted", p: id === "organization" ? "md" : "sm" })}
				rowProps={{ bg: "bg.panel", cursor: "pointer", _hover: { bg: "bg.subtle" } }}
				cellProps={{ p: "3", verticalAlign: "middle" }}
				enableRowSelection
				onRowClick={(row) => setSelectedOrganization(row.original.login)}
				withCheckbox={false}
				defaultSorting={[
					{ id: "totalPRs", desc: true },
					{ id: "login", desc: false },
				]}
			/>
		</RadioGroup.Root>
	);
}
