<!-- src/lib/components/branding/Logo.svelte -->
<script lang="ts">
  let { size = 'default' } = $props<{
    size?: 'sm' | 'md' | 'lg';
  }>();

  const sizeClasses = {
    sm: 'h-5',
    md: 'h-7',
    lg: 'h-10'
  };
</script>

<div class="flex items-center gap-3">
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    class={sizeClasses[size]}
  >
    <path 
      d="M12 2L2 7L12 12L22 7L12 2Z" 
      class="fill-violet-500"
    />
    <path 
      d="M2 17L12 22L22 17" 
      class="stroke-fuchsia-500" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    />
    <path 
      d="M2 12L12 17L22 12" 
      class="stroke-violet-500" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    />
  </svg>
  
  <span class="font-medium bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-500">
    Spacefomo
  </span>
</div>