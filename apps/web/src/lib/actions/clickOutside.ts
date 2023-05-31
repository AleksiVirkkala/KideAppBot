export function clickOutside(node: Element) {
	const handleClick = (event: Event) => {
		const target = event.target as Node; // Not pretty, but works.
		if (!node.contains(target) && !event.defaultPrevented) {
			node.dispatchEvent(new CustomEvent('outclick'));
		}
	};
	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
}
