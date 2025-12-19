"use client";

import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryState } from "nuqs";
import { startTransition, useCallback } from "react";

const PR_TAB_VALUES = ["all", "open", "merged", "closed"] as const;

export type PRTabValue = (typeof PR_TAB_VALUES)[number];

export function usePRTab() {
	const [tab, setTab] = useQueryState<PRTabValue>(
		"tab",
		parseAsStringLiteral(PR_TAB_VALUES).withDefault("all").withOptions({
			startTransition,
		})
	);

	const tabIndex = PR_TAB_VALUES.indexOf(tab);
	const activeTabIndex = tabIndex >= 0 ? tabIndex : 0;

	const setActiveTab = useCallback(
		(index: number) => {
			const tabValue = PR_TAB_VALUES[index];
			if (tabValue) {
				setTab(tabValue);
			}
		},
		[setTab]
	);

	return [activeTabIndex, setActiveTab] as const;
}

export function usePRSearch() {
	const [search, setSearch] = useQueryState(
		"search",
		parseAsString.withDefault("").withOptions({
			startTransition,
		})
	);

	return [search, setSearch] as const;
}

export function usePRPagination() {
	const [page, setPage] = useQueryState(
		"page",
		parseAsInteger.withDefault(1).withOptions({
			startTransition,
		})
	);

	return [page, setPage] as const;
}

export function usePROrganizationFilter() {
	const [org, setOrg] = useQueryState(
		"org",
		parseAsString.withDefault("").withOptions({
			startTransition,
		})
	);

	const setSelectedOrganization = (orgValue: string) => {
		setOrg(orgValue || "");
	};

	return [org, setSelectedOrganization] as const;
}
