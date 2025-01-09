<!-- src/lib/features/fomo/WeekTimeline.svelte -->
<script lang="ts">
  import { ArrowUp, ArrowDown } from 'lucide-svelte';
  
  export let score: number;
  export let userVote: 'up' | 'down' | null = null;

  function handleVote(vote: 'up' | 'down') {
    userVote = userVote === vote ? null : vote;
    // TODO: Integrate with store/API
  }
</script>

<div class="flex flex-col items-center gap-2">
  <button
    class="p-2 rounded-full transition-colors duration-200 hover:bg-zinc-800
           {userVote === 'up' ? 'text-blue-400' : 'text-zinc-500'}"
    on:click={() => handleVote('up')}
  >
    <ArrowUp class="w-5 h-5" />
  </button>
  
  <span class="text-2xl font-medium text-zinc-100">
    {score}
  </span>
  
  <button
    class="p-2 rounded-full transition-colors duration-200 hover:bg-zinc-800
           {userVote === 'down' ? 'text-red-400' : 'text-zinc-500'}"
    on:click={() => handleVote('down')}
  >
    <ArrowDown class="w-5 h-5" />
  </button>
</div>