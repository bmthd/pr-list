"use client";

export function TimezonedDateTime() {
	const formattedDate = new Date(Date.now()).toLocaleString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		timeZoneName: "short",
	});

	return <>{formattedDate}</>;
}
