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
    
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  }
  
  // Format date as "MMM D"
  function formatDate(date: Date | null): string {
    if (!date) return "";
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
</script>

<button
  type="button"
  class="flex items-center justify-between w-full px-3 py-2 
         border border-border bg-card/80 hover:bg-muted
         text-foreground transition-colors"
  onclick={onClick}
  aria-label="Open date range selector"
>
  <span class="text-sm mr-2">{getDateRangeText()}</span>
  <CalendarBlank class="h-4 w-4 text-muted-foreground" />
</button>