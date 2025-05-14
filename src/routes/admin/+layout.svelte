<!-- src/routes/admin/+layout.svelte -->
<script lang="ts">
  import { browser } from '$app/environment';
  import { initSupabaseClient, testSupabaseConnection } from './api/supabaseClient';
  import { cn } from '$lib/utils';
  
  // Props
  let { children } = $props();
  
  // State
  let supabaseConnected = $state(false);
  let connectionTested = $state(false);
  let connectionError = $state<string | null>(null);
  let notificationVisible = $state(false);
  
  // Initialize Supabase when browser is ready
  $effect(() => {
    if (!browser) return;
    
    async function initializeSupabase() {
      try {
        // Initialize client
        const client = initSupabaseClient();
        
        if (!client) {
          connectionError = "Failed to initialize Supabase client. Check your environment variables.";
          connectionTested = true;
          notificationVisible = true;
          return;
        }
        
        // Test connection
        const connected = await testSupabaseConnection();
        supabaseConnected = connected;
        connectionTested = true;
        notificationVisible = true;
        
        if (!connected) {
          connectionError = "Could not connect to Supabase database. Check your credentials and network.";
        }
      } catch (error) {
        connectionError = error instanceof Error ? error.message : "Unknown connection error";
        supabaseConnected = false;
        connectionTested = true;
        notificationVisible = true;
      }
    }
    
    // Run initialization
    initializeSupabase();
  });
  
  // Auto-hide success notification
  $effect(() => {
    if (connectionTested && supabaseConnected && !connectionError && notificationVisible) {
      const timer = setTimeout(() => {
        notificationVisible = false;
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  });
</script>

<!-- Connection status notification -->
{#if connectionTested && notificationVisible}
  <div 
    class={cn(
      "fixed top-2 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full text-sm transition-opacity duration-300",
      supabaseConnected && !connectionError 
        ? "bg-emerald-500/90 text-white" 
        : "bg-red-500/90 text-white"
    )}
  >
    {#if supabaseConnected && !connectionError}
      Connected to Supabase
    {:else}
      {connectionError || 'Failed to connect to Supabase'}
    {/if}
  </div>
{/if}

<!-- Admin shell layout -->
<div class="min-h-screen bg-muted/30">
  <!-- Main content -->
  <main class="w-full py-6 px-4">
    {@render children()}
  </main>
</div>