<!-- src/lib/features/news/Card.svelte -->
<script lang="ts">
  import type { NewsItem } from '$lib/types';
  import { newsStore } from '$lib/stores/newsStore';
  import FomoScore from '$lib/features/fomo/FomoScore.svelte';
  
  export let item: NewsItem;
  export let onClick = () => {};
</script>

<article 
  class="group relative max-w-2xl mx-auto cursor-pointer overflow-hidden"
>
  <!-- Ambient glow effect -->
  <div class="absolute -inset-1 bg-blue-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
  
  <!-- Main container -->
  <div class="relative bg-black border border-blue-500/20 group-hover:border-blue-500/30 transition-colors duration-300">
    <!-- Corner accents -->
    <div class="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-blue-500/40 group-hover:border-blue-500/60 transition-colors duration-300" />
    <div class="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-blue-500/40 group-hover:border-blue-500/60 transition-colors duration-300" />
    <div class="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-blue-500/40 group-hover:border-blue-500/60 transition-colors duration-300" />
    <div class="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-blue-500/40 group-hover:border-blue-500/60 transition-colors duration-300" />

    <div class="flex gap-6 p-6">
      <!-- Content -->
      <div class="flex-1" 
           on:click={() => onClick(item)}
           on:keydown={(e) => e.key === 'Enter' && onClick(item)}
           tabindex="0"
      >
        <!-- Title with hover glow -->
        <h2 class="relative text-2xl font-medium tracking-tight mb-3 group-hover:text-blue-100 transition-colors">
          <span class="absolute inset-0 text-blue-500/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
            {item.title}
          </span>
          <span class="relative">
            {item.title}
          </span>
        </h2>

        <!-- Metadata with terminal style -->
        <div class="flex items-center gap-4 font-mono text-sm text-blue-500/60 mb-4">
          <span class="text-blue-400">>></span>
          <span>{item.source}</span>
          <span class="text-blue-400/50">|</span>
          <span>{item.readTime}</span>
        </div>

        <!-- Tags with neon effect -->
        <div class="flex flex-wrap gap-2">
          {#each item.tags as tag}
            <span class="relative px-3 py-1 text-sm">
              <!-- Tag glow -->
              <span class="absolute inset-0 bg-blue-500/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
              <!-- Tag border with gradient -->
              <span class="absolute inset-0 border border-blue-500/30 bg-blue-950/30" />
              <!-- Tag text -->
              <span class="relative text-blue-400 font-mono">
                {tag}
              </span>
            </span>
          {/each}
        </div>
      </div>

      <!-- FOMO Score with glowing separator -->
      <div class="relative flex items-center pl-6">
        <!-- Vertical line with glow -->
        <div class="absolute -top-6 -bottom-6 left-0 w-px">
          <div class="absolute inset-0 bg-blue-500/20" />
          <div class="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/20 to-transparent" />
        </div>
        
        <FomoScore score={item.score} />
      </div>
    </div>
  </div>
</article>

<style>
  /* Optional: Add subtle scanner effect on hover */
  article::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(59, 130, 246, 0.1),
      transparent
    );
    transition: 0.5s;
    pointer-events: none;
  }

  article:hover::after {
    left: 100%;
  }
</style>