<script lang="ts">
	// The theme value can be used in svelte code as wanted
	import { theme } from './index';

	theme.subscribe(v => {
		let html = document.querySelector('html');
		if (html) {
			html.className = v;
		}
	});
</script>

<div>
	<slot />
</div>
