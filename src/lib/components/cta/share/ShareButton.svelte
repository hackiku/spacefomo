<!-- // src/lib/components/cta/share/ShareButton.svelte -->
<script lang="ts">
  import { Share, PlusCircle } from 'phosphor-svelte';
  import { Button } from 'bits-ui';
  
  let { 
    variant = 'default', 
    size = 'md',
    onClick 
  } = $props<{ 
    variant?: 'default' | 'primary' | 'icon', 
    size?: 'sm' | 'md' | 'lg',
    onClick: () => void 
  }>();

  // Size classes
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const buttonClasses = {
    sm: 'py-1.5 px-4',
    md: 'py-2.5 px-5',
    lg: 'py-3 px-6'
  };

  const iconClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };
  
  // Icon-only sizes
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };
</script>

{#if variant === 'primary'}
  <!-- Primary button with gradient background -->
  <Button.Root
    onclick={onClick}
    class="{buttonClasses[size]} {sizeClasses[size]} inline-flex items-center gap-2 rounded-full 
           bg-gradient-to-r from-violet-500 to-fuchsia-500 
           font-medium text-white cursor-pointer
           transition-all hover:from-violet-600 hover:to-fuchsia-600
           hover:shadow-lg hover:shadow-violet-500/25 active:scale-95"
  >
    <PlusCircle weight="bold" class={iconClasses[size]} />
    <span>Share News</span>
  </Button.Root>
{:else if variant === 'default'}
  <!-- Default button with border -->
  <Button.Root
    onclick={onClick}
    class="{buttonClasses[size]} {sizeClasses[size]} inline-flex items-center gap-2 rounded-full 
           border border-zinc-700 bg-zinc-800/50 text-zinc-200 cursor-pointer
           transition-all hover:bg-zinc-800 hover:text-white active:scale-95"
  >
    <Share weight="bold" class={iconClasses[size]} />
    <span>Share News</span>
  </Button.Root>
{:else}
  <!-- Icon-only button -->
  <Button.Root
    onclick={onClick}
    class="inline-flex items-center justify-center rounded-full cursor-pointer
           {iconSizes[size]}
           bg-zinc-800 hover:bg-zinc-700 text-zinc-200
           transition-all hover:text-white active:scale-95"
    aria-label="Share News"
  >
    <Share weight="bold" class={iconClasses[size]} />
  </Button.Root>
{/if}