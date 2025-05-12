<!-- src/lib/components/layout/Nav.svelte -->
<script lang="ts">
	import { List, X } from 'phosphor-svelte';
	import { fly } from 'svelte/transition';
	import SpacefomoLogo from '$lib/components/ui/SpacefomoLogo.svelte';
	import NavigationMenu from './NavigationMenu.svelte';
	import { browser } from '$app/environment';
	import AboutDrawer from '$lib/components/content/AboutDrawer.svelte';
	import { useNav } from '$lib/context/navContext.svelte';
	
	// Use the navigation context
	const nav = useNav();
	
	// Destructure what we need from the context
	const { 
		showAbout, 
		isMobileMenuOpen, 
		toggleMobileMenu, 
		openAbout,
		closeAbout 
	} = nav;
	
	// Close mobile menu when clicking outside
	function handleClickOutside(event: MouseEvent) {
		if (isMobileMenuOpen && event.target && !(event.target as HTMLElement).closest('.mobile-menu')) {
			toggleMobileMenu();
		}
	}
</script>

<svelte:window onclick={handleClickOutside} />

<header class="w-full">
	<div class="h-16 flex items-center justify-between">
		<!-- Logo -->
		<a href="/" class="flex items-center">
			<SpacefomoLogo size="md" />
		</a>

		<!-- Desktop Navigation -->
		<div class="hidden md:block">
			<NavigationMenu />
		</div>

		<!-- Mobile Menu Button -->
		<button
			class="group relative inline-flex items-center justify-center p-2
                  text-muted-foreground hover:text-primary transition-colors md:hidden
                  before:absolute before:inset-0
                  before:border before:border-primary/0
                  before:translate-x-0.5 before:translate-y-0.5
                  before:transition-transform before:duration-300
                  hover:before:border-primary/10
                  hover:before:translate-x-0 hover:before:translate-y-0
                  cursor-pointer active:scale-95"
			onclick={toggleMobileMenu}
			aria-label="Toggle menu"
		>
			{#if isMobileMenuOpen}
				<X class="h-6 w-6" />
			{:else}
				<List class="h-6 w-6" />
			{/if}
		</button>
	</div>
	
	<!-- Mobile Menu Panel -->
	{#if isMobileMenuOpen}
		<div 
			class="mobile-menu absolute left-0 right-0 z-50 bg-card border-t border-b border-border shadow-md"
			transition:fly={{ y: -5, duration: 200 }}
		>
			<div class="px-4 py-3 space-y-1">
				<a 
					href="/api/v1/news" 
					class="group relative block px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground
                         border-l-2 border-transparent hover:border-primary/40 transition-colors cursor-pointer"
				>
					API
				</a>
				<a 
					href="/news" 
					class="group relative block px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground
                         border-l-2 border-transparent hover:border-primary/40 transition-colors cursor-pointer"
				>
					News
				</a>
				<a 
					href="/admin" 
					class="group relative block px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground
                         border-l-2 border-transparent hover:border-primary/40 transition-colors cursor-pointer"
				>
					Admin
				</a>
				<button 
					class="group relative w-full text-left px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground
                         border-l-2 border-transparent hover:border-primary/40 transition-colors cursor-pointer"
					onclick={openAbout}
				>
					About
				</button>
			</div>
		</div>
	{/if}
</header>

<!-- About Drawer (shared between mobile and desktop) -->
{#if showAbout}
  <AboutDrawer isOpen={true} onClose={closeAbout} />
{/if}