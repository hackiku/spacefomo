<!-- src/routes/admin/+page.svelte -->
<script lang="ts">
  let { data } = $props<{
    submissions?: {
      id: number;
      url: string;
      comment: string | null;
      fomoScore: number | null;
      email: string | null;
      published: boolean;
      createdAt: string;
    }[];
  }>();

  let newUrl = '';
  let newComment = '';
  let newFomoScore = 50;

  async function handleSubmit() {
    const response = await fetch('/admin/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: newUrl,
        comment: newComment,
        fomoScore: newFomoScore
      })
    });

    if (response.ok) {
      newUrl = '';
      newComment = '';
      newFomoScore = 50;
      // Force reload page data
      window.location.reload();
    }
  }

  async function togglePublished(id: number, currentState: boolean) {
    const response = await fetch(`/admin/api/submissions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !currentState })
    });

    if (response.ok) {
      window.location.reload();
    }
  }
</script>

<div class="p-8 min-h-screen bg-black text-white">
  <!-- Add new submission -->
  <div class="mb-8 p-4 border border-zinc-800 rounded-lg">
    <h2 class="text-xl mb-4">Add Test Submission</h2>
    <div class="space-y-4">
      <input
        type="text"
        bind:value={newUrl}
        placeholder="URL"
        class="w-full p-2 bg-zinc-900 rounded"
      />
      <textarea
        bind:value={newComment}
        placeholder="Comment"
        class="w-full p-2 bg-zinc-900 rounded"
      />
      <div class="flex items-center gap-4">
        <input
          type="range"
          bind:value={newFomoScore}
          min="0"
          max="100"
          class="flex-1"
        />
        <span class="w-12 text-center">{newFomoScore}</span>
      </div>
      <button
        on:click={handleSubmit}
        class="px-4 py-2 bg-violet-600 rounded hover:bg-violet-700"
      >
        Add
      </button>
    </div>
  </div>

  <!-- View submissions -->
  <div class="space-y-4">
    <h2 class="text-xl mb-4">Submissions ({data?.submissions?.length ?? 0})</h2>
    {#if data?.submissions}
      {#each data.submissions as sub}
        <div class="p-4 border border-zinc-800 rounded-lg">
          <div class="flex justify-between gap-4">
            <div class="flex-1">
              <a href={sub.url} class="text-violet-400 hover:underline">{sub.url}</a>
              {#if sub.comment}
                <p class="mt-2 text-zinc-400">{sub.comment}</p>
              {/if}
              <div class="mt-2 text-sm text-zinc-500">
                Score: {sub.fomoScore ?? 'N/A'} |
                Added: {new Date(sub.createdAt).toLocaleString()}
              </div>
            </div>
            <button
              on:click={() => togglePublished(sub.id, sub.published)}
              class="px-3 py-1 h-fit rounded text-sm
                     {sub.published ? 'bg-green-900/50 text-green-400' : 'bg-zinc-900 text-zinc-400'}"
            >
              {sub.published ? 'Published' : 'Draft'}
            </button>
          </div>
        </div>
      {/each}
    {:else}
      <div class="text-zinc-500">Loading...</div>
    {/if}
  </div>
</div>