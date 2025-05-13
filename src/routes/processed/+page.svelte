<!-- src/routes/events/+page.svelte -->
<script>
  import EventsGrid from './EventsGrid.svelte';
  import EventsControls from './EventsControls.svelte';
  
  let { data } = $props();
  const { events, isTestData, error } = data;
  
  let columns = $state(2);
  
  function handleColumnsChange(e) {
    columns = e.detail;
  }
</script>

<div class="max-w-6xl mx-auto px-4 py-8">
  {#if error}
    <div class="p-4 border border-red-800 bg-red-900/20 text-red-400 rounded mb-6">
      <p>Error: {error}</p>
    </div>
  {:else}
    <EventsControls {columns} on:columns={handleColumnsChange} />
    <EventsGrid {events} {isTestData} {columns} />
  {/if}
</div>