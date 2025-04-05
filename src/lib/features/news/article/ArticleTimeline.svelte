<!-- src/lib/features/news/article/ArticleTimeline.svelte -->
<script lang="ts">
  import type { NewsItem } from '$lib/types/news';
  
  let { timeline } = $props<{
    timeline: NewsItem['context']['timeline'];
  }>();
</script>

{#if timeline}
  <div class="space-y-4">
    <h2 class="text-sm font-medium text-zinc-400">Timeline</h2>
    <div class="rounded-xl bg-zinc-800/30 border border-zinc-700/50 p-5">
      {#if timeline.phase}
        <div class="mb-3">
          <span class="text-violet-400 font-medium">Phase:</span> 
          <span class="text-zinc-300">{timeline.phase}</span>
        </div>
      {/if}
      
      <div class="grid grid-cols-2 gap-4">
        {#if timeline.target_date}
          <div>
            <span class="text-zinc-500 text-sm">Target:</span>
            <div class="text-zinc-300">{timeline.target_date}</div>
          </div>
        {/if}
        
        {#if timeline.current_date}
          <div>
            <span class="text-zinc-500 text-sm">Current:</span> 
            <div class="text-zinc-300">{timeline.current_date}</div>
          </div>
        {/if}
        
        {#if timeline.official_date}
          <div>
            <span class="text-zinc-500 text-sm">Official:</span>
            <div class="text-zinc-300">{timeline.official_date}</div>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}