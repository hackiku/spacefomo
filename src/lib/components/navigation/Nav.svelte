<!-- src/lib/components/navigation/Nav.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { Info, X } from 'phosphor-svelte';
    import Logo from '$lib/components/branding/Logo.svelte';
    import github from '$lib/images/github.svg';

    let showAbout = $state(false);
    let lastScrollY = 0;
    let isHidden = $state(false);
    
    // Handle scroll behavior
    function handleScroll() {
        const currentScrollY = window.scrollY;
        isHidden = currentScrollY > lastScrollY && currentScrollY > 50;
        lastScrollY = currentScrollY;
    }

    onMount(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    });
</script>

<header 
    class="fixed top-0 left-0 right-0 z-50 transition-transform duration-300"
    style:transform={isHidden ? 'translateY(-100%)' : 'translateY(0)'}
>
    <div class="max-w-[1920px] px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-32">
        <div class="h-16 px-4 flex items-center justify-between">
            <!-- Logo -->
            <a href="/" class="flex items-center">
                <Logo />
            </a>

            <!-- Actions -->
            <div class="flex items-center gap-6">
                <button 
                    class="text-zinc-400 hover:text-zinc-200 transition-colors"
                    onclick={() => showAbout = !showAbout}
                >
                    {#if showAbout}
                        <X class="w-6 h-6" />
                    {:else}
                        <Info class="w-6 h-6" />
                    {/if}
                </button>
                
                <a 
                    href="https://github.com/hackiku" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="text-zinc-400 hover:text-zinc-200 transition-all hover:scale-110"
                >
                    <img 
                        src={github} 
                        alt="GitHub" 
                        class="w-6 h-6 [filter:invert(1)]" 
                    />
                </a>
            </div>
        </div>
    </div>
</header>

<!-- About Drawer -->
{#if showAbout}
    <div 
        class="fixed inset-0 z-40 bg-black/50"
        onclick={() => showAbout = false}
    />
    <div 
        class="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 
               bg-zinc-900 border-l border-zinc-800"
        transition:fly={{ x: 300, duration: 200 }}
    >
        <div class="p-6">
            <h2 class="text-2xl font-medium mb-4">About Spacefomo</h2>
            <p class="text-zinc-400">
                Track the pulse of the space industry. Stay informed about launches,
                investments, and breakthroughs with our FOMO score.
            </p>
        </div>
    </div>
{/if}