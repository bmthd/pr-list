"use client"; // TODO: SCにしたい

import { Avatar, type AvatarProps } from "@yamada-ui/react";
import { NextLink } from "@/ui";

interface MyAvatarProps extends AvatarProps {
	username: string;
}

export const GithubAvatar = ({ username, ...props }: MyAvatarProps) => {
	return (
		<NextLink href={`https://github.com/${username}`} external>
			<Avatar src={`https://github.com/${username}.png`} name={username} {...props} />
		</NextLink>
	);
};
