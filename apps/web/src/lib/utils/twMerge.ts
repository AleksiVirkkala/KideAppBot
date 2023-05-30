import { twMerge as tailwindMerge } from 'tailwind-merge';

export function twMerge(node: Element, className: string) {
	if (node instanceof SVGElement) {
		// There is no `className` property on SVG elements.
		node.setAttribute('class', tailwindMerge(node.getAttribute('class'), className));
	} else {
		node.className = tailwindMerge(node.className, className);
	}
}
