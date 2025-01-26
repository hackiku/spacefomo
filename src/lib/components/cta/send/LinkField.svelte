<!-- src/lib/components/cta/send/LinkField.svelte -->
<script lang="ts">
  import { Link } from 'lucide-svelte';
  import { fade } from 'svelte/transition';
  import { onMount, onDestroy } from 'svelte';
  
  export let value = '';
  
  const sourcePlaceholders = {
    reddit: 'reddit.com/r/space/...',
    news: 'space.com/space-exploration/launches-spacecraft/...',
    twitter: 'twitter.com/spacex/status/...',
    github: 'github.com/nasa/space-apps/...',
    nasa: 'nasa.gov/missions/artemis/...'
  };
  
  let currentPlaceholder = sourcePlaceholders.reddit;
  let placeholderInterval: ReturnType<typeof setInterval>;
  
  // Cycle through placeholders
  function cyclePlaceholders() {
    const placeholders = Object.values(sourcePlaceholders);
    const currentIndex = placeholders.indexOf(currentPlaceholder);
    const nextIndex = (currentIndex + 1) % placeholders.length;
    currentPlaceholder = placeholders[nextIndex];
  }
  
  onMount(() => {
    placeholderInterval = setInterval(cyclePlaceholders, 3000);
  });

  onDestroy(() => {
    if (placeholderInterval) {
      clearInterval(placeholderInterval);
    }
  });
</script>

<div class="relative group">
  <div class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
    <Link class="w-5 h-5" />
  </div>
  
  <input
    type="url"
    bind:value
    placeholder={currentPlaceholder}
    class="w-full h-14 bg-black/30 border border-white/10 rounded-full
           pl-12 pr-6 text-zinc-100
           placeholder:text-zinc-500 focus:outline-none"
  />
</div>