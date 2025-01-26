<!-- src/lib/features/fomo/ScoreSelector.svelte -->
 
<script lang="ts">
  import { ArrowUp, ArrowDown } from 'lucide-svelte';
  
  export let value: number | null = null;
  export let onChange: (value: number | null) => void = () => {};
  
  function increment() {
    const newValue = (value || 0) + 1;
    if (newValue <= 100) onChange(newValue);
  }
  
  function decrement() {
    const newValue = (value || 0) - 1;
    if (newValue >= 0) onChange(newValue);
  }
  
  function handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = parseInt(input.value);
    onChange(isNaN(newValue) ? null : Math.min(100, Math.max(0, newValue)));
  }
</script>

<div class="flex items-center gap-2">
  <button
    class="p-1.5 rounded-lg transition-colors hover:bg-violet-500/10"
    on:click={decrement}
    disabled={value === 0}
    aria-label="Decrease score"
  >
    <ArrowDown class="w-4 h-4 text-zinc-400" />
  </button>
  
  <input
    type="number"
    min="0"
    max="100"
    {value}
    on:input={handleInput}
    placeholder="0-100"
    class="w-16 text-center bg-transparent border-none 
           text-zinc-100 placeholder-zinc-500 focus:outline-none"
  />
  
  <button
    class="p-1.5 rounded-lg transition-colors hover:bg-violet-500/10"
    on:click={increment}
    disabled={value === 100}
    aria-label="Increase score"
  >
    <ArrowUp class="w-4 h-4 text-zinc-400" />
  </button>
</div>