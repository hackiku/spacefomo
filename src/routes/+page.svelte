<!-- src/routes/+page.svelte -->

<script lang="ts">
  import type { PageData } from "./$types";
  import App from '$lib/App.svelte';

  export let data: PageData;
  $: console.log('Page data:', data.news?.length, 'items');
</script>

<App news={data.news} />