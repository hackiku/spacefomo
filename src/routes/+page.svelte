<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Timeline from '$lib/features/fomo/week/Timeline.svelte';
  import EmailForm from '$lib/components/cta/email/EmailForm.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import News from '$lib/features/news/News.svelte';
  // import SendNews from '$lib/components/cta/send/SendNews.svelte;

</script>

<div class="min-h-screen">
	
	<Hero />

	<div class="grid-layout">
		<div class="grid-area-email py-20">
			controls
			// 3 grid icon selctor row 
			// s
		</div>
    <!-- Main content areas -->
    <div class="grid-area-timeline">
      <Timeline />
    </div>

    <div class="grid-area-news">
      <News />
    </div>
  </div>
</div>

<style>
  /* Base grid layout */
  .grid-layout {
    display: grid;
    gap: 1.5rem;
    max-width: 1920px;
    margin: 0 auto;
    padding: 1rem;
    
    /* Mobile: Stack everything */
    grid-template-areas:
      "email"
      "news"
      "timeline";
  }

  /* Tablet layout */
  @media (min-width: 768px) {
    .grid-layout {
      padding: 2rem;
      grid-template-columns: 1fr 1fr;
      grid-template-areas:
        "email email"
        "news news"
        "timeline timeline";
    }
  }

  /* Desktop layout */
  @media (min-width: 1024px) {
    .grid-layout {
      padding: 2rem 4rem;
      grid-template-columns: minmax(300px, 1fr) minmax(0, 2fr);
      grid-template-rows: auto 1fr;
      grid-template-areas:
        "email news"
        "timeline news";
    }
  }

  /* Apply grid areas */
  .grid-area-email { grid-area: email; }
  .grid-area-timeline { grid-area: timeline; }
  .grid-area-news { grid-area: news; }
</style>