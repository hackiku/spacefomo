<!-- src/lib/features/news/article/content/ViralTitle.svelte -->
<script lang="ts">
  // Remove the Button import that's causing problems
  // import { Button } from "bits-ui";
  
  let { title, viralTitle } = $props<{
    title: string;
    viralTitle: string | null;
  }>();
  
  // Whether to show the original title
  let showOriginal = $state(false);
</script>

<div class="space-y-3">
  <!-- Viral title with animated gradient -->
  <h2 class="text-3xl font-medium leading-tight text-foreground">
    {viralTitle || title}
  </h2>
  
  <!-- Original title toggle - Using regular button instead of Button.Root -->
  {#if viralTitle && viralTitle !== title}
    <button 
      type="button"
      onclick={() => showOriginal = !showOriginal}
      class="group relative text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5
             before:absolute before:inset-0
             before:border before:border-primary/0
             before:translate-x-0.5 before:translate-y-0.5
             before:transition-transform before:duration-300
             hover:before:border-primary/10
             hover:before:translate-x-0 hover:before:translate-y-0"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" class={`transition-transform ${showOriginal ? 'rotate-180' : ''}`}>
        <path fill="currentColor" d="m213.7 101.7l-80 80a8.2 8.2 0 0 1-11.4 0l-80-80a8.4 8.4 0 0 1-2.3-5.7a8 8 0 0 1 8-8a8.2 8.2 0 0 1 5.7 2.3l74.3 74.4l74.3-74.3a8.1 8.1 0 0 1 11.4 11.3Z"/>
      </svg>
      <span>{showOriginal ? 'Hide original title' : 'Show original title'}</span>
    </button>
    
    <!-- Original title -->
    {#if showOriginal}
      <p class="text-lg text-muted-foreground leading-relaxed p-4 bg-muted/30 border-l-2 border-muted">
        {title}
      </p>
    {/if}
  {/if}
</div>