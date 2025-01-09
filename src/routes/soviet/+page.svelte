<!-- src/routes/soviet/+page.svelte -->
<script lang="ts">
  import WeekPicker from '$lib/components/WeekPicker.svelte';
  import Card from '$lib/features/news/Card.svelte';
  import { featuredNews } from '$lib/data/newsData';
</script>



<div class="relative py-12 bg-[#1a1b12] text-[#e9d89c]">
  <div class="container max-w-6xl mx-auto px-8 md:px-12">
    <!-- Editorial grid layout -->
    <div class="grid grid-cols-12 gap-8">
      <!-- Main headline section -->
      <div class="col-span-12 lg:col-span-8 border-b-2 border-[#cd3d21] pb-8">
        <h1 class="mb-6">
          <span class="block text-4xl font-black uppercase text-[#e9d89c] leading-none">
            Space news AI digest
          </span>
          <span class="block text-6xl font-black uppercase text-[#cd3d21] leading-none -mt-2">
            no missing out
          </span>
          <span class="block text-xl text-[#e9d89c]/70 mt-4">
            Each week's most essential space news <span class="text-[#cd3d21]">in 100 words</span>
          </span>
        </h1>

        <div class="max-w-full">
          <!-- Subscription module -->
          <form class="flex gap-4">
            <input 
              type="email" 
              placeholder="ENTER EMAIL" 
              class="flex-1 px-4 py-3 bg-transparent border-2 border-[#e9d89c]/20 
                     text-[#e9d89c] placeholder-[#e9d89c]/30 focus:outline-none 
                     focus:border-[#cd3d21] uppercase tracking-wide"
            />
            <button 
              type="submit" 
              class="px-8 py-3 bg-[#cd3d21] text-[#e9d89c] font-bold uppercase 
                     tracking-widest hover:bg-[#cd3d21]/90 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <!-- FOMO Score section -->
      <div class="col-span-12 lg:col-span-4 relative">
        <div class="sticky top-8">
          <div class="relative">
            <!-- Circular score display -->
            <div class="aspect-square bg-[#cd3d21] rounded-full p-1">
              <div class="h-full rounded-full border border-[#e9d89c]/20 flex flex-col items-center justify-center">
                <div class="text-8xl font-black text-[#e9d89c] leading-none">86</div>
                <div class="mt-2 text-xs tracking-[0.3em] text-[#e9d89c]/90 font-bold">
                  FOMO SCORE
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Week Selector -->
<div class="py-16">
  <WeekPicker />
</div>

<!-- Featured Card (partially visible) -->
<div class="container max-w-6xl mx-auto px-8 md:px-12 -mt-32">
  <Card item={featuredNews} />
</div>

<style>
  /* Subtle paper texture */
  :global(body) {
		background: #1a1b12;
	}

	.container::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E");
    opacity: 0.08;
    pointer-events: none;
  }
</style>