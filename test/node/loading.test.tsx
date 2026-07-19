import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

describe("initial loading shell", () => {
	const source = readFileSync(join(process.cwd(), "src/app/loading.tsx"), "utf8");

	test("renders the dashboard structure before data arrives", () => {
		expect(source).toContain("My Contribution Dashboard");
		expect(source).toContain("Loading contribution overview");
		expect(source).toContain("Contributed Organizations");
		expect(source).toContain("Pull Requests");
	});

	test("does not render a spinner-only loading indicator", () => {
		expect(source).not.toContain("Loading.Circles");
		expect(source).not.toContain("loadingScheme=\"rings\"");
	});
});
