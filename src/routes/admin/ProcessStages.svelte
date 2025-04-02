<!-- src/routes/admin/ProcessStages.svelte -->
<script lang="ts">
  import { ArrowClockwise, ArrowRight, BookmarkSimple, Brain, CheckCircle, CopySimple, FloppyDisk, Robot, SpinnerGap, X } from 'phosphor-svelte';
  
  let { article, onReset } = $props<{
    article: any;
    onReset: () => void;
  }>();
  
  // Processing stages
  const stages = [
    { id: 'extract', name: 'Extract Content', icon: BookmarkSimple, aiProvider: 'GPT-4o' },
    { id: 'entities', name: 'Extract Entities', icon: Brain, aiProvider: 'Cohere' },
    { id: 'summary', name: 'Generate Summary', icon: Robot, aiProvider: 'Claude' },
    { id: 'fomo', name: 'Calculate FOMO', icon: Brain, aiProvider: 'GPT-4o' }
  ];
  
  // Stage status tracking
  let stageStatus = $state({
    extract: { status: 'idle', result: null },
    entities: { status: 'idle', result: null },
    summary: { status: 'idle', result: null },
    fomo: { status: 'idle', result: null }
  });
  
  let activeStage = $state('extract');
  let editMode = $state<string | null>(null);
  let editContent = $state('');
  
  // Mocked processing function
  async function processStage(stageId: string) {
    stageStatus[stageId].status = 'loading';
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock results
    const results = {
      extract: "SpaceX's Starship orbital test flight was a major success, demonstrating the vehicle's ability to reach orbit and return...",
      entities: { 
        organizations: ["SpaceX", "NASA"], 
        people: [{ name: "Elon Musk", role: "CEO" }],
        technologies: ["Starship", "Super Heavy booster"] 
      },
      summary: {
        text: "SpaceX's Starship completed its most successful test flight to date, reaching orbit before returning for a controlled landing in the Gulf of Mexico. This milestone brings the company closer to its Mars mission goals and NASA's Artemis program lunar landing plans.",
        viralTitle: "SpaceX's Starship Aces Orbital Test, Mars Gets Closer 🚀"
      },
      fomo: { score: 87, factors: { significance: 0.9, novelty: 0.85, impact: 0.87 } }
    };
    
    stageStatus[stageId].result = results[stageId];
    stageStatus[stageId].status = 'success';
    
    // Automatically move to next stage
    if (stageId !== 'fomo') {
      const currentIndex = stages.findIndex(s => s.id === stageId);
      if (currentIndex < stages.length - 1) {
        activeStage = stages[currentIndex + 1].id;
      }
    }
  }
  
  function editStageContent(stageId: string) {
    editMode = stageId;
    editContent = JSON.stringify(stageStatus[stageId].result, null, 2);
  }
  
  function saveEditedContent() {
    if (!editMode) return;
    
    try {
      const parsed = JSON.parse(editContent);
      stageStatus[editMode].result = parsed;
      editMode = null;
    } catch (e) {
      // Handle parsing error
      console.error("Invalid JSON:", e);
    }
  }
  
  function resetProcess() {
    stageStatus = {
      extract: { status: 'idle', result: null },
      entities: { status: 'idle', result: null },
      summary: { status: 'idle', result: null },
      fomo: { status: 'idle', result: null }
    };
    activeStage = 'extract';
    editMode = null;
    onReset();
  }
  
  function savePrompt(stageId: string) {
    // This would save the current prompt to the library
    // For now, just show success
    alert(`Saved prompt for ${stageId} stage`);
  }
  
  // Check if all stages are complete
  let allComplete = $derived(Object.values(stageStatus).every(s => s.status === 'success'));
</script>

<div class="bg-zinc-900/80 rounded-xl border border-zinc-800 overflow-hidden">
  <div class="p-4 border-b border-zinc-800 flex items-center justify-between">
    <h2 class="font-medium text-zinc-200">Process Article</h2>
    
    <div class="flex items-center gap-2">
      <button
        onclick={resetProcess}
        class="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 
               text-zinc-400 hover:text-zinc-300 transition-colors"
        aria-label="Reset process"
      >
        <ArrowClockwise weight="bold" class="h-4 w-4" />
      </button>
      
      {#if allComplete}
        <button
          class="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 
                 hover:bg-emerald-500/30 transition-colors flex items-center gap-1.5"
        >
          <CheckCircle weight="bold" class="h-4 w-4" />
          <span>Publish</span>
        </button>
      {/if}
    </div>
  </div>
  
  <!-- Progress Stepper -->
  <div class="p-4 border-b border-zinc-800 flex items-center gap-1">
    {#each stages as stage, i}
      <button
        class="flex-1 flex flex-col items-center pt-2 pb-3 px-2 rounded-lg
               {activeStage === stage.id 
                 ? 'bg-violet-500/20 text-violet-300' 
                 : stageStatus[stage.id].status === 'success'
                   ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                   : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-400'
               } transition-all"
        onclick={() => {
          if (stageStatus[stage.id].status === 'success' || 
              (i > 0 && stageStatus[stages[i-1].id].status === 'success')) {
            activeStage = stage.id;
          }
        }}
      >
        <div class="relative mb-1">
          {#if stageStatus[stage.id].status === 'loading'}
            <SpinnerGap weight="bold" class="h-5 w-5 animate-spin" />
          {:else if stageStatus[stage.id].status === 'success'}
            <CheckCircle weight="fill" class="h-5 w-5" />
          {:else}
            <svelte:component this={stage.icon} weight="bold" class="h-5 w-5" />
          {/if}
        </div>
        <span class="text-xs">{stage.name}</span>
      </button>
      
      {#if i < stages.length - 1}
        <div class="h-px w-6 bg-zinc-800 mt-1"></div>
      {/if}
    {/each}
  </div>
  
  <!-- Stage Content -->
  <div class="p-4">
    {#each stages as stage}
      {#if activeStage === stage.id}
        <div>
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <svelte:component this={stage.icon} weight="duotone" class="h-6 w-6 text-violet-400" />
              <h3 class="font-medium text-lg text-zinc-200">{stage.name}</h3>
            </div>
            
            <div class="px-2 py-1 rounded-lg bg-zinc-800 text-xs text-zinc-400">
              Using {stage.aiProvider}
            </div>
          </div>
          
          {#if stageStatus[stage.id].status === 'idle'}
            <div class="p-6 border border-zinc-800 rounded-lg bg-black/20">
              <p class="text-zinc-400 mb-4">
                Ready to {stage.name.toLowerCase()}. Click the button below to start processing.
              </p>
              
              <button
                onclick={() => processStage(stage.id)}
                class="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg
                       flex items-center gap-2"
              >
                <Robot weight="bold" class="h-5 w-5" />
                <span>Process with {stage.aiProvider}</span>
              </button>
            </div>
          {:else if stageStatus[stage.id].status === 'loading'}
            <div class="p-6 border border-dashed border-zinc-700 rounded-lg bg-black/10">
              <div class="flex flex-col items-center justify-center py-8">
                <SpinnerGap weight="bold" class="h-10 w-10 text-violet-500 animate-spin mb-4" />
                <p class="text-zinc-400">Processing with {stage.aiProvider}...</p>
              </div>
            </div>
          {:else if stageStatus[stage.id].status === 'success'}
            {#if editMode === stage.id}
              <div class="p-4 border border-violet-500/30 rounded-lg bg-violet-500/5">
                <textarea
                  bind:value={editContent}
                  class="w-full h-80 p-4 font-mono text-sm bg-black/30 text-zinc-300 
                         border border-zinc-700 rounded-lg"
                ></textarea>
                
                <div class="flex justify-end gap-2 mt-4">
                  <button
                    onclick={() => editMode = null}
                    class="px-3 py-1.5 rounded-lg border border-zinc-700 
                           text-zinc-400 hover:bg-zinc-800 transition-colors"
                  >
                    Cancel
                  </button>
                  
                  <button
                    onclick={saveEditedContent}
                    class="px-3 py-1.5 rounded-lg bg-violet-600 
                           hover:bg-violet-500 text-white transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            {:else}
              <div class="relative p-4 border border-zinc-800 rounded-lg bg-black/20">
                <pre class="text-sm text-zinc-300 font-mono overflow-auto max-h-80 whitespace-pre-wrap">
                  {JSON.stringify(stageStatus[stage.id].result, null, 2)}
                </pre>
                
                <div class="absolute top-2 right-2 flex gap-1">
                  <button
                    onclick={() => editStageContent(stage.id)}
                    class="p-1.5 rounded-lg bg-zinc-800/70 hover:bg-zinc-700 
                           text-zinc-400 hover:text-zinc-300 transition-colors"
                    aria-label="Edit content"
                  >
                    <FloppyDisk weight="bold" class="h-4 w-4" />
                  </button>
                  
                  <button
                    onclick={() => savePrompt(stage.id)}
                    class="p-1.5 rounded-lg bg-zinc-800/70 hover:bg-zinc-700 
                           text-zinc-400 hover:text-zinc-300 transition-colors"
                    aria-label="Save prompt"
                  >
                    <BookmarkSimple weight="bold" class="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {#if stage.id !== 'fomo'}
                <div class="mt-6 flex justify-end">
                  <button
                    onclick={() => {
                      const currentIndex = stages.findIndex(s => s.id === stage.id);
                      if (currentIndex < stages.length - 1) {
                        activeStage = stages[currentIndex + 1].id;
                      }
                    }}
                    class="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500
                           text-white flex items-center gap-2 transition-colors"
                  >
                    <span>Next Step</span>
                    <ArrowRight weight="bold" class="h-5 w-5" />
                  </button>
                </div>
              {/if}
            {/if}
          {/if}
        </div>
      {/if}
    {/each}
  </div>
</div>