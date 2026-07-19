# Initial Loading Shell Implementation Plan

> **For autonomous workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the initial spinner with a static dashboard loading shell that reduces perceived wait stress.

**Architecture:** `src/app/(dashboard)/layout.tsx` owns the stable dashboard chrome and sidebar fallbacks. `src/app/(dashboard)/loading.tsx` owns only the PR list loading UI. A node Vitest test checks the source contract to guard against reintroducing spinner-only loading or duplicated chrome.

**Tech Stack:** Next.js App Router, React 19, Yamada UI, Vitest.

## Global Constraints

- Use Yamada UI components from `@/ui`.
- Do not use raw HTML elements.
- Do not use `className`.
- Do not use inline comments.
- Run `bun check:all` before completion.

---

### Task 1: Loading Shell Test

**Files:**
- Create: `test/node/loading.test.tsx`

**Interfaces:**
- Consumes: source text from `src/app/(dashboard)/loading.tsx` and `src/app/(dashboard)/layout.tsx`
- Produces: regression coverage for loading shell copy and spinner removal

- [ ] **Step 1: Write the failing test**

```tsx
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun test:node test/node/loading.test.tsx`
Expected: FAIL because `src/app/(dashboard)/loading.tsx` does not exist yet.

### Task 2: Static Loading Shell

**Files:**
- Delete: `src/app/loading.tsx`
- Create: `src/app/(dashboard)/loading.tsx`
- Modify: `src/app/(dashboard)/layout.tsx`
- Modify: `docs/technical-specs.md`

**Interfaces:**
- Consumes: Yamada UI layout components from `@/ui`
- Produces: route loading component with PR list shell content and layout-level sidebar fallbacks

- [ ] **Step 1: Implement the minimal shell**

Use `Box`, `Card`, `HStack`, `Separator`, `Text`, and `VStack` in `src/app/(dashboard)/loading.tsx` to render only the PR list placeholders. Wrap `UserProfileSummary` and `ContributedOrganizations` with `Suspense` in `src/app/(dashboard)/layout.tsx` and provide local fallbacks for their data-dependent content.

- [ ] **Step 2: Update docs**

Document that loading uses the real dashboard layout and only swaps data-dependent regions.

- [ ] **Step 3: Run focused verification**

Run: `bun test:node test/node/loading.test.tsx`
Expected: PASS.

- [ ] **Step 4: Run full verification**

Run: `bun check:all`
Expected: PASS.

## Self-Review

- Spec coverage: Task 1 covers regression testing, Task 2 covers UI and docs.
- Placeholder scan: no implementation placeholders remain.
- Type consistency: the plan uses only `src/app/loading.tsx` source text and exported Yamada UI components.
