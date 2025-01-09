<!-- src/lib/components/Hero.svelte -->
<script lang="ts">
  import EmailForm from './cta/EmailForm.svelte';
  // import WeeklyFomo from '../features/fomo/WeeklyFomo.svelte';
  import Fomo from '../features/fomo/Fomo.svelte';
  import SocialProof from './proof/SocialProof.svelte';
</script>

<div class="relative py-12 flex items-center px-6">
  <!-- Animated background grid - theme aware -->
  <div class="absolute inset-0 
              dark:bg-[linear-gradient(transparent_0%,_rgba(0,0,0,0.8)_50%),_linear-gradient(to_right,rgba(100,100,100,0.1)_1px,transparent_1px),_linear-gradient(rgba(100,100,100,0.1)_1px,transparent_1px)]
              light:bg-[linear-gradient(transparent_0%,_rgba(255,255,255,0.8)_50%),_linear-gradient(to_right,rgba(100,100,100,0.1)_1px,transparent_1px),_linear-gradient(rgba(100,100,100,0.1)_1px,transparent_1px)]
              bg-[size:100%_100%,24px_24px,24px_24px] 
              [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />

  <!-- Live reader count above hero -->
	
	<div class="container max-w-6xl mx-auto relative">
		<!-- <SocialProof activeReaders={142} showReaderCount={true} showSubscribers={false} /> -->
    <div class="grid lg:grid-cols-5 gap-12 items-center">
      <!-- Left Content - spans 3 columns -->
      <div class="lg:col-span-3 space-y-8">
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
            Weekly space intel in 100 words a pop. 
          </p>
        </div>

        <!-- Email signup with social proof -->
        <div class="space-y-6 max-w-md">
          <EmailForm />
          <SocialProof showReaderCount={false} showSubscribers={true} />
        </div>
      </div>

      <!-- Right side - FOMO Score - spans 2 columns -->
      <div class="relative lg:col-span-2">
        <div class="absolute -inset-4 
                    dark:bg-violet-500/20 light:bg-violet-500/10 
                    rounded-full blur-3xl dark:opacity-50 light:opacity-30" />
        <!-- <WeeklyFomo /> -->
        <Fomo />
      </div>
    </div>
  </div>
</div>