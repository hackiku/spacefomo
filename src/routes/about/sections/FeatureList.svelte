<!-- src/routes/about/sections/FeatureList.svelte -->
<script lang="ts">
  import { ChartLine, Brain, Rss, Gauge, Share } from 'phosphor-svelte';
  
  const features = [
    {
      icon: ChartLine,
      title: "FOMO Scores",
      description: "Our proprietary algorithm evaluates space news on its significance, ranking stories by how much you'd regret missing them."
    },
    {
      icon: Brain,
      title: "AI-Powered Summaries",
      description: "Complex articles distilled into bite-sized ~100 word summaries that capture the essential information."
    },
    {
      icon: Rss,
      title: "Weekly Digest",
      description: "Stay informed with our curated weekly newsletter highlighting the most impactful space developments."
    },
    {
      icon: Gauge,
      title: "Real-time Updates",
      description: "Track industry trends through our interactive timeline showing FOMO patterns across space sectors."
    },
    {
      icon: Share,
      title: "Community Contributions",
      description: "Users can submit interesting space news they've discovered, building a collaborative knowledge base."
    }
  ];
</script>

<div class="max-w-3xl mx-auto">
  <div class="text-center mb-16">
    <h2 class="text-3xl font-light mb-4 text-foreground">Key Features</h2>
    <p class="text-muted-foreground text-lg max-w-xl mx-auto">
      SpaceFomo combines cutting-edge technology with thoughtful curation to keep you in the loop.
    </p>
  </div>
  
  <div class="grid md:grid-cols-2 gap-8">
    {#each features as feature}
      <div class="group relative border border-border hover:border-primary/30 transition-colors 
                 bg-card/50 hover:bg-card p-6
                 before:absolute before:inset-0
                 before:border before:border-primary/0
                 before:translate-x-0.5 before:translate-y-0.5
                 before:transition-transform before:duration-300
                 hover:before:border-primary/10
                 hover:before:translate-x-0 hover:before:translate-y-0">
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0 p-2 border border-border bg-muted text-primary">
            <svelte:component this={feature.icon} weight="bold" class="h-5 w-5" />
          </div>
          
          <div>
            <h3 class="text-lg font-medium text-foreground mb-2">{feature.title}</h3>
            <p class="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
          </div>
        </div>
      </div>
    {/each}
  </div>
  
  <!-- Coming Soon Badge -->
  <div class="mt-12 text-center">
    <div class="inline-block bg-primary/10 border border-primary/20 px-4 py-2 text-primary">
      <span class="text-sm font-medium">Coming soon: Sponsored news opportunities</span>
    </div>
  </div>
</div>