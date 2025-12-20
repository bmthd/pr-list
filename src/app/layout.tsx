import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next";
import { env } from "@/config";
import { getUserAvatarUrl } from "@/repositories/github-repository";
import { config, theme } from "@/theme";
import { ColorModeScript, UIProvider } from "@/ui";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
	const username = env.NEXT_PUBLIC_GITHUB_USERNAME;
	try {
		const avatarUrl = await getUserAvatarUrl(username);

		return {
			title: {
				template: `%s | ${username}'s Pull Requests`,
				default: `${username}'s Pull Requests - GitHub PR Portfolio`,
			},
			description: `Explore ${username}'s GitHub pull requests - contributions, open source projects, and development activity across various repositories.`,
			keywords: [
				username,
				"GitHub",
				"Pull Requests",
				"Open Source",
				"Development",
				"Programming",
				"Portfolio",
				"Code Contributions",
			],
			authors: [{ name: username, url: `https://github.com/${username}` }],
			creator: username,
			publisher: username,
			metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
			alternates: {
				canonical: "/",
			},
			openGraph: {
				type: "website",
				locale: "en_US",
				url: "/",
				title: `${username}'s Pull Requests - GitHub PR Portfolio`,
				description: `Explore ${username}'s GitHub pull requests - contributions, open source projects, and development activity across various repositories.`,
				siteName: `${username}'s Pull Requests`,
				images: [
					{
						url: avatarUrl,
						width: 460,
						height: 460,
						alt: `${username}'s GitHub Profile Picture`,
					},
				],
			},
			twitter: {
				card: "summary",
				title: `${username}'s Pull Requests - GitHub PR Portfolio`,
				description: `Explore ${username}'s GitHub pull requests - contributions, open source projects, and development activity.`,
				images: [avatarUrl],
			},
			robots: {
				index: true,
				follow: true,
				googleBot: {
					index: true,
					follow: true,
					"max-video-preview": -1,
					"max-image-preview": "large",
					"max-snippet": -1,
				},
			},
			verification: {
				google: "verification-token-if-needed",
			},
		};
	} catch (error) {
		console.error("Failed to fetch avatar URL for metadata:", error);
		// Fallback to default metadata without avatar
		return {
			title: {
				template: `%s | ${username}'s Pull Requests`,
				default: `${username}'s Pull Requests - GitHub PR Portfolio`,
			},
			description: `Explore ${username}'s GitHub pull requests - contributions, open source projects, and development activity across various repositories.`,
			keywords: [
				username,
				"GitHub",
				"Pull Requests",
				"Open Source",
				"Development",
				"Programming",
				"Portfolio",
				"Code Contributions",
			],
			authors: [{ name: username, url: `https://github.com/${username}` }],
			creator: username,
			publisher: username,
			metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
			alternates: {
				canonical: "/",
			},
			openGraph: {
				type: "website",
				locale: "en_US",
				url: "/",
				title: `${username}'s Pull Requests - GitHub PR Portfolio`,
				description: `Explore ${username}'s GitHub pull requests - contributions, open source projects, and development activity across various repositories.`,
				siteName: `${username}'s Pull Requests`,
			},
			twitter: {
				card: "summary",
				title: `${username}'s Pull Requests - GitHub PR Portfolio`,
				description: `Explore ${username}'s GitHub pull requests - contributions, open source projects, and development activity.`,
			},
			robots: {
				index: true,
				follow: true,
				googleBot: {
					index: true,
					follow: true,
					"max-video-preview": -1,
					"max-image-preview": "large",
					"max-snippet": -1,
				},
			},
			verification: {
				google: "verification-token-if-needed",
			},
		};
	}
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
				<ColorModeScript />
				<UIProvider theme={theme} config={config}>
					<NuqsAdapter>{children}</NuqsAdapter>
				</UIProvider>
			</body>
		</html>
	);
}
