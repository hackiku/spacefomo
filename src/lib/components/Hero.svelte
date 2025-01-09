<!-- src/lib/components/Hero.svelte -->
<script lang="ts">
  import EmailForm from './cta/EmailForm.svelte';
  import WeeklyFomo from '../features/fomo/WeeklyFomo.svelte';
  import SocialProof from './proof/SocialProof.svelte';
</script>

<div class="relative min-h-[80vh] flex items-center px-6">
  <!-- Animated background grid - theme aware -->
  <div class="absolute inset-0 
              dark:bg-[linear-gradient(transparent_0%,_rgba(0,0,0,0.8)_50%),_linear-gradient(to_right,rgba(100,100,100,0.1)_1px,transparent_1px),_linear-gradient(rgba(100,100,100,0.1)_1px,transparent_1px)]
              light:bg-[linear-gradient(transparent_0%,_rgba(255,255,255,0.8)_50%),_linear-gradient(to_right,rgba(100,100,100,0.1)_1px,transparent_1px),_linear-gradient(rgba(100,100,100,0.1)_1px,transparent_1px)]
              bg-[size:100%_100%,24px_24px,24px_24px] 
              [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />

  <!-- Live activity indicator moved to SocialProof -->
  <div class="absolute top-8 left-6">
    <SocialProof activeReaders={142} showReaderCount={true} showSubscribers={false} />
  </div>

  <div class="container max-w-5xl mx-auto relative">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <!-- Left Content -->
      <div class="space-y-8">
        <div class="space-y-4">
          <h1 class="text-5xl md:text-6xl font-bold">
            <span class="text-transparent bg-clip-text 
                         dark:bg-gradient-to-r dark:from-white dark:to-zinc-400
                         light:bg-gradient-to-r light:from-zinc-900 light:to-zinc-600">
              Space News for
            </span>
            <br />
            <span class="text-transparent bg-clip-text 
                         dark:bg-gradient-to-r dark:from-violet-400 dark:to-fuchsia-500
                         light:bg-gradient-to-r light:from-violet-600 light:to-fuchsia-600">
              Busy Humans
            </span>
          </h1>
          <p class="text-lg dark:text-zinc-400 light:text-zinc-600">
            Weekly space intel in 100-word shots. 
            Never miss the next big launch.
          </p>
        </div>

        <!-- Email signup with social proof -->
        <div class="space-y-6 max-w-md">
          <EmailForm />
          <SocialProof showReaderCount={false} showSubscribers={true} />
        </div>
      </div>

      <!-- Right side - FOMO Score -->
      <div class="relative hidden lg:block">
        <div class="absolute -inset-4 
                    dark:bg-violet-500/20 light:bg-violet-500/10 
                    rounded-full blur-3xl dark:opacity-50 light:opacity-30" />
        <WeeklyFomo />
      </div>
    </div>
  </div>

  <!-- Scroll indicator -->
  <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 
              dark:text-zinc-500 light:text-zinc-600">
    <span class="text-sm">Scroll for this week's hits</span>
    <div class="w-5 h-8 rounded-full flex items-start justify-center p-1
                dark:border-2 dark:border-zinc-800 
                light:border-2 light:border-zinc-300">
      <div class="w-1 h-2 rounded-full animate-bounce
                  dark:bg-zinc-700 light:bg-zinc-400" />
    </div>
  </div>
</div>