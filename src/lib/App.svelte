<!-- src/lib/App.svelte -->
<script lang="ts">
  import Timeline from './features/fomo/week/Timeline.svelte';
  import EmailForm from './components/cta/email/EmailForm.svelte';
  import News from './features/news/News.svelte';
</script>

<div class="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-32">
  <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_1.5fr] gap-6">
    <!-- Left column: Hero + Timeline -->
    <div>
      <!-- Hero section -->
      <div class="pt-36">
        <div class="max-w-sm space-y-5">
          <h1 class="text-indigo-100/80 text-3xl leading-relaxed">
            Space race missing out relief in ~100 words a pop
          </h1>
          <EmailForm />
        </div>
      </div>

      <!-- Timeline section with sticky behavior -->
      <div class="relative">
        <div class="sticky top-6">
          <Timeline />
        </div>
      </div>
    </div>

    <!-- Right column: News feed -->
    <div class="py-24">
      <News />
    </div>
  </div>
</div>

<style>
  /* Remove any scroll-related styles */
  :global(html) {
    overflow-y: auto;
  }
</style>