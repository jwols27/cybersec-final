<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<main>
	{@render children()}
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin: auto;
		width: 500px;
		background-color: #24273a;
		padding: 5em;
		flex: 1;
	}
</style>
