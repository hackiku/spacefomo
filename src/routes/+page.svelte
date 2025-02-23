<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Hero from '$lib/layout/Hero.svelte';
  import Timeline from '$lib/features/fomo/Timeline.svelte';
  import GridLayout from '$lib/layout/GridLayout.svelte';
  import ViewportSize from '$lib/components/dev/ViewportSize.svelte';
  import DebugPanel from '$lib/components/dev/DebugPanel.svelte';
  import { fomoStore } from '$lib/stores/fomoStore';

  let { data } = $props<{
    weeks: any[];
    currentWeek: any;
    debug: { error?: string; details?: string; success?: boolean; weekCount?: number };
  }>();

  $effect(() => {
    if (data.weeks?.length) {
      fomoStore.initializeWeeks(
        data.weeks.map((week) => ({
          ...week,
          startDate: new Date(week.startDate),
          endDate: new Date(week.endDate),
          createdAt: new Date(week.createdAt)
        }))
      );
    }
  });
</script>

<ViewportSize />

<DebugPanel currentWeek={data.currentWeek} debug={data.debug} />

<div class="flex min-h-screen flex-col">
  <section
    class="relative overflow-hidden border-white/10 bg-black/40 pt-24 pb-20 sm:pt-32 sm:pb-24"
  >
    <Hero />
  </section>
  <section class="relative">
    <div
      class="pointer-events-none absolute top-0 left-0 -z-10 h-44 w-full bg-gradient-to-b from-black/40 to-transparent">
		</div>
    <GridLayout />
  </section>
  <Timeline />
</div>