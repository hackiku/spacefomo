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
         border border-border bg-card/60 hover:bg-muted
         text-foreground transition-colors
         before:absolute before:inset-0
         before:border before:border-primary/10
         before:translate-x-0.5 before:translate-y-0.5
         before:transition-transform before:duration-300
         hover:before:translate-x-0 hover:before:translate-y-0"
  onclick={onClick}
  aria-label="Open date range selector"
>
  <span class="text-sm font-medium mr-2">{getDateRangeText()}</span>
  <div class="flex items-center justify-center bg-primary/10 p-1 text-primary">
    <CalendarBlank class="h-4 w-4" />
  </div>
</button>