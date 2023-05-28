<script>
	export let message = 'Hello, world!';
</script>

<div
	style="
        background-color: #404040;
        display: flex;
        color: #AFDBBA;
        height: 100%;
        width: 100%;
        justify-content: center;
        align-items: stretch;
        font-size: 64px;
    "
>
	<div
		style="
            border: 8px dashed #AFDBBA;
            width: 100%;
            margin: 2rem;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
        "
	>
		{message}
	</div>
</div>

<style lang="postcss">
	div {
		border: 2px solid black;
		@apply flex items-center justify-center opacity-100;
	}
</style>
