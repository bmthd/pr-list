import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next";
import { env } from "@/config";
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

export const metadata: Metadata = {
	title: {
		template: `%s | ${env.NEXT_PUBLIC_GITHUB_USERNAME}'s Pull Requests`,
		default: `${env.NEXT_PUBLIC_GITHUB_USERNAME}'s Pull Requests - GitHub PR Portfolio`,
	},
	description: `Explore ${env.NEXT_PUBLIC_GITHUB_USERNAME}'s GitHub pull requests - contributions, open source projects, and development activity across various repositories.`,
	keywords: [
		env.NEXT_PUBLIC_GITHUB_USERNAME,
		"GitHub",
		"Pull Requests",
		"Open Source",
		"Development",
		"Programming",
		"Portfolio",
		"Code Contributions",
	],
	authors: [{ name: env.NEXT_PUBLIC_GITHUB_USERNAME, url: `https://github.com/${env.NEXT_PUBLIC_GITHUB_USERNAME}` }],
	creator: env.NEXT_PUBLIC_GITHUB_USERNAME,
	publisher: env.NEXT_PUBLIC_GITHUB_USERNAME,
	metadataBase: new URL("https://pr-list.bmth.dev"),
	alternates: {
		canonical: "/",
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "/",
		title: `${env.NEXT_PUBLIC_GITHUB_USERNAME}'s Pull Requests - GitHub PR Portfolio`,
		description: `Explore ${env.NEXT_PUBLIC_GITHUB_USERNAME}'s GitHub pull requests - contributions, open source projects, and development activity across various repositories.`,
		siteName: `${env.NEXT_PUBLIC_GITHUB_USERNAME}'s Pull Requests`,
		images: [
			{
				url: "https://avatars.githubusercontent.com/u/81406938?v=4",
				width: 460,
				height: 460,
				alt: `${env.NEXT_PUBLIC_GITHUB_USERNAME}'s GitHub Profile Picture`,
			},
		],
	},
	twitter: {
		card: "summary",
		title: `${env.NEXT_PUBLIC_GITHUB_USERNAME}'s Pull Requests - GitHub PR Portfolio`,
		description: `Explore ${env.NEXT_PUBLIC_GITHUB_USERNAME}'s GitHub pull requests - contributions, open source projects, and development activity.`,
		images: ["https://avatars.githubusercontent.com/u/81406938?v=4"],
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
