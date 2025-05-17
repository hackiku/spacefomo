<!-- src/routes/(admin)/+layout.svelte -->
<script lang="ts">
  import '../../app.css';
  import { browser } from '$app/environment';
  import { cn } from '$lib/utils';
  
  // Props
  let { data, children } = $props();
  
  // State for notifications
  let notification = $state<{
    visible: boolean;
    type: 'success' | 'error';
    message: string;
  }>({
    visible: false,
    type: 'success',
    message: ''
  });
  
  // Show notification function
  function showNotification(message: string, type: 'success' | 'error' = 'success') {
    notification = {
      visible: true,
      type,
      message
    };
    
    // Auto-hide success notifications
    if (type === 'success') {
      setTimeout(() => {
        notification.visible = false;
      }, 3000);
    }
  }
  
  // Handle connection error
  $effect(() => {
    if (data.error) {
      showNotification(data.error, 'error');
    }
  });
</script>

<!-- Notification component -->
{#if notification.visible}
  <div 
    class={cn(
      "fixed top-2 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full text-sm transition-opacity duration-300",
      notification.type === 'success'
        ? "bg-emerald-500/90 text-white" 
        : "bg-red-500/90 text-white"
    )}
  >
    {notification.message}
  </div>
{/if}

<!-- Admin shell layout -->
<div class="min-h-screen bg-muted/30">
  <!-- Main content -->
  <main class="w-full py-6 px-4">
    {@render children()}
  </main>
</div>