<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import Hero from '$lib/layout/Hero.svelte';
  import Timeline from '$lib/features/fomo/week/Timeline.svelte';
  import GridLayout from '$lib/layout/GridLayout.svelte';
  import ViewportSize from '$lib/components/dev/ViewportSize.svelte';
  import { weeksStore } from '$lib/db/sync';

  onMount(() => {
    const unsubscribe = weeksStore.init();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  });
</script>

<ViewportSize />

<div class="absolute top-4 left-4 z-50 w-64 rounded-lg bg-zinc-900/90 p-4 shadow-xl backdrop-blur">
  {#if $weeksStore.loading}
    <p class="text-sm text-zinc-500">Loading week data...</p>
  {:else if $weeksStore.error}
    <p class="text-sm text-red-500">{$weeksStore.error}</p>
  {:else}
    {#if $weeksStore.weeks.length > 0}
      {@const currentWeek = $weeksStore.weeks.find(w => w.week_number === $weeksStore.activeWeek)}
      {#if currentWeek}
        <div class="space-y-2">
          <div class="flex items-center justify-between border-b border-zinc-700 pb-2">
            <h3 class="font-medium text-zinc-200">Week {currentWeek.week_number}</h3>
            <span class="text-sm text-zinc-400">{currentWeek.score}%</span>
          </div>
          <p class="text-xs text-zinc-500">
            Created: {new Date(currentWeek.created_at).toLocaleDateString()}
          </p>
        </div>
      {/if}
    {:else}
      <p class="text-sm text-zinc-500">No weeks found</p>
    {/if}
  {/if}
</div>

<div class="flex min-h-screen flex-col">
  <section class="relative overflow-hidden border-white/10 bg-black/40 pt-24 pb-20 sm:pt-32 sm:pb-24">
    <Hero />
  </section>
  <section class="relative">
    <div class="pointer-events-none absolute top-0 left-0 -z-10 h-44 w-full bg-gradient-to-b from-black/40 to-transparent"></div>
    <GridLayout />
  </section>
  <Timeline />
</div>