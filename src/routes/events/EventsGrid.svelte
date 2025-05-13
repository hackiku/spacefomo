<!-- src/routes/events/EventsGrid.svelte -->
<script>
  import EventCard from './EventCard.svelte';
  
  export let events = [];
  export let isTestData = false;
  export let columns = 2;
</script>

{#if events.length === 0}
  <div class="p-8 text-center border border-border bg-card/50 backdrop-blur-sm">
    <p class="text-muted-foreground">No events available</p>
  </div>
{:else}
  <div class={`grid gap-6 ${columns === 1 ? '' : 'grid-cols-1 md:grid-cols-2'}`}>
    {#each events as event (event.id)}
      <EventCard {event} {isTestData} />
    {/each}
  </div>
{/if}