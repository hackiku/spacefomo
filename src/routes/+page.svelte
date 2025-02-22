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

<div class="mx-auto max-w-2xl px-4">
	{#if data.week}
		<div class="rounded-lg bg-zinc-800 p-6 shadow-lg">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-xl font-semibold text-white">
					Week {data.week.week_number}
				</h2>
				<span class="text-sm text-zinc-400">
					Created: {new Date(data.week.created_at).toLocaleDateString()}
				</span>
			</div>
			<div class="flex items-center gap-3">
				<span class="text-3xl">
					{data.week.score >= 80 ? '🚀' : '🛸'}
				</span>
				<span
					class="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-2xl font-bold text-transparent"
				>
					{data.week.score}
				</span>
			</div>
		</div>
	{:else}
		<div class="text-center text-zinc-400">No week data found</div>
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
