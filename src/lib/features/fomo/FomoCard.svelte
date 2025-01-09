<!-- src/lib/features/fomo/FomoCard.svelte -->
<script lang="ts">
  export let position: "left" | "right" | "center" = "right";
</script>

<!-- Score tab that protrudes from the section -->
<div class="absolute -top-24 
            {position === 'right' ? 'right-12 lg:right-[calc((100%-1152px)/2+48px)]' : 
             position === 'left' ? 'left-12' : 
             'left-1/2 -translate-x-1/2'}
            w-full lg:w-[420px]
            mx-auto px-6 lg:px-0">
  <div class="relative rounded-t-2xl border 
              bg-zinc-900/80 backdrop-blur-sm 
              border-white/10
              {position === 'right' ? 'rounded-tr-none border-r-0' : 
               position === 'left' ? 'rounded-tl-none border-l-0' : 
               'border-b-0'}">
    <slot />
  </div>
</div>