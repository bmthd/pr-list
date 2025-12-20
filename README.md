# PR List

A Next.js application for viewing GitHub pull request statistics and activity. Track your development contributions and open source activity with an interactive dashboard.

## Features

- 📊 GitHub pull request statistics dashboard
- 🔍 Filter PRs by status (open, closed, all)
- 📱 Responsive design with Yamada UI components
- ⚡ Server-side rendering with Next.js 16
- 🔄 Automatic data revalidation every hour

## Tech Stack

- **Framework**: Next.js 16 with React 19
- **UI Library**: Yamada UI
- **Runtime**: Bun
- **TypeScript**: Full type safety
- **GitHub API**: Octokit for GitHub integration
- **State Management**: nuqs for URL state
- **Testing**: Vitest with Playwright browser testing

## Getting Started

### Prerequisites

- Bun runtime
- GitHub personal access token

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Add your GitHub username and access token

4. Start the development server:
   ```bash
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development

### Available Scripts

- `bun dev` - Start development server
- `bun build` - Build for production
- `bun start` - Start production server
- `bun check:all` - Run all checks (lint, format, type, spell)
- `bun fix:all` - Fix all auto-fixable issues
- `bun test` - Run tests

### Code Quality

This project uses several tools to maintain code quality:

- **Biome** - Formatting and linting
- **TypeScript** - Type checking
- **CSpell** - Spell checking
- **Vitest** - Testing

Always run `bun check:all` before committing changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.