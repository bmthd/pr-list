import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

describe("initial loading shell", () => {
	const dashboardLoadingSource = readFileSync(join(process.cwd(), "src/app/(dashboard)/loading.tsx"), "utf8");
	const dashboardLayoutSource = readFileSync(join(process.cwd(), "src/app/(dashboard)/layout.tsx"), "utf8");

	test("renders loading placeholders inside the real dashboard layout", () => {
		expect(dashboardLoadingSource).toContain("Pull Requests");
		expect(dashboardLoadingSource).toContain("Fetching the latest contribution list");
		expect(dashboardLoadingSource).not.toContain("My Contribution Dashboard");
		expect(dashboardLoadingSource).not.toContain("Contributed Organizations");
	});

	test("keeps sidebar loading in the shared dashboard layout", () => {
		expect(dashboardLayoutSource).toContain("Suspense");
		expect(dashboardLayoutSource).toContain("UserProfileSummaryFallback");
		expect(dashboardLayoutSource).toContain("ContributedOrganizationsFallback");
	});

	test("does not render a spinner-only loading indicator", () => {
		expect(dashboardLoadingSource).not.toContain("Loading.Circles");
		expect(dashboardLoadingSource).not.toContain("loadingScheme=\"rings\"");
	});
});
