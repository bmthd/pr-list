"use client";

import { match } from "ts-pattern";
import { IconButton, MoonIcon, SunIcon, useColorMode } from "@/ui";

export function ColorModeToggleButton() {
	const { colorMode, toggleColorMode } = useColorMode();

	return (
		<IconButton
			variant="outline"
			rounded="full"
			size="sm"
			onClick={toggleColorMode}
			aria-label="Toggle color mode"
			icon={match(colorMode)
				.with("light", () => <MoonIcon />)
				.with("dark", () => <SunIcon />)
				.exhaustive()}
		/>
	);
}
