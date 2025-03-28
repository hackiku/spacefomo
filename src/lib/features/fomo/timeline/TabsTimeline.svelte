<!-- src/lib/features/fomo/timeline/TabsTimeline.svelte -->
<script lang="ts">
  import { fomoStore } from '$lib/stores/fomoStore';
  
  type Week = {
    id: number;
    weekNumber: number;
    score: number;
    startDate: Date;
    endDate: Date;
    summary: string;
    stats: {
      launchActivity: number;
      industryBuzz: number;
      techImpact: number;
    };
  };

  // Format date function
  function formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }

  // Get proper CSS classes for tabs
  function getTabClasses(isActive: boolean): string {
    return `group relative flex-shrink-0 flex items-center rounded-t-2xl border-t border-r border-l
            px-4 py-2.5 text-sm transition-all ${
              isActive
                ? 'border-zinc-700 bg-zinc-800 text-zinc-200'
                : 'border-zinc-800 bg-zinc-900/30 backdrop-blur-md text-zinc-500 hover:bg-zinc-800'
            }`;
  }

  // Get score CSS classes
  function getScoreClasses(isActive: boolean): string {
    return `font-semibold ${
      isActive
        ? 'bg-gradient-to-br from-violet-400 to-fuchsia-500 bg-clip-text text-transparent'
        : 'opacity-70 transition-opacity group-hover:opacity-100'
    }`;
  }
  
  // Store data as reactive values
  const weeks = $derived($fomoStore.weeks || []);
  const activeWeekNumber = $derived($fomoStore.activeWeek);
  
  // Select a week
  function selectWeek(weekNumber: number) {
    fomoStore.setActiveWeek(weekNumber);
  }
</script>

<div class="sticky right-0 -bottom-1 left-0 z-50">
  <div class="relative">
    <div class="mx-auto max-w-[1920px] px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-32">
      <div class="no-scrollbar flex overflow-x-auto gap-2 pb-0.5 scroll-smooth">
        {#each weeks as week (week.id)}
          {@const isActive = activeWeekNumber === week.weekNumber}
          <button
            type="button"
            class={getTabClasses(isActive)}
            onclick={() => selectWeek(week.weekNumber)}
          >
            <div class="flex items-center gap-3">
              <span class="text-xs whitespace-nowrap opacity-60">
                {formatDate(week.startDate)}
              </span>
              <div class="ml-auto flex items-center gap-2">
                <span class={getScoreClasses(isActive)}>
                  {week.score}
                </span>
              </div>
            </div>

            {#if isActive}
              <div class="absolute right-0 bottom-[2px] left-0 h-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500">
							</div>
            {/if}
          </button>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  /* Hide scrollbar but maintain functionality */
  .no-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;     /* Firefox */
  }
  
  .no-scrollbar::-webkit-scrollbar {
    display: none;             /* Chrome, Safari and Opera */
  }
</style>