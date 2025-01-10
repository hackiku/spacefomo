<!-- src/routes/admin/+page.svelte -->
<script lang="ts">
  import { ExternalLink, Check, X, Loader2 } from 'lucide-svelte'
  import type { NewsSubmission } from '$lib/types/database'
  
  export let data
  
  let submissions = data.submissions
  let processingId: string | null = null
  let filter: 'pending' | 'approved' | 'rejected' = 'pending'
  
  async function handleApprove(id: string) {
    processingId = id
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    submissions = submissions.map(sub =>
      sub.id === id ? { ...sub, status: 'approved' } : sub
    )
    processingId = null
    // Here you'll trigger Make.com webhook later
  }

  async function handleReject(id: string) {
    processingId = id
    await new Promise(resolve => setTimeout(resolve, 1000))
    submissions = submissions.map(sub =>
      sub.id === id ? { ...sub, status: 'rejected' } : sub
    )
    processingId = null
  }
</script>

<div class="min-h-screen bg-black text-white p-8">
  <div class="max-w-6xl mx-auto">
    <header class="mb-8">
      <h1 class="text-3xl font-bold mb-4">Space FOMO Admin</h1>
      
      <!-- Filter Tabs -->
      <div class="flex gap-2 border-b border-zinc-800">
        {#each ['pending', 'approved', 'rejected'] as status}
          <button
            on:click={() => filter = status}
            class="px-4 py-2 -mb-px text-sm font-medium capitalize
                  {filter === status 
                    ? 'border-b-2 border-violet-500 text-violet-400' 
                    : 'text-zinc-500 hover:text-zinc-300'}"
          >
            {status}
          </button>
        {/each}
      </div>
    </header>

    <div class="space-y-4">
      {#each submissions.filter(sub => sub.status === filter) as submission (submission.id)}
        <div class="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <h3 class="text-lg font-medium text-zinc-100">
                  {submission.title || 'Untitled Submission'}
                </h3>
                {#if submission.source}
                  <span class="text-sm px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                    {submission.source}
                  </span>
                {/if}
              </div>
              
              <div class="flex items-center gap-2 text-sm text-zinc-500 mb-4">
                <a 
                  href={submission.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-1 hover:text-zinc-300"
                >
                  <ExternalLink class="w-4 h-4" />
                  {submission.url}
                </a>
                <span>•</span>
                <time>
                  {new Date(submission.submitted_at).toLocaleString()}
                </time>
              </div>
            </div>

            {#if submission.status === 'pending'}
              <div class="flex items-center gap-2">
                <button
                  on:click={() => handleApprove(submission.id)}
                  disabled={processingId === submission.id}
                  class="flex items-center gap-2 px-4 py-2 rounded-lg
                         bg-green-600/20 text-green-400 hover:bg-green-600/30
                         border border-green-500/20 transition-colors"
                >
                  {#if processingId === submission.id}
                    <Loader2 class="w-4 h-4 animate-spin" />
                    Processing...
                  {:else}
                    <Check class="w-4 h-4" />
                    Approve
                  {/if}
                </button>
                
                <button
                  on:click={() => handleReject(submission.id)}
                  disabled={processingId === submission.id}
                  class="flex items-center gap-2 px-4 py-2 rounded-lg
                         bg-red-600/20 text-red-400 hover:bg-red-600/30
                         border border-red-500/20 transition-colors"
                >
                  <X class="w-4 h-4" />
                  Reject
                </button>
              </div>
            {/if}
          </div>
        </div>
      {/each}

      {#if submissions.filter(sub => sub.status === filter).length === 0}
        <div class="text-center py-12 text-zinc-500">
          No {filter} submissions
        </div>
      {/if}
    </div>
  </div>
</div>