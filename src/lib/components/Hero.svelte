<!-- src/lib/components/Hero.svelte -->
<script lang="ts">
  import EmailForm from './cta/EmailForm.svelte';
  import WeeklyFomo from '../features/fomo/WeeklyFomo.svelte';
</script>

<div class="relative py-10">
  <!-- Background accent lines -->
  <div class="absolute inset-0 overflow-hidden">
    <div class="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent" />
    <div class="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent" />
  </div>

  <div class="container relative">
    <div class="grid grid-cols-12 gap-8">
      <!-- Left Content -->
      <div class="relative col-span-12 lg:col-span-7 lg:col-start-2">
        <!-- Corner accents -->
        <div class="absolute -top-4 -left-4 w-8 h-8 border-l-2 border-t-2 border-blue-500/50" />
        <div class="absolute -bottom-4 -right-4 w-8 h-8 border-r-2 border-b-2 border-blue-500/50" />
        
        <!-- Title with glowing effect -->
        <h1 class="relative mb-8">
          <span class="absolute inset-0 text-6xl font-bold text-blue-500/20 blur-sm">
            Space race weekly missing out relief
          </span>
          <span class="relative text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-100 via-blue-300 to-blue-100 leading-tight tracking-tight">
            Space race weekly missing out relief
          </span>
        </h1>

        <!-- Subtitle with terminal style -->
        <p class="relative text-2xl text-blue-500/70 leading-relaxed mb-12 font-mono">
          <span class="text-blue-400">>></span> Hottest news <span class="text-blue-300">1 minute</span> a pop.
        </p>

        <!-- Email form container with extra styling -->
        <div class="relative max-w-md">
          <div class="absolute -inset-4 bg-blue-500/5" />
          <EmailForm />
        </div>
      </div>

      <!-- Right Animation -->
      <div class="relative col-span-12 lg:col-span-3 lg:col-start-9">
        <!-- Glowing connector lines -->
        <div class="absolute -top-12 left-1/2 w-px h-24 bg-gradient-to-b from-transparent via-blue-500/30 to-transparent" />
        <div class="absolute -bottom-12 left-1/2 w-px h-24 bg-gradient-to-b from-transparent via-blue-500/30 to-transparent" />
        
        <div class="w-full max-w-sm mx-auto">
          <WeeklyFomo />
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  /* Optional: Add subtle scan line effect */
  .container::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(59, 130, 246, 0.03) 2px,
      rgba(59, 130, 246, 0.03) 4px
    );
    pointer-events: none;
  }
</style>