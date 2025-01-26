<!-- routes/+page.svelte -->

<script lang="ts">
	import type { PageData } from "./$types"
  import App from '$lib/App.svelte';

	export let data: PageData;
</script>

<App news={data.news}/>