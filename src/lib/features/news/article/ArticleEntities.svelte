<!-- src/lib/features/news/article/ArticleEntities.svelte -->
<script lang="ts">
  import type { NewsItem } from '$lib/types/news';
  
  let { entities } = $props<{
    entities: NewsItem['entities'];
  }>();
</script>

{#if entities}
  <div class="space-y-4">
    <h2 class="text-sm font-medium text-zinc-400">Mentioned in this article</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {#if entities.companies}
        <div class="rounded-xl bg-zinc-800/30 border border-zinc-700/50 p-5">
          <h3 class="text-sm font-medium text-zinc-300 mb-3">Organizations</h3>
          <div class="space-y-2.5">
            {#each entities.companies as org}
              <div class="flex items-baseline justify-between">
                <span class="text-zinc-200">{org.name}</span>
                {#if org.role}<span class="text-zinc-500 text-sm">{org.role}</span>{/if}
              </div>
            {/each}
          </div>
        </div>
      {/if}

      {#if entities.people}
        <div class="rounded-xl bg-zinc-800/30 border border-zinc-700/50 p-5">
          <h3 class="text-sm font-medium text-zinc-300 mb-3">Key People</h3>
          <div class="space-y-2.5">
            {#each entities.people as person}
              <div class="flex items-baseline justify-between">
                <span class="text-zinc-200">{person.name}</span>
                {#if person.role}<span class="text-zinc-500 text-sm">{person.role}</span>{/if}
              </div>
            {/each}
          </div>
        </div>
      {/if}
      
      {#if entities.technologies}
        <div class="rounded-xl bg-zinc-800/30 border border-zinc-700/50 p-5">
          <h3 class="text-sm font-medium text-zinc-300 mb-3">Technologies</h3>
          <div class="space-y-2.5">
            {#each entities.technologies as tech}
              <div class="flex items-baseline justify-between">
                <span class="text-zinc-200">{tech.name}</span>
                {#if tech.status}<span class="text-zinc-500 text-sm">{tech.status}</span>{/if}
              </div>
            {/each}
          </div>
        </div>
      {/if}
      
      {#if entities.facilities}
        <div class="rounded-xl bg-zinc-800/30 border border-zinc-700/50 p-5">
          <h3 class="text-sm font-medium text-zinc-300 mb-3">Facilities</h3>
          <div class="space-y-2.5">
            {#each entities.facilities as facility}
              <div class="flex items-baseline justify-between">
                <span class="text-zinc-200">{facility.name}</span>
                {#if facility.type}<span class="text-zinc-500 text-sm">{facility.type}</span>{/if}
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}