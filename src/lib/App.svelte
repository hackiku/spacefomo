<!-- src/lib/App.svelte -->
<script lang="ts">
	import Timeline from './features/fomo/week/Timeline.svelte'
	import EmailForm from './components/cta/email/EmailForm.svelte'
  // Mock data for testing scroll
  const mockNews = Array(10).fill(null).map((_, i) => ({
    id: i,
    title: `News Item ${i + 1}`,
    source: 'Space.com',
    readTime: '2 min read'
  }));

  const mockWeeks = Array(8).fill(null).map((_, i) => ({
    id: i,
    score: 85 - (i * 5)
  }));
</script>

  <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_1.5fr] gap-6 p-4
						max-w-[1920px] px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-32">
    <!-- Left column: Hero + Timeline -->
    <div class="space-y-12">
      <!-- Hero section -->
      <div class="sticky top-0 pt-24 pb-12">
        <div class="max-w-sm space-y-5">
          <h1 class="text-indigo-100/80 text-3xl leading-relaxed">
            Space race missing out relief in ~100 words a pop
          </h1>
          
          <!-- Email form placeholder -->
					<EmailForm />
        </div>
      </div>

      <!-- Timeline section -->
			 <Timeline />
    </div>

    <!-- Right column: News feed with separate scroll -->
    <div class="lg:h-screen lg:overflow-y-auto lg:sticky lg:top-0 space-y-4 hide-scrollbar">
      <div class="h-24 lg:h-32" /> <!-- Top spacing -->
      {#each mockNews as article}
        <div 
          class="p-6 border border-zinc-800/50 rounded-lg hover:border-zinc-700/50
                 bg-zinc-900/50 backdrop-blur-sm transition-colors"
        >
          <div class="flex justify-between items-start gap-6">
            <div class="space-y-3 flex-1">
              <h2 class="text-xl font-medium text-zinc-100">
                {article.title}
              </h2>
              <div class="flex items-center gap-4 text-sm text-zinc-500">
                <span>{article.source}</span>
                <span>•</span>
                <span>{article.readTime}</span>
              </div>
            </div>
            
            <!-- FOMO score -->
            <div class="text-2xl font-bold bg-clip-text text-transparent
                        bg-gradient-to-br from-violet-400 to-fuchsia-500">
              {85 - (article.id * 3)}
            </div>
          </div>
        </div>
      {/each}
      <div class="h-[200vh]" /> <!-- Extra scroll space -->
    </div>
  </div>
