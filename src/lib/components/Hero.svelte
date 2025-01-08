<!-- src/lib/components/Hero.svelte -->
<script lang="ts">
  import EmailForm from './cta/EmailForm.svelte';
  import WeeklyFomo from '../features/fomo/WeeklyFomo.svelte';
</script>

<div class="relative flex items-start py-12">
  <div class="container">
    <div class="grid grid-cols-12 gap-8">
      <!-- Left Content -->
      <div class="col-span-12 lg:col-span-7 lg:col-start-2">
        <h1 class="text-6xl font-medium text-foreground tracking-tight leading-tight mb-8">
          Space industry<br />FOMO relief
        </h1>

        <p class="text-2xl text-muted-foreground leading-relaxed mb-8">
          Weekly space news digest in 1 minute a pop.
        </p>

        <div class="max-w-md">
          <EmailForm />
        </div>
      </div>

      <!-- Right Animation -->
      <div class="relative col-span-12 lg:col-span-3 lg:col-start-9 lg:mt-auto">
        <div class="w-full max-w-sm mx-auto">
          <WeeklyFomo />
        </div>
      </div>
    </div>
  </div>
</div>