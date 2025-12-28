import type { NextConfig } from "next";

export default {
	reactStrictMode: true,
	reactCompiler: true,
	env: {
		NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
	},
} satisfies NextConfig;
