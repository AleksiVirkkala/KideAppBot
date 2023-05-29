export const ogCatchHandler = (e: unknown) => {
	console.log(e);

	if (e instanceof TypeError) {
		return new Response(`${e.message}`, {
			status: 400
		});
	}
	return new Response(`Failed to generate the image`, {
		status: 500
	});
};
