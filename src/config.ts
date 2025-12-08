import { createEnv } from "@t3-oss/env-nextjs";
import * as v from "valibot";

export const env = createEnv({
	client: {
		NEXT_PUBLIC_GITHUB_USERNAME: v.string(),
	},
	server: {
		GITHUB_TOKEN: v.string(),
	},
	runtimeEnv: {
		NEXT_PUBLIC_GITHUB_USERNAME: process.env.NEXT_PUBLIC_GITHUB_USERNAME,
		GITHUB_TOKEN: process.env.GITHUB_TOKEN,
	},
	emptyStringAsUndefined: true,
	skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
});
