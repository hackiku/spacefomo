<!-- src/lib/features/fomo/calendar/CalendarButton.svelte -->
<script lang="ts">
  import { CalendarBlank } from 'phosphor-svelte';
  
  // Props
  let { 
    startDate = null, 
    endDate = null, 
    onClick 
  } = $props<{
    startDate?: Date | null;
    endDate?: Date | null;
    onClick: () => void;
  }>();
  
  // Format date range for display
  function getDateRangeText() {
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
        border-l border-primary/20 __bg-card/60 hover:bg-muted text-foreground transition-colors"
  onclick={onClick}
  aria-label="Open date range selector"
>
  <span class="text-sm font-medium mr-2">{getDateRangeText()}</span>
  <div class="flex items-center justify-center __bg-primary/10 text-primary">
    <CalendarBlank class="h-5 w-5" />
  </div>
</button>