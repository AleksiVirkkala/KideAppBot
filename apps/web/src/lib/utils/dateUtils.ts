export function calculateDateCount(from: Date, to: Date) {
	// Convert both dates to milliseconds
	const timeFrom = from.getTime();
	const timeTo = to.getTime();

	// Calculate the difference in milliseconds
	const differenceInMilliseconds = Math.abs(timeTo - timeFrom);

	// Calculate the number of days
	const days = differenceInMilliseconds / (1000 * 60 * 60 * 24);

	return Math.floor(days); // Use Math.floor() if you want to get the number of full days
}

export function calculateDateCountFromNow(to: Date) {
	return calculateDateCount(new Date(), to);
}
