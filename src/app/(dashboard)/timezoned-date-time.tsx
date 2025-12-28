"use client";

interface TimezonedDateTimeProps {
	timestamp: number;
}

export function TimezonedDateTime({ timestamp }: TimezonedDateTimeProps) {
	const formattedDate = new Date(timestamp).toLocaleString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		timeZoneName: "short",
	});

	return <>{formattedDate}</>;
}
