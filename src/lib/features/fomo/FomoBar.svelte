<!-- $lib/features/fomo/FomoBar.svelte -->

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import FomoMeter from './FomoMeter.svelte';

  export let currentScore: number;
  export let remainingTime: number;
  export let dates: string[] = [];

  const dispatch = createEventDispatcher();

  function selectDate(date: string) {
    dispatch('dateSelected', date);
  }
</script>

<div class="w-full p-4 relative">
  <div class="flex justify-between mb-4">
    {#each dates as date}
      <button
        class="text-gray-400 hover:text-white bg-gray-700 opacity-30 rounded-full px-3 py-1 text-sm"
        on:click={() => selectDate(date)}
      >
        {date}
      </button>
    {/each}
  </div>
  <div class="absolute left-1/2 transform -translate-x-1/2 -bottom-16">
    <FomoMeter {currentScore} {remainingTime} />
  </div>
</div>