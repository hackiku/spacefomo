<!-- src/routes/+page.svelte -->
<script lang="ts">
	import Hero from '$lib/layout/Hero.svelte';
	import Timeline from '$lib/features/fomo/week/Timeline.svelte';
	import GridLayout from '$lib/layout/GridLayout.svelte';

	import ViewportSize from '$lib/components/dev/ViewportSize.svelte';
</script>

<ViewportSize />

<div class="flex min-h-screen flex-col">
	<section class="relative overflow-hidden border-white/10 bg-black/40 pt-24 pb-20 sm:pt-32 sm:pb-24">
		<Hero />
	</section>
	<section class="relative">
		<div
			class="-z-10 pointer-events-none absolute top-0 left-0 w-full
			h-44 bg-gradient-to-b from-black/40 to-transparent"
		></div>
		<GridLayout />
	</section>
	<Timeline />
</div>
