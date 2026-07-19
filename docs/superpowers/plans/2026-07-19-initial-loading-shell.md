# Initial Loading Shell Implementation Plan

> **For autonomous workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the initial spinner with a static dashboard loading shell that reduces perceived wait stress.

**Architecture:** `src/app/loading.tsx` owns the route loading UI and renders a data-free shell that visually resembles the dashboard layout. A node Vitest test checks the source contract to guard against reintroducing spinner-only loading.

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
- Consumes: source text from `src/app/loading.tsx`
- Produces: regression coverage for loading shell copy and spinner removal

- [ ] **Step 1: Write the failing test**

```tsx
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun test:node test/node/loading.test.tsx`
Expected: FAIL because `loading.tsx` still renders only `Loading.Circles`.

### Task 2: Static Loading Shell

**Files:**
- Modify: `src/app/loading.tsx`
- Modify: `docs/technical-specs.md`

**Interfaces:**
- Consumes: Yamada UI layout components from `@/ui`
- Produces: default loading component with dashboard shell content

- [ ] **Step 1: Implement the minimal shell**

Use `Box`, `Card`, `Grid`, `GridItem`, `Heading`, `HStack`, `Separator`, `Text`, and `VStack` to render the header, left rail placeholders, and PR list placeholders. Use static gray blocks with fixed heights and border radii to reserve layout space.

- [ ] **Step 2: Update docs**

Document that `src/app/loading.tsx` uses a static dashboard shell instead of a spinner.

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
