<!-- src/routes/about/+page.svelte -->
<script lang="ts">
  import AboutHero from "./sections/Hero.svelte";
  import Mission from "./sections/Mission.svelte";
  import FeatureList from "./sections/FeatureList.svelte";
  // import ApiSection from "./api-content/ApiSection.svelte";
  import FounderSection from "./sections/FounderSection.svelte";
  import EmailForm from "$lib/components/cta/email/EmailForm.svelte";
</script>


<div class="min-h-screen">
  <!-- Hero Section -->
  <AboutHero />
  
  <!-- Mission Section -->
  <section class="bg-card py-20">
    <div class="container mx-auto px-6">
      <Mission />
    </div>
  </section>
  
  <!-- Features Section -->
  <section class="py-20">
    <div class="container mx-auto px-6">
      <FeatureList />
    </div>
  </section>
  
  <!-- API Section -->
  <section class="bg-card py-20">
    <div class="container mx-auto px-6">
      <!-- <ApiSection /> -->
    </div>
  </section>
  
  <!-- Founder Section -->
  <section class="py-20">
    <div class="container mx-auto px-6">
      <FounderSection />
    </div>
  </section>
  
  <!-- Newsletter -->
  <section class="bg-background py-16 border-t border-border">
    <div class="container mx-auto px-6 max-w-xl text-center">
      <h2 class="text-3xl font-light mb-6 text-foreground">Stay in Orbit</h2>
      <p class="text-muted-foreground mb-8">
        Get weekly digests of the most important space news with FOMO scores, 
        curated and condensed for busy space enthusiasts.
      </p>
      <div class="max-w-sm mx-auto">
        <EmailForm />
      </div>
    </div>
  </section>
</div>