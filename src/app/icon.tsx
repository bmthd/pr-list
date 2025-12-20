import { ImageResponse } from "next/og";
import { env } from "@/config";
import { getUserAvatarUrl } from "@/repositories/github-repository";

export const runtime = "edge";

export const size = {
	width: 32,
	height: 32,
};

export const contentType = "image/png";

export default async function Icon() {
	try {
		const avatarUrl = await getUserAvatarUrl(env.NEXT_PUBLIC_GITHUB_USERNAME);

		return new ImageResponse(
			// biome-ignore lint/plugin: ImageResponse requires native HTML elements
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					borderRadius: "50%",
					overflow: "hidden",
				}}
			>
				{/* biome-ignore lint/plugin: ImageResponse requires native HTML elements */}
				<img
					src={avatarUrl}
					alt="GitHub Avatar"
					style={{
						width: "100%",
						height: "100%",
						objectFit: "cover",
					}}
				/>
			</div>,
			{
				...size,
			}
		);
	} catch (error) {
		console.error("Failed to generate dynamic icon:", error);

		return new ImageResponse(
			// biome-ignore lint/plugin: ImageResponse requires native HTML elements
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: "#1f2937",
					borderRadius: "50%",
				}}
			>
				{/* biome-ignore lint/plugin: ImageResponse requires native HTML elements */}
				<div
					style={{
						fontSize: "16px",
						fontWeight: "bold",
						color: "white",
					}}
				>
					PR
				</div>
			</div>,
			{
				...size,
			}
		);
	}
}
