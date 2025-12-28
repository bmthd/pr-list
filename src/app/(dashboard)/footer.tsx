import { Box, HStack, NextLink, Text, VStack } from "@/ui";

function formatBuildTime(isoString: string | undefined): string {
	if (!isoString) return "";
	const date = new Date(isoString);
	return date.toLocaleDateString("ja-JP", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

export function Footer() {
	const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME;
	const formattedDate = formatBuildTime(buildTime);

	return (
		<Box as="footer" py={6} mt="auto">
			<VStack gap={2}>
				<HStack justify="center" align="center" gap={1}>
					<Text fontSize="sm" color="gray.500">
						Made with ❤️
					</Text>
					<NextLink href="https://yamada-ui.com/" fontSize="sm" external colorScheme="gray">
						Yamada UI
					</NextLink>
				</HStack>
				{formattedDate ? (
					<Text fontSize="xs" color="gray.400" textAlign="center">
						最終更新: {formattedDate}
					</Text>
				) : null}
			</VStack>
		</Box>
	);
}
