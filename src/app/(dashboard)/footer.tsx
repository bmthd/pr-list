import { Box, HStack, NextLink, Text, VStack } from "@/ui";
import { TimezonedDateTime } from "./timezoned-date-time";

interface FooterProps {
	now: number;
}

export function Footer({ now }: FooterProps) {
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
				<Text fontSize="xs" color="gray.400" textAlign="center">
					Last updated: <TimezonedDateTime timestamp={now} />
				</Text>
			</VStack>
		</Box>
	);
}
