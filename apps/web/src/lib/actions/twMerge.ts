import { twMerge as tailwindMerge } from 'tailwind-merge';

export function twMerge(node: Element, className: string | string[]) {
	const classNames: string[] = Array.isArray(className) ? className : [className];

	if (node instanceof SVGElement) {
		// There is no `className` property on SVG elements.
		node.setAttribute('class', tailwindMerge(node.getAttribute('class'), ...classNames));
	} else {
		node.className = tailwindMerge(node.className, ...classNames);
	}
}
