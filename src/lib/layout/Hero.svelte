<!-- src/lib/layout/Hero.svelte -->
<script lang="ts">
	import { Plus } from 'phosphor-svelte';
	import ShareModal from '../features/news/share/ShareModal.svelte';

	let showShareModal = $state(false);
</script>

<div class="container mx-auto px-6 text-center md:px-32 lg:px-72">
	<!-- Main Heading -->
	<h1
		class="mb-6 bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-4xl
                   font-bold text-transparent sm:text-5xl lg:text-6xl"
	>
		Space race hot news in 100 words a pop
	</h1>

	<!-- Share Button -->
	<button
		onclick={() => (showShareModal = true)}
		class="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500
                   to-fuchsia-500 px-6 py-3
                   font-medium text-white
                   transition-all hover:from-violet-600 hover:to-fuchsia-600
                   hover:shadow-lg hover:shadow-violet-500/25"
	>
		<Plus weight="bold" class="h-5 w-5" />
		Share News
	</button>
</div>

<!-- Gradient Orb -->
<div
	class="absolute -top-24 -right-24 h-96 w-96 rounded-full
                bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30
                opacity-50 blur-3xl"
></div>

<!-- Share Modal -->
{#if showShareModal}
	<ShareModal onClose={() => (showShareModal = false)} />
{/if}
