<script lang="ts">
  import Controls from '$lib/features/news/controls/Controls.svelte';
  import News from '$lib/features/news/News.svelte';
  
  let isSticky = $state(false);
  let sidebarRef: HTMLDivElement;
  
  $effect(() => {
    if (!sidebarRef) return;
    const observer = new IntersectionObserver(
      ([entry]) => isSticky = !entry.isIntersecting,
      { threshold: 0 }
    );
    observer.observe(sidebarRef);
    return () => observer.disconnect();
  });
</script>

<div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
  <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 pb-32">
    <!-- Left Column -->
    <div 
      bind:this={sidebarRef}
      class="md:col-span-2 lg:col-span-2 space-y-4 transition-all duration-200"
      class:md:sticky={isSticky}
      class:md:top-4={isSticky}
    >

			<Controls />
      
      <!-- FOMO Placeholder -->
      <div class="bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800">
        <div class="min-h-48 flex items-center justify-center text-zinc-600">
          FOMO Score
        </div>
      </div>
    </div>

    <!-- Right Column - News Grid -->
    <div class="md:col-span-2 lg:col-span-4 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-screen">
      <News />
    </div>
  </div>
</div>

