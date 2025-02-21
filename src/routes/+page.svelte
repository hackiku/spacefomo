<!-- src/routes/+page.svelte -->
<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
  import News from '$lib/features/news/News.svelte';
	import Timeline from '$lib/features/fomo/week/Timeline.svelte';
  import Controls from '$lib/features/news/controls/Controls.svelte';
  import GridLayout from '$lib/layout/GridLayout.svelte';

  let layout = $state({
    columns: 1,
    padding: 'normal',
    width: 'normal'
  });
</script>

<div class="min-h-screen">
  <Hero />
  
  <GridLayout {layout}>
    <Controls slot="controls" bind:layout />
    <News slot="news" />
  </GridLayout>
	
	<Timeline />
</div>