import { Box, HStack, NextLink, Text } from "@/ui";

export function Footer() {
	return (
		<Box as="footer" py={6} mt="auto">
			<HStack justify="center" align="center" gap={1}>
				<Text fontSize="sm" color="gray.500">
					Made with ❤️
				</Text>
				<NextLink href="https://yamada-ui.com/" fontSize="sm" external colorScheme="gray">
					Yamada UI
				</NextLink>
			</HStack>
		</Box>
	);
}
