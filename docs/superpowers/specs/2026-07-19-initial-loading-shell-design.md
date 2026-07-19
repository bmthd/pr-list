# Initial Loading Shell Design

## Goal

Replace the initial spinner-only loading state with a calm, static dashboard shell that communicates page structure before GitHub data arrives.

## Chosen Approach

Use static loading shells inside the actual dashboard layout. `src/app/(dashboard)/layout.tsx` keeps the header and page grid stable while sidebar data loads with local fallbacks. `src/app/(dashboard)/loading.tsx` handles only the PR list area, so the initial state no longer swaps a separately implemented full-page shell for the real dashboard layout.

## Constraints

- Use Yamada UI components exported from `@/ui`.
- Do not use raw HTML elements or `className`.
- Do not use inline comments.
- Do not use `&&` for conditional rendering.
- Keep the loading UI independent from GitHub API data.
- Avoid duplicating the dashboard chrome outside `src/app/(dashboard)/layout.tsx`.
- Keep copy short and stable to reduce perceived waiting time.

## Testing

Add a node Vitest test that verifies the dashboard loading source contract:

- The loading shell includes dashboard structure labels.
- Spinner-specific loading markup is not rendered.
- Dashboard chrome is not duplicated in the route loading component.
