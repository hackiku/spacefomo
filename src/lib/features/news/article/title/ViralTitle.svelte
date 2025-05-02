<!-- src/lib/features/news/article/title/ViralTitle.svelte -->
<script lang="ts">
  let { title, viralTitle } = $props<{
    title: string;
    viralTitle: string | null;
  }>();
  
  // Whether to show the original title
  let showOriginal = $state(false);
</script>

<div class="space-y-3">
  <!-- Viral title with animated gradient -->
  <h2 class="text-3xl font-medium leading-tight">
    <span class="bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-100 
                 animate-gradient-flow inline-block">
      {viralTitle || title}
    </span>
  </h2>
  
  <!-- Original title toggle -->
  {#if viralTitle && viralTitle !== title}
    <button 
      on:click={() => showOriginal = !showOriginal}
      class="text-sm text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1.5"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" class={showOriginal ? 'rotate-180' : ''}>
        <path fill="currentColor" d="m213.7 101.7l-80 80a8.2 8.2 0 0 1-11.4 0l-80-80a8.4 8.4 0 0 1-2.3-5.7a8 8 0 0 1 8-8a8.2 8.2 0 0 1 5.7 2.3l74.3 74.4l74.3-74.3a8.1 8.1 0 0 1 11.4 11.3Z"/>
      </svg>
      <span>{showOriginal ? 'Hide original title' : 'Show original title'}</span>
    </button>
    
    <!-- Original title -->
    {#if showOriginal}
      <p class="text-lg text-zinc-400 leading-relaxed p-4 border-l-2 border-zinc-700 bg-zinc-800/30 rounded-r-lg">
        {title}
      </p>
    {/if}
  {/if}
</div>

<style>
  .animate-gradient-flow {
    background-size: 200% auto;
    animation: gradientFlow 8s ease infinite;
  }
  
  @keyframes gradientFlow {
    0% {
      background-position: 0% center;
    }
    50% {
      background-position: 100% center;
    }
    100% {
      background-position: 0% center;
    }
  }
</style>