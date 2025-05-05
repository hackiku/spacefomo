<!-- src/lib/features/fomo/FomoApp.svelte -->
<script lang="ts">
  import BarTimeline from "./timeline/BarTimeline.svelte";
  import FomoMenu from "./controls/FomoMenu.svelte";
  import { Share } from 'phosphor-svelte';
  import { Button } from 'bits-ui';
  import ShareModal from '$lib/components/cta/share/ShareModal.svelte';
  import { type DateValue } from "@internationalized/date";
  
  // State for share modal
  let showShareModal = $state(false);
  let showFomoScores = $state(true);
  
  // Handle share button click
  function handleShareClick() {
    showShareModal = true;
  }
  
  // Handle date range changes
  function handleDateRangeChange(event: CustomEvent<{ startDate: DateValue | null, endDate: DateValue | null }>) {
    console.log('Date range changed:', event.detail);
    // Implement date filtering logic here
  }
  
  // Handle FOMO visibility toggle
  function handleToggleFomo(event: CustomEvent<{ visible: boolean }>) {
    showFomoScores = event.detail.visible;
    console.log('FOMO visibility changed:', showFomoScores);
  }
</script>

<div class="h-full w-full">
  <div class="h-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-32">
    <div class="h-full flex items-center">
      <!-- Fomo menu on the left -->
      <div class="z-40 flex-shrink-0 mr-1">
        <FomoMenu 
          on:dateRangeChange={handleDateRangeChange}
          on:toggleFomo={handleToggleFomo}
        />
      </div>
      
      <!-- Timeline in the middle (flex-grow) with fixed width wrapper -->
      <div class="flex-1 h-full flex-shrink mx-4 overflow-hidden">
        <div class="w-full h-full">
          <BarTimeline />
        </div>
      </div>
      
      <!-- Share button on the right -->
      <div class="z-40 flex-shrink-0 ml-1">
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
</div>

<!-- Share modal -->
{#if showShareModal}
  <ShareModal onClose={() => (showShareModal = false)} />
{/if}