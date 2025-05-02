<!-- src/lib/features/fomo/timeline/BarTimeline.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  
  // Generate more days of random FOMO scores (5-100) for extended scrolling
  const generateDayData = () => {
    return Array.from({ length: 180 }, () => 
      Math.floor(Math.random() * 95) + 5
    );
  };
  
  let days = $state(generateDayData());
  let isScrolling = $state(false);
  let container: HTMLElement;
  
  // Color function based on FOMO score
  const getBarColor = (score: number) => {
    if (score >= 80) return 'bg-gradient-to-t from-violet-600 to-fuchsia-500';
    if (score >= 60) return 'bg-gradient-to-t from-violet-600/80 to-violet-400';
    if (score >= 40) return 'bg-gradient-to-t from-blue-600/70 to-blue-400';
    if (score >= 20) return 'bg-gradient-to-t from-emerald-600/70 to-emerald-400';
    return 'bg-gradient-to-t from-zinc-600/50 to-zinc-400';
  };
  
  onMount(() => {
    // Scroll handling
    const handleScroll = () => {
      isScrolling = true;
      clearTimeout(scrollTimeout);
      
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 150);
    };
    
    let scrollTimeout: ReturnType<typeof setTimeout>;
    container.addEventListener('scroll', handleScroll);
    
    // Scroll to middle to allow scrolling both ways
    if (container) {
      setTimeout(() => {
        const scrollWidth = container.scrollWidth;
        container.scrollLeft = scrollWidth / 4;
      }, 100);
    }
    
    return () => {
      clearTimeout(scrollTimeout);
      container?.removeEventListener('scroll', handleScroll);
    };
  });
  
  // Week grouping (7 days per week)
  const weeks = $derived(
    Array.from({ length: Math.ceil(days.length / 7) }, (_, i) => 
      days.slice(i * 7, i * 7 + 7)
    )
  );
</script>

<div 
  class="h-full flex-1 overflow-x-auto no-scrollbar relative" 
  bind:this={container}
>
  <div class="flex px-4 py-1 min-w-max h-full">
    {#each weeks as week, weekIndex}
      <!-- Weekly group -->
      <div class="flex h-full gap-1 items-end">
        {#each week as score, dayIndex}
          {@const dayNumber = weekIndex * 7 + dayIndex + 1}
          {@const heightPercent = Math.max(15, score)}
          
          <!-- Day bar emerging from bottom -->
          <div 
            class="group relative h-full flex items-end"
            title="Day {dayNumber}: FOMO {score}"
          >
            <div 
              class="w-2 rounded-t-sm {getBarColor(score)} transition-height duration-300"
              style="height: {heightPercent}%;"
            ></div>
            
            <!-- Hover tooltip -->
            <div class="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              <div class="bg-zinc-800/90 text-zinc-300 text-xs rounded px-2 py-1 whitespace-nowrap">
                FOMO: {score}
              </div>
            </div>
          </div>
        {/each}
        
        <!-- Week separator -->
        {#if weekIndex < weeks.length - 1}
          <div class="w-px h-full bg-zinc-700/30 mx-1.5"></div>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  /* Hide scrollbar but maintain functionality */
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  
  /* Add transition for height changes */
  .transition-height {
    transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
</style>