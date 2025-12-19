"use client";

import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { startTransition } from "react";

const PR_TAB_VALUES = ["all", "open", "merged", "closed"] as const;

export type PRTabValue = (typeof PR_TAB_VALUES)[number];

function usePRState() {
	return useQueryStates(
		{
			tab: parseAsString.withDefault("all"),
			search: parseAsString.withDefault(""),
			page: parseAsInteger.withDefault(1),
			org: parseAsString.withDefault(""),
		},
		{
			startTransition,
		}
	);
}

export function usePRTab() {
	const [state, setState] = usePRState();

	const tabIndex = PR_TAB_VALUES.indexOf(state.tab as PRTabValue);
	const activeTabIndex = tabIndex >= 0 ? tabIndex : 0;

	const setActiveTab = (index: number) => {
		const tabValue = PR_TAB_VALUES[index];
		if (tabValue) {
			setState({
				tab: tabValue,
				page: 1,
			});
		}
	};

	return [activeTabIndex, setActiveTab] as const;
}

export function usePRSearch() {
	const [state, setState] = usePRState();

	const setSearchQuery = (search: string) => {
		setState({
			search,
			page: 1,
		});
	};

	return [state.search, setSearchQuery] as const;
}

export function usePRPagination() {
	const [state, setState] = usePRState();

	const setCurrentPage = (page: number) => {
		setState({ page });
	};

	return [state.page, setCurrentPage] as const;
}

export function usePROrganizationFilter() {
	const [state, setState] = usePRState();

	const setSelectedOrganization = (org: string) => {
		setState({
			org: org || "",
			page: 1,
		});
	};

	return [state.org || null, setSelectedOrganization] as const;
}
