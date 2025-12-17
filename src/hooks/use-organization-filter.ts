"use client";

import { useQueryState } from "nuqs";
import { CONSTANTS } from "@/constants";

export function useOrganizationFilter() {
	return useQueryState<string>(CONSTANTS.QUERY_PARAMS.ORGANIZATIONS, {
		defaultValue: "",
		clearOnDefault: true,
		parse: (value) => (value === "" ? null : value),
	});
}
