<!-- src/lib/components/navigation/Nav.svelte -->
<script lang="ts">
    import { page } from '$app/stores';
    import logo from '$lib/images/svelte-logo.svg';
    import github from '$lib/images/github.svg';
    
    const navItems = [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About' },
        { href: '/projects', label: 'Projects' }
    ];
</script>

<header class="fixed top-0 left-0 right-0 z-50">
    <div class="max-w-[1920px] px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-32">
        <div class="border-b border-zinc-800 backdrop-blur-sm">
            <div class="h-16 px-4 flex items-center justify-between">
                <!-- Logo and Navigation -->
                <div class="flex items-center gap-8">
                    <a href="/" class="flex items-center">
                        <img src={logo} alt="SpaceFOMO" class="w-8 h-8" />
                    </a>
                    
                    <nav class="flex items-center gap-6">
                        <!-- {#each navItems as { href, label }}
                            <a
                                {href}
                                class="text-zinc-400 hover:text-zinc-200 text-sm font-medium transition-colors"
                                aria-current={$page.url.pathname === href ? 'page' : undefined}
                            >
                                {label}
                            </a>
                        {/each} -->
                    </nav>
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-4">
                    <button 
                        class="h-9 px-4 text-sm border border-zinc-600 rounded-full 
                               hover:bg-zinc-800/50 text-zinc-100 transition-colors"
                    >
                        Send News
                    </button>
                    
                    <a 
                        href="https://github.com/hackiku" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        class="p-2 text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                        <img src={github} alt="GitHub" class="w-5 h-5" />
                    </a>
                </div>
            </div>
        </div>
    </div>
</header>