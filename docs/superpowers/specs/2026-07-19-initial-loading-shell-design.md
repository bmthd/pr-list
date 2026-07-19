# Initial Loading Shell Design

## Goal

Replace the initial spinner-only loading state with a calm, static dashboard shell that communicates page structure before GitHub data arrives.

## Chosen Approach

Use a static page skeleton in `src/app/loading.tsx`. The shell mirrors the dashboard layout with a header, profile card placeholder, organization list placeholder, PR controls placeholder, and PR list placeholder. It avoids animated spinners and avoids content popping by reserving similar space to the final page.

## Constraints

- Use Yamada UI components exported from `@/ui`.
- Do not use raw HTML elements or `className`.
- Do not use inline comments.
- Do not use `&&` for conditional rendering.
- Keep the loading UI independent from GitHub API data.
- Keep copy short and stable to reduce perceived waiting time.

## Testing

Add a node Vitest test that verifies the `src/app/loading.tsx` source contract:

- The loading shell includes dashboard structure labels.
- Spinner-specific loading markup is not rendered.
