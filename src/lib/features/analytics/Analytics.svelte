<!-- src/lib/features/analytics/Analytics.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { Card } from "$lib/components/ui/card";
  import { wellSteepness, wellDepth, wellSize } from '$lib/stores/fomoStore';
  import { NEWS_ITEMS } from '$lib/data/news';

  let points: { x: number, y: number, score: number }[] = [];
  let width = 800;
  let height = 400;

  // Generate points based on news items
  $: {
    points = NEWS_ITEMS.map((item, i) => {
      const angle = (i / NEWS_ITEMS.length) * Math.PI * 2;
      const distance = Math.sqrt(100 - (item.score / 100)) * 100;
      return {
        x: Math.cos(angle) * distance + width/2,
        y: Math.sin(angle) * distance + height/2,
        score: item.score
      };
    });
  }
</script>

<section class="bg-zinc-900/50 border-t border-white/5">
  <div class="container py-20">
    <div class="max-w-2xl mx-auto mb-12 text-center">
      <h2 class="text-3xl font-medium mb-4">Space FOMO Analytics</h2>
      <p class="text-zinc-400">Visualizing the gravitational pull of space news across time</p>
    </div>

    <Card class="p-8 bg-black/20 backdrop-blur">
      <div class="flex gap-8">
        <!-- Analytics visualization -->
        <div class="flex-1">
          <svg 
            width={width} 
            height={height} 
            class="w-full h-full"
            viewBox="0 0 {width} {height}"
          >
            <!-- Gradient definitions -->
            <defs>
              <radialGradient id="well-gradient">
                <stop offset="0%" stop-color="rgb(139, 92, 246)" stop-opacity="0.5" />
                <stop offset="100%" stop-color="rgb(139, 92, 246)" stop-opacity="0" />
              </radialGradient>
            </defs>

            <!-- Grid lines -->
            {#each Array(10) as _, i}
              <circle 
                cx={width/2}
                cy={height/2}
                r={i * 40}
                class="fill-none stroke-white/5"
              />
            {/each}

            <!-- "Gravity well" effect -->
            <circle
              cx={width/2}
              cy={height/2}
              r={$wellSize * 200}
              class="fill-violet-500/10"
            />

            <!-- News points -->
            {#each points as point}
              <g transform="translate({point.x}, {point.y})">
                <circle 
                  r={4}
                  class="fill-violet-400"
                />
                <circle 
                  r={20}
                  class="fill-violet-400/20 animate-pulse"
                />
              </g>
            {/each}
          </svg>
        </div>

        <!-- Stats -->
        <div class="w-64 space-y-8">
          <div>
            <div class="text-sm text-zinc-500 mb-1">FOMO Gravity</div>
            <div class="text-2xl font-medium">{($wellDepth * 100).toFixed(0)}%</div>
          </div>
          
          <div>
            <div class="text-sm text-zinc-500 mb-1">News Density</div>
            <div class="text-2xl font-medium">{NEWS_ITEMS.length} stories</div>
          </div>

          <div>
            <div class="text-sm text-zinc-500 mb-1">Average Score</div>
            <div class="text-2xl font-medium">
              {(NEWS_ITEMS.reduce((acc, item) => acc + item.score, 0) / NEWS_ITEMS.length).toFixed(1)}
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
</section>