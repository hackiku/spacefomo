<!-- src/routes/+page.svelte -->
<script lang="ts">
	import Hero from '$lib/layout/Hero.svelte';
	import Timeline from '$lib/features/fomo/week/Timeline.svelte';
	import GridLayout from '$lib/layout/GridLayout.svelte';
	import ViewportSize from '$lib/components/dev/ViewportSize.svelte';
	import { fomoStore } from '$lib/stores/fomoStore';

	let { data } = $props<{
		weeks: any[];
		currentWeek: any;
		debug: { error?: string; details?: string; success?: boolean; weekCount?: number };
	}>();

	$effect(() => {
		if (data.weeks?.length) {
			fomoStore.initializeWeeks(
				data.weeks.map((week) => ({
					...week,
					startDate: new Date(week.startDate),
					endDate: new Date(week.endDate),
					createdAt: new Date(week.createdAt)
				}))
			);
		}
	});
</script>

<ViewportSize />

<div
	class="absolute top-4 left-4 z-50 hidden w-64 rounded-lg bg-zinc-900/90 p-4 shadow-xl backdrop-blur"
>
	{#if data.debug.error}
		<p class="text-sm text-red-500">{data.debug.error}</p>
		{#if data.debug.details}
			<p class="mt-1 text-xs text-red-400">{data.debug.details}</p>
		{/if}
	{:else if data.currentWeek}
		<div class="space-y-2">
			<div class="flex items-center justify-between border-b border-zinc-700 pb-2">
				<h3 class="font-medium text-zinc-200">Week {data.currentWeek.weekNumber}</h3>
				<span class="text-sm text-zinc-400">{data.currentWeek.score}%</span>
			</div>
			<p class="text-xs text-zinc-500">
				Created: {new Date(data.currentWeek.createdAt).toLocaleDateString()}
			</p>
			<div class="mt-2 text-sm text-zinc-300">
				<p>{data.currentWeek.summary}</p>
			</div>
			<div class="mt-2 grid grid-cols-3 gap-2 text-xs">
				<div class="text-emerald-400">
					Launch: {data.currentWeek.stats.launchActivity}
				</div>
				<div class="text-blue-400">
					Buzz: {data.currentWeek.stats.industryBuzz}
				</div>
				<div class="text-purple-400">
					Tech: {data.currentWeek.stats.techImpact}
				</div>
			</div>
		</div>
	{:else}
		<p class="text-sm text-zinc-500">No current week data</p>
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
			class="pointer-events-none absolute top-0 left-0 -z-10 h-44 w-full bg-gradient-to-b from-black/40 to-transparent"
		></div>
		<GridLayout />
	</section>
	<Timeline />
</div>
