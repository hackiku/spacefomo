<!-- src/routes/+page.svelte -->
<script lang="ts">
	import Hero from '$lib/layout/Hero.svelte';
	import Timeline from '$lib/features/fomo/week/Timeline.svelte';
	import GridLayout from '$lib/layout/GridLayout.svelte';

	import ViewportSize from '$lib/components/dev/ViewportSize.svelte';

  interface WeekData {
    id: number;
    created_at: string;
    week_number: number;
    score: number;
  }

	let { data } = $props<{ week: WeekData | null }>();
</script>

<ViewportSize />


<div class="absolute top-4 left-4 z-50 w-64 rounded-lg bg-zinc-900/90 p-4 shadow-xl backdrop-blur">
  {#if data.week}
    <div class="space-y-2">
      <div class="flex items-center justify-between border-b border-zinc-700 pb-2">
        <h3 class="font-medium text-zinc-200">Week {data.week.week_number}</h3>
        <span class="text-sm text-zinc-400">{data.week.score}%</span>
      </div>
      <p class="text-xs text-zinc-500">
        Created: {new Date(data.week.created_at).toLocaleDateString()}
      </p>
    </div>
  {:else}
    <p class="text-sm text-zinc-500">Loading week data...</p>
  {/if}
</div>


<div class="flex min-h-screen flex-col">
	<section
		class="relative overflow-hidden border-white/10 bg-black/40 pt-24 pb-20 sm:pt-32 sm:pb-24"
	>
		<Hero />
	</section>
	<section class="relative">
		<div
			class="pointer-events-none absolute top-0 left-0 -z-10 h-44
						w-full bg-gradient-to-b from-black/40 to-transparent"
		></div>
		<GridLayout />
	</section>
	<Timeline />
</div>
