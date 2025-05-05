<!-- src/lib/features/fomo/timeline/BarTimeline.svelte -->
<script lang="ts">
  // Import SVG-specific helpers
  import { onMount } from 'svelte';
  
  // Generate fake data for 365 days (full year)
  const generateDays = () => {
    return Array.from({ length: 365 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (365 - i));
      
      return {
        date,
        score: Math.floor(Math.random() * 95) + 5, // 5-100
        weekNumber: Math.floor(i / 7),
        dayIndex: i % 7
      };
    });
  };
  
  // Initial data setup
  let days = $state(generateDays());
  let selectedDayIndex = $state(-1);
  let container: HTMLElement;
  let svgContainer: SVGElement;
  let isScrolling = $state(false);
  
  // Format date as "Mar 2"
  function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }
  
  // Get the SVG for the bar rect element
  function getBarColor(score: number, isSelected: boolean = false): string {
    if (isSelected) {
      if (score >= 80) return 'url(#gradient-high-selected)';
      if (score >= 60) return 'url(#gradient-medium-high-selected)';
      if (score >= 40) return 'url(#gradient-medium-selected)';
      if (score >= 20) return 'url(#gradient-low-selected)';
      return 'url(#gradient-verylow-selected)';
    } else {
      if (score >= 80) return 'url(#gradient-high)';
      if (score >= 60) return 'url(#gradient-medium-high)';
      if (score >= 40) return 'url(#gradient-medium)';
      if (score >= 20) return 'url(#gradient-low)';
      return 'url(#gradient-verylow)';
    }
  }
  
  // Handle scroll event
  function handleScroll() {
    isScrolling = true;
    
    // Reset the scrolling state after a timeout
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
    }, 150);
  }
  
  let scrollTimeout: ReturnType<typeof setTimeout>;
  
  // Handle day selection
  function selectDay(dayIndex: number) {
    selectedDayIndex = dayIndex;
    
    // You could dispatch an event here to notify parent components
    // about the selection
    console.log('Selected day:', dayIndex, 'with score:', days[dayIndex].score);
  }
  
  // SVG measurements
  const barWidth = 1;
  const barGap = 0.5;
  const barUnit = barWidth + barGap;
  const totalWidth = days.length * barUnit;
  
  // The week markers positions (every 7 days)
  const weekMarkers = $derived(
    days.filter((_, i) => i % 7 === 0).map((day, i) => ({
      x: i * 7 * barUnit + (3.5 * barUnit),
      date: day.date
    }))
  );
  
  // Initialize scroll position
  onMount(() => {
    if (container) {
      // Start at a position that shows recent data but allows scrolling both ways
      setTimeout(() => {
        container.scrollLeft = totalWidth - (container.clientWidth * 1.2);
      }, 100);
    }
  });
</script>

<div 
  class="h-full flex-1 overflow-x-auto no-scrollbar relative transition-opacity duration-300 hover:opacity-100"
  style="opacity: 0.5;"
  onscroll={handleScroll}
  bind:this={container}
>
  <!-- Mask elements for fade effects - these stay fixed relative to the container -->
  <div class="absolute left-0 top-0 bottom-0 w-16 z-20 pointer-events-none"
       style="background: linear-gradient(to right, rgba(0,0,0,1), rgba(0,0,0,0));">
  </div>
  <div class="absolute right-0 top-0 bottom-0 w-16 z-20 pointer-events-none"
       style="background: linear-gradient(to left, rgba(0,0,0,1), rgba(0,0,0,0));">
  </div>
  
  <!-- SVG Container -->
  <svg 
    width={totalWidth} 
    height="100%" 
    class="min-w-max"
    bind:this={svgContainer}
  >
    <!-- Define gradients for the bars -->
    <defs>
      <!-- Regular gradients with transparency -->
      <linearGradient id="gradient-high" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="rgb(217, 70, 239)" stop-opacity="0.6" />
        <stop offset="100%" stop-color="rgb(124, 58, 237)" stop-opacity="0.6" />
      </linearGradient>
      
      <linearGradient id="gradient-medium-high" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="rgb(167, 139, 250)" stop-opacity="0.6" />
        <stop offset="100%" stop-color="rgb(124, 58, 237)" stop-opacity="0.6" />
      </linearGradient>
      
      <linearGradient id="gradient-medium" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="rgb(96, 165, 250)" stop-opacity="0.6" />
        <stop offset="100%" stop-color="rgb(37, 99, 235)" stop-opacity="0.6" />
      </linearGradient>
      
      <linearGradient id="gradient-low" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="rgb(52, 211, 153)" stop-opacity="0.6" />
        <stop offset="100%" stop-color="rgb(5, 150, 105)" stop-opacity="0.6" />
      </linearGradient>
      
      <linearGradient id="gradient-verylow" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="rgb(161, 161, 170)" stop-opacity="0.6" />
        <stop offset="100%" stop-color="rgb(82, 82, 91)" stop-opacity="0.6" />
      </linearGradient>
      
      <!-- Selected gradients (full opacity) -->
      <linearGradient id="gradient-high-selected" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="rgb(217, 70, 239)" stop-opacity="1" />
        <stop offset="100%" stop-color="rgb(124, 58, 237)" stop-opacity="1" />
      </linearGradient>
      
      <linearGradient id="gradient-medium-high-selected" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="rgb(167, 139, 250)" stop-opacity="1" />
        <stop offset="100%" stop-color="rgb(124, 58, 237)" stop-opacity="1" />
      </linearGradient>
      
      <linearGradient id="gradient-medium-selected" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="rgb(96, 165, 250)" stop-opacity="1" />
        <stop offset="100%" stop-color="rgb(37, 99, 235)" stop-opacity="1" />
      </linearGradient>
      
      <linearGradient id="gradient-low-selected" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="rgb(52, 211, 153)" stop-opacity="1" />
        <stop offset="100%" stop-color="rgb(5, 150, 105)" stop-opacity="1" />
      </linearGradient>
      
      <linearGradient id="gradient-verylow-selected" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="rgb(161, 161, 170)" stop-opacity="1" />
        <stop offset="100%" stop-color="rgb(82, 82, 91)" stop-opacity="1" />
      </linearGradient>
    </defs>
    
    <!-- Background group with 10% height grid lines -->
    <g>
      {#each [0.2, 0.4, 0.6, 0.8] as line}
        <line 
          x1="0" 
          y1={`${100 - (line * 100)}%`} 
          x2={totalWidth} 
          y2={`${100 - (line * 100)}%`} 
          stroke="rgba(255,255,255,0.05)" 
          stroke-width="1"
        />
      {/each}
    </g>
    
    <!-- Week separators -->
    <g>
      {#each weekMarkers as marker, i}
        {#if i > 0} <!-- Skip the first marker -->
          <!-- Vertical line -->
          <line 
            x1={marker.x} 
            y1="0" 
            x2={marker.x} 
            y2="100%" 
            stroke="rgba(255,255,255,0.1)" 
            stroke-width="1"
          />
          
          <!-- Date label -->
          <text 
            x={marker.x + 2} 
            y="85%" 
            fill="rgba(161, 161, 170, 0.6)" 
            font-size="10" 
            text-anchor="start"
          >
            {formatDate(marker.date)}
          </text>
        {/if}
      {/each}
    </g>
    
    <!-- Bars group -->
    <g>
      {#each days as day, i}
        {@const isSelected = selectedDayIndex === i}
        {@const barHeight = Math.max(8, day.score)}
        {@const barX = i * barUnit}
        {@const barY = 100 - barHeight}
        
        <!-- The bar with hover group -->
        <g 
          class="cursor-pointer"
          onclick={() => selectDay(i)}
        >
          <!-- The actual bar -->
          <rect 
            x={barX} 
            y={`${barY}%`} 
            width={barWidth} 
            height={`${barHeight}%`} 
            rx="0.5"
            fill={getBarColor(day.score, isSelected)}
            class="transition-all duration-200"
          />
          
          <!-- Invisible hover target (wider for easier clicking) -->
          <rect 
            x={barX - 2} 
            y="0" 
            width="5" 
            height="100%" 
            fill="transparent" 
            class="group"
          >
            <!-- Tooltip -->
            <title>{formatDate(day.date)}: FOMO {day.score}</title>
            
            <!-- Tooltip (SVG based) -->
            <g 
              class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
              transform={`translate(${barX - 30}, ${barY - 30})`}
            >
              <rect
                x="0"
                y="0"
                width="60"
                height="28"
                rx="4"
                fill="rgba(39, 39, 42, 0.95)"
                stroke="rgba(63, 63, 70, 1)"
                stroke-width="1"
              />
              
              <text 
                x="30" 
                y="12" 
                fill="rgba(228, 228, 231, 0.95)" 
                font-size="8" 
                text-anchor="middle" 
                dominant-baseline="middle"
              >
                {formatDate(day.date)}
              </text>
              
              <text 
                x="30" 
                y="22" 
                fill="rgba(228, 228, 231, 0.95)" 
                font-size="8" 
                text-anchor="middle" 
                dominant-baseline="middle"
                font-weight="bold"
              >
                FOMO: {day.score}
              </text>
            </g>
          </rect>
        </g>
      {/each}
    </g>
  </svg>
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
</style>