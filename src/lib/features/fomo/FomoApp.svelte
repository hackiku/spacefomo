<!-- src/lib/features/fomo/FomoApp.svelte -->
<script lang="ts">
  import BarTimeline from "./timeline/BarTimeline.svelte";
  import { Calendar, Share } from 'phosphor-svelte';
  import { Button } from 'bits-ui';
  import ShareModal from '$lib/components/cta/share/ShareModal.svelte';
  
  // State for modals
  let showShareModal = $state(false);
  let showCalendarModal = $state(false);
  
  // Handle button clicks
  function handleShareClick() {
    showShareModal = true;
  }
  
  function handleCalendarClick() {
    showCalendarModal = true;
    console.log('Calendar button clicked');
  }
</script>

<div class="h-full w-full">
  <div class="h-full max-w-screen-2xl mx-auto flex items-center relative">
    <!-- Fixed-width button container for Calendar -->
    <div class="w-14 h-14 flex-shrink-0 flex items-center justify-center z-30">
      <Button.Root
        onclick={handleCalendarClick}
        class="inline-flex items-center justify-center rounded-full 
               w-10 h-10
               bg-zinc-800 hover:bg-zinc-700 text-zinc-200
               transition-all hover:text-white active:scale-95"
        aria-label="Date filter"
      >
        <Calendar weight="bold" class="w-5 h-5" />
      </Button.Root>
    </div>
    
    <!-- Timeline in the middle (flex-grow) -->
    <div class="flex-grow h-full">
      <BarTimeline />
    </div>
    
    <!-- Fixed-width button container for Share -->
    <div class="w-14 h-14 flex-shrink-0 flex items-center justify-center z-30">
      <Button.Root
        onclick={handleShareClick}
        class="inline-flex items-center justify-center rounded-full 
               w-10 h-10
               bg-zinc-800 hover:bg-zinc-700 text-zinc-200
               transition-all hover:text-white active:scale-95"
        aria-label="Share News"
      >
        <Share weight="bold" class="w-5 h-5" />
      </Button.Root>
    </div>
  </div>
</div>

<!-- Share modal -->
{#if showShareModal}
  <ShareModal onClose={() => (showShareModal = false)} />
{/if}

<!-- Calendar modal (placeholder) -->
{#if showCalendarModal}
  <div class="fixed inset-0 z-50 flex items-center justify-center ">
    <div class="bg-zinc-800 rounded-lg border border-zinc-700 p-4 max-w-xs w-full">
      <div class="flex justify-between items-center mb-3">
        <h3 class="text-sm font-medium text-zinc-200">Select Date Range</h3>
        <button 
          onclick={() => showCalendarModal = false}
          class="text-zinc-400 hover:text-zinc-200 p-1"
        >
          ×
        </button>
      </div>
      
      <div class="space-y-3">
        <div>
          <label class="block text-xs text-zinc-400 mb-1">Start Date</label>
          <input 
            type="date" 
            class="w-full bg-zinc-700 border border-zinc-600 rounded p-2 text-sm text-zinc-200"
          />
        </div>
        
        <div>
          <label class="block text-xs text-zinc-400 mb-1">End Date</label>
          <input 
            type="date" 
            class="w-full bg-zinc-700 border border-zinc-600 rounded p-2 text-sm text-zinc-200"
          />
        </div>
        
        <Button.Root
          onclick={() => showCalendarModal = false}
          class="w-full py-2 px-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 
                 text-white rounded text-sm font-medium
                 transition-all hover:from-violet-600 hover:to-fuchsia-600"
        >
          Apply
        </Button.Root>
      </div>
    </div>
  </div>
{/if}