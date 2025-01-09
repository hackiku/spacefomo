<!-- src/lib/components/Hero.svelte -->
<script lang="ts">
  import EmailForm from './cta/EmailForm.svelte';
  import SocialProof from './proof/SocialProof.svelte';
</script>

<div class="relative pt-12 flex items-center px-6">
  <!-- Animated background grid - theme aware -->
  <div class="absolute inset-0 
              dark:bg-[linear-gradient(transparent_0%,_rgba(0,0,0,0.8)_50%),_linear-gradient(to_right,rgba(100,100,100,0.1)_1px,transparent_1px),_linear-gradient(rgba(100,100,100,0.1)_1px,transparent_1px)]
              bg-[linear-gradient(transparent_0%,_rgba(255,255,255,0.8)_50%),_linear-gradient(to_right,rgba(100,100,100,0.1)_1px,transparent_1px),_linear-gradient(rgba(100,100,100,0.1)_1px,transparent_1px)]
              bg-[size:100%_100%,24px_24px,24px_24px] 
              [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
  
  <div class="container max-w-6xl mx-auto relative">
    <div class="grid lg:grid-cols-5 gap-12 items-center">
      <!-- Left Content - spans 3 columns -->
      <div class="lg:col-span-3 space-y-8">
        <div class="space-y-4">
          <h1 class="text-5xl md:text-6xl font-bold">
            <span class="text-transparent bg-clip-text 
                       bg-gradient-to-r from-zinc-900 to-zinc-600
                       dark:from-white dark:to-zinc-400">
              Space News for
            </span>
            <br />
            <span class="text-transparent bg-clip-text 
                       bg-gradient-to-r from-violet-600 to-fuchsia-600
                       dark:from-violet-400 dark:to-fuchsia-500">
              Busy Humans
            </span>
          </h1>
          <p class="text-xl text-zinc-600 dark:text-zinc-400">
            Intel you can't miss in 100 words a pop. 
          </p>
        </div>

        <!-- Email signup with social proof -->
        <div class="space-y-6 max-w-sm">
          <EmailForm />
          <SocialProof showReaderCount={false} showSubscribers={true} />
        </div>
      </div>

      <!-- Right side - placeholder for FOMO Score -->
      <div class="lg:col-span-2 h-full" />
    </div>
  </div>
</div>