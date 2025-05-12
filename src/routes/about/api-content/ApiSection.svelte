<!-- src/routes/about/api-content/ApiSection.svelte -->
<script lang="ts">
  import { Code, ArrowRight } from 'phosphor-svelte';
</script>

<div class="grid md:grid-cols-2 gap-12 items-center">
  <!-- API Text -->
  <div>
    <div class="flex items-center gap-3 mb-4">
      <div class="p-2 bg-primary/10 border border-primary/20">
        <Code weight="bold" class="h-5 w-5 text-primary" />
      </div>
      <h2 class="text-3xl font-light text-foreground">API Access</h2>
    </div>
    
    <div class="space-y-6 text-muted-foreground leading-relaxed">
      <p>
        Build with our structured space news data. The SpaceFomo API provides developers with 
        access to our curated articles, FOMO scores, and entity relationships.
      </p>
      
      <p>
        Perfect for creating space industry dashboards, specialized applications, or embedding 
        space news in your own projects.
      </p>
      
      <div class="mt-8">
        <a 
          href="/api/v1/news" 
          class="group relative inline-flex items-center gap-2 px-4 py-2 
                 bg-primary text-primary-foreground
                 transition-all hover:bg-primary/90 active:scale-95
                 before:absolute before:inset-0
                 before:border before:border-primary/50
                 before:translate-x-0.5 before:translate-y-0.5
                 before:transition-transform before:duration-300
                 hover:before:translate-x-0 hover:before:translate-y-0
                 cursor-pointer"
        >
          <span>Explore the API</span>
          <ArrowRight class="h-4 w-4" />
        </a>
      </div>
    </div>
  </div>
  
  <!-- Code Snippet -->
  <div class="relative">
    <div class="p-1 bg-card border border-border">
      <div class="bg-background p-6 font-mono text-sm overflow-auto max-h-80 text-muted-foreground">
        <div class="mb-4 text-primary"># Fetching space news with FOMO scores</div>
        <div>fetch(<span class="text-primary">'https://spacefomo.com/api/v1/news?min_score=75'</span>)</div>
        <div>&nbsp;&nbsp;.then(<span class="text-venus-orange">response</span> => <span class="text-venus-orange">response</span>.json())</div>
        <div>&nbsp;&nbsp;.then(<span class="text-venus-orange">data</span> => {</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;console.log(<span class="text-venus-orange">data</span>);</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-venus-rust">// Response structure</span></div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-foreground">{</span></div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-primary">"items"</span>: [</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-primary">"id"</span>: 42,</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-primary">"title"</span>: <span class="text-primary">"SpaceX Launches Starship SN20"</span>,</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-primary">"fomo_score"</span>: 89,</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-primary">"summary"</span>: <span class="text-primary">"SpaceX launched..."</span>,</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-primary">"entities"</span>: {...},</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-primary">"tags"</span>: [<span class="text-primary">"launch"</span>, <span class="text-primary">"starship"</span>]</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;}</div>
        <div>&nbsp;&nbsp;});</div>
      </div>
    </div>
    
    <!-- Decorative Elements -->
    <div class="absolute -top-3 -right-3 w-24 h-24 border-t-2 border-r-2 border-primary/30"></div>
    <div class="absolute -bottom-3 -left-3 w-24 h-24 border-b-2 border-l-2 border-primary/30"></div>
  </div>
</div>