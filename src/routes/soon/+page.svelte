<!-- src/routes/soon/+page.svelte -->
<script lang="ts">
  import Hero from './Hero.svelte';
  import EmailForm from '$lib/components/email/EmailForm.svelte';
  import SmallCard from '$lib/features/news/card/SmallCard.svelte';
  import { newsStore } from '$lib/stores/newsStore';
  
  // Sample news article for preview card
  const previewArticle = {
    id: 'preview-1',
    title: "Russia's plasma engine could reach Mars in 30 days, drastically reduce space travel time",
    viral_title: "New plasma engine cuts Mars travel to just 30 days",
    source: "Interesting Engineering",
    publication_date: new Date("2025-02-10"),
    fomo_score: 92,
    impact_score: 87,
    tags: ["plasma propulsion", "Mars", "Russia", "space travel"],
    entities: {
      people: [
        { name: "Egor Biriulin", role: "Junior Researcher" },
        { name: "Alexei Voronov", role: "First Deputy General Director" },
        { name: "Konstantin Gutorov", role: "Scientific Adviser" }
      ],
      organizations: [
        { name: "Rosatom", role: "developer" }
      ]
    },
    context: {
      timeline: {
        phase: "prototype_testing",
        flight_model_target: "2030"
      }
    }
  };
</script>

<div class="flex min-h-screen flex-col bg-zinc-950 text-white">
  <div class="relative flex-1 overflow-hidden">
    <!-- Hero Section -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10">
      <div class="max-w-3xl mx-auto text-center">
        <Hero />
        
        <div class="mt-12 max-w-xl mx-auto">
          <p class="text-lg md:text-xl text-zinc-400 mb-8">
            Space news sent daily, digested by AI. Summaries with FOMO scores—how much will you dread being out of the loop.
          </p>
          
          <div class="mt-8">
            <EmailForm />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Preview Card (positioned off-screen initially) -->
    <div 
      class="absolute -bottom-24 -left-12 w-72 transform rotate-12 transition-all duration-300 cursor-pointer hover:rotate-0 hover:-translate-y-24 hover:translate-x-8 z-20 group"
    >
      <div class="scale-75 group-hover:scale-100 transition-transform duration-300 origin-bottom-left">
        <SmallCard article={previewArticle} />
      </div>
    </div>
    
    <!-- Background gradient orbs -->
    <div class="absolute top-10 right-10 w-96 h-96 rounded-full bg-violet-500/10 filter blur-3xl"></div>
    <div class="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-fuchsia-500/10 filter blur-3xl"></div>
  </div>
  
  <!-- Footer -->
  <footer class="py-8 text-center text-zinc-500 text-sm">
    <p>© {new Date().getFullYear()} SpaceFomo. All rights reserved.</p>
  </footer>
</div>