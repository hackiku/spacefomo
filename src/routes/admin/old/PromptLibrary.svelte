<!-- src/routes/admin/PromptLibrary.svelte -->
<script lang="ts">
  import { Check, CopySimple, MagnifyingGlass, PencilSimple, Plus, Trash } from 'phosphor-svelte';
  
  // Mock data for UI design
  const promptTypes = [
    { id: 'extract', name: 'Content Extraction' },
    { id: 'entities', name: 'Entity Extraction' },
    { id: 'summary', name: 'Summary Generation' },
    { id: 'fomo', name: 'FOMO Calculation' }
  ];
  
  const mockPrompts = [
    {
      id: 1,
      type: 'extract',
      title: 'Basic Content Extractor',
      prompt: 'Extract the main article content from this URL, including title, author, and publication date.',
      model: 'gpt-4o',
      uses: 42,
      created_at: '2025-01-15'
    },
    {
      id: 2,
      type: 'entities',
      title: 'Space Industry Entities',
      prompt: 'Extract all companies, people, technologies, and space objects mentioned in this text. Focus on relationships between entities.',
      model: 'claude-3-5-sonnet',
      uses: 28,
      created_at: '2025-01-20'
    },
    {
      id: 3,
      type: 'summary',
      title: 'Viral Summary Generator',
      prompt: 'Summarize this space news article in 100 words or less. Create a catchy, viral-style headline (max 60 chars) that would make someone click. Focus on the most surprising or significant aspects.',
      model: 'claude-3-5-sonnet',
      uses: 67,
      created_at: '2025-02-01'
    }
  ];
  
  let prompts = $state(mockPrompts);
  let selectedType = $state('all');
  let searchQuery = $state('');
  let editingPrompt = $state<number | null>(null);
  let showAddForm = $state(false);
  
  // New prompt form data
  let newPrompt = $state({
    type: 'summary',
    title: '',
    prompt: '',
    model: 'claude-3-5-sonnet'
  });
  
  let filteredPrompts = $derived(prompts.filter(p => {
    const matchesType = selectedType === 'all' || p.type === selectedType;
    const matchesSearch = !searchQuery || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesType && matchesSearch;
  }));
  
  function handleSubmit(e: Event) {
    e.preventDefault();
    addPrompt();
  }
  
  function addPrompt() {
    prompts = [
      ...prompts,
      {
        ...newPrompt,
        id: Math.max(0, ...prompts.map(p => p.id)) + 1,
        uses: 0,
        created_at: new Date().toISOString().split('T')[0]
      }
    ];
    
    newPrompt = {
      type: 'summary',
      title: '',
      prompt: '',
      model: 'claude-3-5-sonnet'
    };
    
    showAddForm = false;
  }
  
  function deletePrompt(id: number) {
    prompts = prompts.filter(p => p.id !== id);
  }

	function copyPrompt(prompt: string) {
    // Would actually copy to clipboard
    alert('Prompt copied to clipboard');
  }
</script>

<div class="bg-zinc-900/80 rounded-xl border border-zinc-800 overflow-hidden">
  <div class="p-4 border-b border-zinc-800 flex items-center justify-between">
    <h2 class="font-medium text-zinc-200">Prompt Library</h2>
    
    <button
      onclick={() => showAddForm = !showAddForm}
      class="p-2 rounded-lg text-sm flex items-center gap-1.5
             {showAddForm ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'} 
             transition-colors"
    >
      <Plus weight="bold" class="h-4 w-4" />
      <span>Add Prompt</span>
    </button>
  </div>
  
  {#if showAddForm}
    <div class="p-4 bg-zinc-800/50 border-b border-zinc-700/50">
      <form onsubmit={handleSubmit} class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs text-zinc-500 mb-1">Prompt Title</label>
            <input
              bind:value={newPrompt.title}
              type="text"
              placeholder="E.g., Space Industry Entities"
              class="w-full px-3 py-2 bg-black/20 rounded-lg border border-zinc-700
                     text-zinc-200 placeholder:text-zinc-600
                     focus:outline-none focus:ring-1 focus:ring-violet-500/50"
            />
          </div>
          
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs text-zinc-500 mb-1">Type</label>
              <select
                bind:value={newPrompt.type}
                class="w-full px-3 py-2 bg-black/20 rounded-lg border border-zinc-700
                       text-zinc-200 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
              >
                {#each promptTypes as type}
                  <option value={type.id}>{type.name}</option>
                {/each}
              </select>
            </div>
            
            <div>
              <label class="block text-xs text-zinc-500 mb-1">Model</label>
              <select
                bind:value={newPrompt.model}
                class="w-full px-3 py-2 bg-black/20 rounded-lg border border-zinc-700
                       text-zinc-200 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
              >
                <option value="gpt-4o">GPT-4o</option>
                <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                <option value="cohere-command">Cohere Command</option>
              </select>
            </div>
          </div>
        </div>
        
        <div>
          <label class="block text-xs text-zinc-500 mb-1">Prompt Template</label>
          <textarea
            bind:value={newPrompt.prompt}
            rows="4"
            placeholder="Enter your prompt template here..."
            class="w-full px-3 py-2 bg-black/20 rounded-lg border border-zinc-700
                   text-zinc-200 placeholder:text-zinc-600
                   focus:outline-none focus:ring-1 focus:ring-violet-500/50"
          ></textarea>
        </div>
        
        <div class="flex justify-end gap-2">
          <button
            type="button"
            onclick={() => showAddForm = false}
            class="px-3 py-1.5 rounded-lg border border-zinc-700 
                   text-zinc-400 hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={!newPrompt.title || !newPrompt.prompt}
            class="px-3 py-1.5 rounded-lg bg-violet-600 
                   hover:bg-violet-500 text-white transition-colors
                   disabled:opacity-50 disabled:hover:bg-violet-600 disabled:cursor-not-allowed"
          >
            Add Prompt
          </button>
        </div>
      </form>
    </div>
  {/if}
  
  <div class="p-4 border-b border-zinc-800 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
    <!-- Type Filter -->
    <div class="flex-shrink-0">
      <div class="inline-flex rounded-lg border border-zinc-800 overflow-hidden">
        <button
          onclick={() => selectedType = 'all'}
          class="px-3 py-1.5 text-sm {selectedType === 'all' 
            ? 'bg-zinc-800 text-zinc-200' 
            : 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-400'} transition-colors"
        >
          All
        </button>
        
        {#each promptTypes as type}
          <button
            onclick={() => selectedType = type.id}
            class="px-3 py-1.5 text-sm {selectedType === type.id
              ? 'bg-zinc-800 text-zinc-200' 
              : 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-400'} transition-colors"
          >
            {type.name}
          </button>
        {/each}
      </div>
    </div>
    
    <!-- Search -->
    <div class="flex-1 max-w-md">
      <div class="relative">
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search prompts..."
          class="w-full pl-10 pr-4 py-2 bg-black/20 rounded-lg border border-zinc-800
                 text-zinc-200 placeholder:text-zinc-600
                 focus:outline-none focus:ring-1 focus:ring-zinc-700"
        />
        <MagnifyingGlass class="absolute left-3 top-2.5 h-5 w-5 text-zinc-600" />
      </div>
    </div>
  </div>
  
  <div class="overflow-y-auto max-h-[50vh]">
    {#if filteredPrompts.length === 0}
      <div class="p-8 text-center text-zinc-500">
        No prompts found. {searchQuery ? 'Try a different search term.' : 'Add some to get started.'}
      </div>
    {:else}
      <ul class="divide-y divide-zinc-800">
        {#each filteredPrompts as prompt (prompt.id)}
          <li class="p-4 hover:bg-zinc-800/30 transition-colors">
            <div class="flex items-start justify-between">
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="font-medium text-zinc-300">{prompt.title}</h3>
                  <span class="px-2 py-0.5 text-xs rounded-full bg-zinc-800 text-zinc-400">
                    {promptTypes.find(t => t.id === prompt.type)?.name}
                  </span>
                </div>
                
                <div class="mt-2 text-sm text-zinc-500">
                  <p class="line-clamp-2">
                    {prompt.prompt}
                  </p>
                </div>
                
                <div class="mt-2 flex items-center gap-3 text-xs text-zinc-500">
                  <span>{prompt.model}</span>
                  <span class="text-zinc-700">•</span>
                  <span>Used {prompt.uses} times</span>
                  <span class="text-zinc-700">•</span>
                  <span>Added {prompt.created_at}</span>
                </div>
              </div>
              
              <div class="flex-shrink-0 flex gap-1">
                <button
                  onclick={() => copyPrompt(prompt.prompt)}
                  class="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
                  aria-label="Copy prompt"
                >
                  <CopySimple weight="bold" class="h-4 w-4" />
                </button>
                
                <button
                  onclick={() => editingPrompt = prompt.id}
                  class="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
                  aria-label="Edit prompt"
                >
                  <PencilSimple weight="bold" class="h-4 w-4" />
                </button>
                
                <button
                  onclick={() => deletePrompt(prompt.id)}
                  class="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-red-400 transition-colors"
                  aria-label="Delete prompt"
                >
                  <Trash weight="bold" class="h-4 w-4" />
                </button>
              </div>
            </div>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>