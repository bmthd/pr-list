import { Avatar, type AvatarProps } from "@yamada-ui/react";

interface MyAvatarProps extends AvatarProps {
	username: string;
}

export const MyAvatar = ({ username, ...props }: MyAvatarProps) => {
	return <Avatar src={`https://github.com/${username}.png`} name={username} {...props} />;
};
