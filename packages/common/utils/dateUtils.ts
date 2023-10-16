export function getTimeLeft(date: Date) {
	const now = new Date();
	const timeLeft = date.getTime() - now.getTime();
	const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
	const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
	const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
	const seconds = Math.floor((timeLeft / 1000) % 60);

	return { days, hours, minutes, seconds };
}
