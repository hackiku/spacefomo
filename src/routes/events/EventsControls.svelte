<!-- src/routes/events/EventsControls.svelte -->
<script>
  import { createEventDispatcher } from 'svelte';
  
  export let columns = 2;
  
  const dispatch = createEventDispatcher();
  
  function setColumns(num) {
    columns = num;
    dispatch('columns', num);
  }
</script>

<div class="mb-8 flex items-center justify-between">
  <div>
    <h1 class="text-2xl font-medium text-foreground">Space Events</h1>
    <p class="text-sm text-muted-foreground">Clustered space news by event</p>
  </div>
  
  <div class="flex gap-2">
    <!-- Column toggle buttons -->
    <button 
      class={`p-2 border transition-colors ${columns === 1 ? 'bg-muted border-primary text-foreground' : 'border-border text-muted-foreground hover:text-foreground'}`}
      on:click={() => setColumns(1)}
      aria-label="Single column"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="17" y1="10" x2="3" y2="10"></line>
        <line x1="21" y1="6" x2="3" y2="6"></line>
        <line x1="21" y1="14" x2="3" y2="14"></line>
        <line x1="17" y1="18" x2="3" y2="18"></line>
      </svg>
    </button>
    
    <button 
      class={`p-2 border transition-colors ${columns === 2 ? 'bg-muted border-primary text-foreground' : 'border-border text-muted-foreground hover:text-foreground'}`}
      on:click={() => setColumns(2)}
      aria-label="Two columns"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="12" y1="3" x2="12" y2="21"></line>
      </svg>
    </button>
  </div>
</div>