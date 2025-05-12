<!-- src/lib/components/cta/share/ShareButton.svelte -->
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
  <!-- Primary button with space gradient background -->
  <Button.Root
    onclick={onClick}
    class="group relative {buttonClasses[size]} {sizeClasses[size]} inline-flex items-center gap-2 
           bg-primary text-primary-foreground font-medium
           transition-all hover:bg-primary/90 active:scale-95
           before:absolute before:inset-0
           before:border before:border-primary/50
           before:translate-x-0.5 before:translate-y-0.5
           before:transition-transform before:duration-300
           hover:before:translate-x-0 hover:before:translate-y-0"
  >
    <PlusCircle weight="bold" class={iconClasses[size]} />
    <span>Share News</span>
  </Button.Root>
{:else if variant === 'default'}
  <!-- Default button with border -->
  <Button.Root
    onclick={onClick}
    class="group relative {buttonClasses[size]} {sizeClasses[size]} inline-flex items-center gap-2
           bg-muted border border-border text-muted-foreground
           hover:text-foreground transition-colors active:scale-95
           before:absolute before:inset-0
           before:border before:border-primary/10
           before:translate-x-0.5 before:translate-y-0.5
           before:transition-transform before:duration-300
           hover:before:translate-x-0 hover:before:translate-y-0"
  >
    <Share weight="bold" class={iconClasses[size]} />
    <span>Share News</span>
  </Button.Root>
{:else}
  <!-- Icon-only button -->
  <Button.Root
    onclick={onClick}
    class="group relative inline-flex items-center justify-center cursor-pointer
           {iconSizes[size]}
           bg-muted border border-border text-muted-foreground
           hover:text-foreground transition-colors active:scale-95
           before:absolute before:inset-0
           before:border before:border-primary/10
           before:translate-x-0.5 before:translate-y-0.5
           before:transition-transform before:duration-300
           hover:before:translate-x-0 hover:before:translate-y-0"
    aria-label="Share News"
  >
    <Share weight="bold" class={iconClasses[size]} />
  </Button.Root>
{/if}