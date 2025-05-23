<!-- src/lib/features/fomo/timeline/BarTimeline.svelte -->
<script lang="ts">
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
  let isScrolling = $state(false);
  
  // Format date as "Mar 2"
  function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }
  
  // Format date as just the day of month
  function formatDayOnly(date: Date): string {
    return date.getDate().toString();
  }
  
  // Format date as "Monday"
  function formatWeekday(date: Date): string {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
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
  const barWidth = 2; // Slightly wider bars for better visibility
  const barGap = 1;
  const weekGap = 8; // Gap between weeks
  const barsPerWeek = 7;
  const weekWidth = (barWidth + barGap) * barsPerWeek + weekGap;
  const totalWidth = Math.ceil(days.length / 7) * weekWidth;
  
  // The week markers positions (every 7 days)
  const weekMarkers = $derived(
    days.filter((_, i) => i % 7 === 0).map((day, weekIndex) => {
      const x = weekIndex * weekWidth + (barsPerWeek * (barWidth + barGap)) / 2;
      return {
        x,
        date: day.date,
        weekIndex
      };
    })
  );
  
  // Get x position for a specific day
  function getDayX(dayIndex: number): number {
    const weekIndex = Math.floor(dayIndex / 7);
    const dayInWeek = dayIndex % 7;
    return weekIndex * weekWidth + dayInWeek * (barWidth + barGap);
  }
  
  // Initialize scroll position
  $effect(() => {
    if (container) {
      // Start at a position that shows recent data but allows scrolling both ways
      setTimeout(() => {
        container.scrollLeft = totalWidth - (container.clientWidth * 1.2);
      }, 100);
    }
  });
</script>

<div 
  class="h-full w-full flex-1 overflow-x-auto no-scrollbar relative transition-opacity duration-300 hover:opacity-100"
  style="opacity: 0.5;"
  onscroll={handleScroll}
  bind:this={container}
>
  <!-- Mask elements for fade effects - these stay fixed relative to the container -->
  <div class="absolute left-0 top-0 bottom-0 w-16 z-20 pointer-events-none"
       style="background: linear-gradient(to right, var(--background), rgba(13, 11, 20, 0));">
  </div>
  <div class="absolute right-0 top-0 bottom-0 w-16 z-20 pointer-events-none"
       style="background: linear-gradient(to left, var(--background), rgba(13, 11, 20, 0));">
  </div>
  
  <!-- SVG Container -->
  <svg 
    width={totalWidth} 
    height="100%" 
    class="min-w-max h-full"
    preserveAspectRatio="none"
  >
    <!-- Define gradients for the bars -->
    <defs>
      <!-- Regular gradients with transparency -->
      <linearGradient id="gradient-high" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="var(--venus-yellow)" stop-opacity="0.6" />
        <stop offset="100%" stop-color="var(--venus-orange)" stop-opacity="0.6" />
      </linearGradient>
      
      <linearGradient id="gradient-medium-high" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="var(--venus-yellow)" stop-opacity="0.6" />
        <stop offset="100%" stop-color="var(--venus-orange)" stop-opacity="0.6" />
      </linearGradient>
      
      <linearGradient id="gradient-medium" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="var(--venus-orange)" stop-opacity="0.6" />
        <stop offset="100%" stop-color="var(--venus-rust)" stop-opacity="0.6" />
      </linearGradient>
      
      <linearGradient id="gradient-low" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="var(--venus-rust)" stop-opacity="0.6" />
        <stop offset="100%" stop-color="var(--venus-rust)" stop-opacity="0.6" />
      </linearGradient>
      
      <linearGradient id="gradient-verylow" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="var(--muted-foreground)" stop-opacity="0.6" />
        <stop offset="100%" stop-color="var(--muted)" stop-opacity="0.6" />
      </linearGradient>
      
      <!-- Selected gradients (full opacity) -->
      <linearGradient id="gradient-high-selected" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="var(--venus-yellow)" stop-opacity="1" />
        <stop offset="100%" stop-color="var(--venus-orange)" stop-opacity="1" />
      </linearGradient>
      
      <linearGradient id="gradient-medium-high-selected" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="var(--venus-yellow)" stop-opacity="1" />
        <stop offset="100%" stop-color="var(--venus-orange)" stop-opacity="1" />
      </linearGradient>
      
      <linearGradient id="gradient-medium-selected" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="var(--venus-orange)" stop-opacity="1" />
        <stop offset="100%" stop-color="var(--venus-rust)" stop-opacity="1" />
      </linearGradient>
      
      <linearGradient id="gradient-low-selected" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="var(--venus-rust)" stop-opacity="1" />
        <stop offset="100%" stop-color="var(--venus-rust)" stop-opacity="1" />
      </linearGradient>
      
      <linearGradient id="gradient-verylow-selected" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="var(--muted-foreground)" stop-opacity="1" />
        <stop offset="100%" stop-color="var(--muted)" stop-opacity="1" />
      </linearGradient>
    </defs>
    
    <!-- Week separators and labels -->
    <g>
      {#each weekMarkers as marker, i}
        {#if i > 0} <!-- Skip the first marker -->
          <!-- Week separator -->
          <rect
            x={marker.x - weekGap/2}
            y="0"
            width="1"
            height="100%"
            fill="var(--border)"
          />
          
          <!-- Date label with background -->
          <g>
            <rect 
              x={marker.x - 18} 
              y="75%" 
              width="36" 
              height="16" 
              class="rounded-default" 
              fill="var(--muted)" 
            />
            
            <text 
              x={marker.x} 
              y="82%" 
              fill="var(--muted-foreground)" 
              font-size="10" 
              text-anchor="middle" 
              dominant-baseline="middle"
            >
              {formatDate(marker.date)}
            </text>
          </g>
        {/if}
      {/each}
    </g>
    
    <!-- Bars group -->
    <g>
      {#each days as day, i}
        {@const isSelected = selectedDayIndex === i}
        {@const barHeight = Math.max(8, day.score)}
        {@const barX = getDayX(i)}
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
            rx="0"
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
            <!-- Day of week indicator (only for first day of week) -->
            {#if i % 7 === 0}
              <text
                x={barX + barWidth/2}
                y="95%"
                fill="var(--muted-foreground)"
                font-size="7"
                text-anchor="middle"
              >
                M
              </text>
            {/if}
            
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
                height="35"
                class="rounded-default"
                fill="var(--card)"
                stroke="var(--border)"
                stroke-width="1"
              />
              
              <text 
                x="30" 
                y="12" 
                fill="var(--foreground)" 
                font-size="8" 
                text-anchor="middle" 
                dominant-baseline="middle"
              >
                {formatWeekday(day.date)} {formatDayOnly(day.date)}
              </text>
              
              <text 
                x="30" 
                y="24" 
                fill="var(--foreground)" 
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