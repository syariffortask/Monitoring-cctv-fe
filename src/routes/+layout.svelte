<script>
	import '../app.css';
	import cpi from '$lib/assets/cpi.ico';
	
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={cpi} />
</svelte:head>

{@render children?.()}
