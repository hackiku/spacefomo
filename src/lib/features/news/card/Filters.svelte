<!-- src/lib/features/news/Filters.svelte -->
<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { ChevronDown } from 'lucide-svelte';
  import type { NewsItem } from '$lib/types';
  
  export let selectedFilters: {
    types: string[];
    tags: string[];
    sources: string[];
  };
</script>

<div class="space-y-4">
  <!-- Type Filters -->
  <div class="space-y-2">
    <Button variant="ghost" class="w-full justify-between">
      <span>Types</span>
      <ChevronDown class="w-4 h-4" />
    </Button>
    <!-- Expandable content -->
  </div>

  <!-- Tag Filters -->
  <div class="space-y-2">
    <Button variant="ghost" class="w-full justify-between">
      <span>Tags</span>
      <ChevronDown class="w-4 h-4" />
    </Button>
    <!-- Expandable content -->
  </div>

  <!-- Source Filters -->
  <div class="space-y-2">
    <Button variant="ghost" class="w-full justify-between">
      <span>Sources</span>
      <ChevronDown class="w-4 h-4" />
    </Button>
    <!-- Expandable content -->
  </div>
</div>