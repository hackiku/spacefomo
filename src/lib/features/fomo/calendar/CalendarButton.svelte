<!-- src/lib/features/fomo/calendar/CalendarButton.svelte -->
<script lang="ts">
  import { CalendarBlank } from 'phosphor-svelte';
  import { getFomoContext } from '$lib/context/fomoContext.svelte';
  
  // Props for component-specific behavior
  let { onClick } = $props<{
    onClick: () => void;
  }>();
  
  // Get context instead of using props
  const fomoContext = getFomoContext();
  
  // Format date range for display
  function getDateRangeText() {
    // Get dates from context each time function is called
    const startDate = fomoContext.startDate;
    const endDate = fomoContext.endDate;
    
    if (!startDate || !endDate) return "All Time";
    
    // Check if start and end dates are the same day
    const isSameDay = startDate.toDateString() === endDate.toDateString();
    
    if (isSameDay) {
      return formatDate(startDate, true); // Format with year for single date
    }
    
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  }
  
  // Format date as "MMM D" or "MMM D, YYYY" if includeYear is true
  function formatDate(date: Date | null, includeYear = false): string {
    if (!date) return "";
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: includeYear ? 'numeric' : undefined
    });
  }
</script>

<button
  type="button"
  class="group relative flex items-center justify-between w-full px-3 py-2 
        border-l border-primary/20 hover:bg-muted text-foreground transition-colors"
  onclick={onClick}
  aria-label="Open date range selector"
>
  <span class="text-sm font-medium mr-2">{getDateRangeText()}</span>
  <div class="flex items-center justify-center text-primary">
    <CalendarBlank class="h-5 w-5" />
  </div>
</button>