<!-- src/routes/share/+page.svelte -->
<script lang="ts">
  import ShareButton from '$lib/components/share/ShareButton.svelte';
  import ShareModal from '$lib/components/share/ShareModal.svelte';
  import { newsStore } from '$lib/stores/newsStore';
  import { supabase } from '$lib/supabaseClient';
  
  // State for the modal
  let showShareModal = $state(false);
  
  // Get the latest news articles
  let latest = $derived($newsStore.items?.slice(0, 5) || []);
  
  // Submissions state
  let recentSubmissions = $state<any[]>([]);
  let submissionsLoading = $state(false);
  let submissionsError = $state('');
  
  function openShareModal() {
    showShareModal = true;
  }
  
  function closeShareModal() {
    showShareModal = false;
    loadRecentSubmissions(); // Refresh after modal closes
  }
  
  // Load recent submissions
  async function loadRecentSubmissions() {
    submissionsLoading = true;
    submissionsError = '';
    
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      
      recentSubmissions = data || [];
    } catch (err) {
      console.error('Error loading submissions:', err);
      submissionsError = err instanceof Error ? err.message : 'Failed to load submissions';
    } finally {
      submissionsLoading = false;
    }
  }
  
  // Format date for display
  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString();
  }
  
  // Load submissions when component mounts
  $effect(() => {
    loadRecentSubmissions();
  });
</script>

<div class="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-zinc-100">Admin: Share Testing</h1>
      <div class="text-xs bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full">
        Debug Mode
      </div>
    </div>
    
    <div class="mb-12 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
      <h2 class="text-xl font-medium text-zinc-200 mb-4">Share Button Variations</h2>
      
      <div class="flex flex-wrap gap-4">
        <ShareButton variant="primary" onClick={openShareModal} />
        <ShareButton variant="default" onClick={openShareModal} />
        <ShareButton variant="icon" onClick={openShareModal} />
        <ShareButton variant="primary" size="sm" onClick={openShareModal} />
        <ShareButton variant="primary" size="lg" onClick={openShareModal} />
      </div>
    </div>
    
    <!-- Recent submissions section -->
    <div class="mb-12 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-medium text-zinc-200">Recent Submissions</h2>
        <button 
          onclick={loadRecentSubmissions}
          class="px-3 py-1 text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
        >
          Refresh
        </button>
      </div>
      
      {#if submissionsLoading}
        <div class="p-4 text-center text-zinc-400">Loading submissions...</div>
      {:else if submissionsError}
        <div class="p-4 text-center text-red-400">{submissionsError}</div>
      {:else if recentSubmissions.length === 0}
        <div class="p-4 text-center text-zinc-400">No submissions yet. Try adding some!</div>
      {:else}
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-zinc-800">
                <th class="text-left p-2 text-zinc-400">ID</th>
                <th class="text-left p-2 text-zinc-400">URL</th>
                <th class="text-left p-2 text-zinc-400">Score</th>
                <th class="text-left p-2 text-zinc-400">Date</th>
                <th class="text-left p-2 text-zinc-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {#each recentSubmissions as submission (submission.id)}
                <tr class="border-b border-zinc-800 hover:bg-zinc-800/50">
                  <td class="p-2 text-zinc-300">{submission.id}</td>
                  <td class="p-2 text-zinc-300">
                    <a 
                      href={submission.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      class="text-violet-400 hover:underline truncate block max-w-xs"
                    >
                      {submission.url}
                    </a>
                  </td>
                  <td class="p-2 text-zinc-300">{submission.fomo_score || '-'}</td>
                  <td class="p-2 text-zinc-500">{formatDate(submission.created_at)}</td>
                  <td class="p-2">
                    <span class="px-2 py-0.5 rounded-full text-xs bg-amber-500/20 text-amber-300">
                      {submission.published ? 'Published' : 'Pending'}
                    </span>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>
    
    <!-- Recently featured news -->
    <div class="mb-12 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
      <h2 class="text-xl font-medium text-zinc-200 mb-4">Recently Featured News</h2>
      
      <div class="space-y-4">
        {#each latest as article (article.id)}
          <div class="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-700 transition-colors">
            <h3 class="text-lg font-medium text-zinc-100">{article.title}</h3>
            <div class="flex items-center justify-between mt-3">
              <div class="text-sm text-zinc-500">
                {article.source || 'Unknown source'}
              </div>
              <div class="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-500">
                {article.fomo_score || 0}
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

{#if showShareModal}
  <ShareModal onClose={closeShareModal} />
{/if}