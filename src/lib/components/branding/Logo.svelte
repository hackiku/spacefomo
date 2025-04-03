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
	<img src="logo.svg" alt="Spacefomo logo" class="h-6"/>  
  <!-- <span class="font-medium bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-500"> -->
  <span class="font-medium bg-clip-text text-white">
    Spacefomo
  </span>
</div>