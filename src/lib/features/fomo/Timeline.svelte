<!-- src/lib/features/fomo/Timeline.svelte -->
<script lang="ts">
	import { fomoStore } from '$lib/stores/fomoStore';

	// Emoji helper based on score
	const getFomoEmoji = (score: number): string => {
		if (score >= 80) return '🤯';
		if (score >= 60) return '🚀';
		if (score >= 40) return '👀';
		if (score >= 20) return '🤔';
		return '😴';
	};

	const formatDate = (date: Date): string => {
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric'
		});
	};

	// Local state to track animations
	let selectedTab = $state<number | null>(null);

	$effect(() => {
		selectedTab = $fomoStore.activeWeek;
	});
</script>

<div class="fixed right-0 bottom-0 left-0 z-50">
	<div class="relative">
		<div class="mx-auto max-w-[1920px] px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-32">
			<div class="flex gap-2 pb-0.5">
				{#each $fomoStore.weeks as week (week.id)}
					{@const isActive = selectedTab === week.weekNumber}
					<button
						class="group relative flex flex-1 items-center rounded-t-lg border-t border-r border-l
                   px-4 py-2.5 text-sm transition-all
                   {isActive
							? 'border-zinc-700 bg-zinc-800 text-zinc-200'
							: 'border-zinc-800/50 bg-zinc-900 text-zinc-400 hover:bg-zinc-800/80'}"
						onclick={() => {
							fomoStore.setActiveWeek(week.weekNumber);
						}}
					>
						<div class="flex w-full items-center gap-3">
							<span class="text-xs whitespace-nowrap opacity-60">
								{formatDate(new Date(week.startDate))}
							</span>
							<div class="ml-auto flex items-center gap-2">
								<span class="opacity-60 transition-opacity group-hover:opacity-100">
									{getFomoEmoji(week.score)}
								</span>
								<span
									class="font-medium
                           {isActive
										? 'bg-gradient-to-br from-violet-400 to-fuchsia-500 bg-clip-text text-transparent'
										: 'opacity-60 transition-opacity group-hover:opacity-100'}"
								>
									{week.score}
								</span>
							</div>
						</div>

						{#if isActive}
							<div
								class="absolute right-0 bottom-0 left-0 h-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500"
							/>
						{/if}
					</button>
				{/each}
			</div>
		</div>
	</div>
</div>
