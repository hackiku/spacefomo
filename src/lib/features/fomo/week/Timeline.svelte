<!-- src/lib/features/fomo/week/Timeline.svelte -->
<script lang="ts">
  import { slide } from 'svelte/transition';
  import FomoCard from '../score/FomoCard.svelte';
  
  const weeks = [
    {
      weekNumber: 5,
      score: 85,
      startDate: new Date(2024, 1, 17), // Feb 17
      endDate: new Date(2024, 1, 23),
      summary: "SpaceX's Starship orbital test exceeds expectations. Private sector space competition intensifies as Rocket Lab announces new heavy-lift vehicle development."
    },
    {
      weekNumber: 4,
      score: 72,
      startDate: new Date(2024, 1, 10),
      endDate: new Date(2024, 1, 16),
      summary: "NASA confirms critical Artemis milestone ahead of schedule. Blue Origin's New Glenn preparations signal major launch capabilities expansion."
    },
    {
      weekNumber: 3,
      score: 68,
      startDate: new Date(2024, 1, 3),
      endDate: new Date(2024, 1, 9),
      summary: "ESA and JAXA announce joint Mars sample return mission. Virgin Galactic achieves new altitude record with next-gen spacecraft."
    },
    {
      weekNumber: 2,
      score: 78,
      startDate: new Date(2024, 0, 27),
      endDate: new Date(2024, 0, 2),
      summary: "Breakthrough in space solar power transmission demos practical energy beaming. China's space station expansion enters new phase."
    },
    {
      weekNumber: 1,
      score: 65,
      startDate: new Date(2024, 0, 20),
      endDate: new Date(2024, 0, 26),
      summary: "First commercial lunar lander touches down successfully. Space tourism bookings surge as new providers enter market."
    }
  ];

  let activeTab = $state<number | null>(6); // Start with week 6 open

  function toggleTab(weekNumber: number) {
    activeTab = activeTab === weekNumber ? null : weekNumber;
  }

  function formatDateRange(start: Date, end: Date): string {
    const formatDate = (d: Date) => d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
    return `${formatDate(start)} - ${formatDate(end)}`;
  }

  const getFomoEmoji = (score: number) => {
    if (score >= 80) return '🤯';
    if (score >= 60) return '🚀';
    if (score >= 40) return '👀';
    if (score >= 20) return '🤔';
    return '😴';
  };
</script>

<div class="fixed bottom-0 left-0 right-0 z-50">
  <!-- Active Tab Content -->
  {#if activeTab !== null}
    {@const activeWeek = weeks.find(w => w.weekNumber === activeTab)}
    {#if activeWeek}
      <div 
        transition:slide={{ duration: 200 }}
        class="absolute bottom-full w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-32"
      >
        <div class="relative {activeWeek ? `left-[${(activeWeek.weekNumber - 1) * 20}%]` : ''} w-1/5 bottom">
          <FomoCard
            weekNumber={activeWeek.weekNumber}
            dateRange={formatDateRange(activeWeek.startDate, activeWeek.endDate)}
            score={activeWeek.score}
            emoji={getFomoEmoji(activeWeek.score)}
            summary={activeWeek.summary}
          />
        </div>
      </div>
    {/if}
  {/if}

  <!-- Tab Bar -->
  <div class="">
    <div class="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-32">
      <div class="flex gap-5">
        {#each weeks as week}
          <button 
            class="group flex-1 flex items-center px-4 py-3 text-sm transition-all
                   {activeTab === week.weekNumber 
                     ? 'bg-zinc-800 text-zinc-200 border-t border-l border-r border-zinc-700 rounded-t-lg -mb-px' 
                     : 'bg-zinc-900/80 hover:bg-zinc-800/50'}
                   relative overflow-hidden"
            onclick={() => toggleTab(week.weekNumber)}
          >
            <div class="flex items-center gap-3 w-full">
              <span class="whitespace-nowrap">{week.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              <div class="flex items-center gap-2 ml-auto transition-opacity
                        {activeTab === week.weekNumber ? 'opacity-100' : 'opacity-60'}">
                <span>{getFomoEmoji(week.score)}</span>
                <span class="font-medium">{week.score}</span>
              </div>
            </div>
            
            {#if activeTab === week.weekNumber}
              <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500"></div>
            {/if}
          </button>
        {/each}
      </div>
    </div>
  </div>
</div>