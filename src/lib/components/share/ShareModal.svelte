<!-- src/lib/components/cta/share/ShareModal.svelte -->
<script lang="ts">
	import { scale, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { X, Envelope, ArrowClockwise } from 'phosphor-svelte';
	import FomoSlider from '$lib/features/fomo/FomoSlider.svelte';

	let { onClose } = $props<{
		onClose: () => void;
	}>();

	// Form state
	let url = $state('');
	let email = $state('');
	let comment = $state('');
	let fomoScore = $state(50);
	let loading = $state(false);
	let status = $state<'idle' | 'success' | 'error'>('idle');
	let errorMessage = $state('');

	// Simple validation helpers
	function isValidUrl(url: string) {
		try {
			new URL(url);
			return true;
		} catch (e) {
			return false;
		}
	}

	function isValidEmail(email: string) {
		return !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}

	function isFormValid() {
		// Reset error message
		errorMessage = '';
		
		// Check URL is valid
		if (!url.trim()) {
			errorMessage = 'URL is required';
			return false;
		}
		
		if (!isValidUrl(url)) {
			errorMessage = 'Please enter a valid URL';
			return false;
		}
		
		// If email is provided, check it's valid
		if (email && !isValidEmail(email)) {
			errorMessage = 'Please enter a valid email address';
			return false;
		}
		
		return true;
	}

	async function handleSubmit() {
		if (!isFormValid()) return;

		loading = true;
		status = 'idle';

		try {
			// Direct call to Supabase
			const response = await fetch('/api/submit', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					url,
					comment: comment || undefined,
					fomoScore: fomoScore || undefined,
					email: email || undefined
				})
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.message || 'Submission failed');
			}

			status = 'success';
			setTimeout(() => onClose(), 1500);
		} catch (err) {
			status = 'error';
			errorMessage = err instanceof Error ? err.message : 'Failed to share news';
		} finally {
			loading = false;
		}
	}

	function handleOutsideClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			onClose();
		}
	}
</script>

<div 
	class="fixed inset-0 z-50"
	transition:fade={{ duration: 200 }}
	onclick={handleOutsideClick}>
	<!-- Backdrop -->
	<div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

	<!-- Modal -->
	<div class="relative flex h-full items-center justify-center p-4 md:p-12">
		<div
			class="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10
                   bg-zinc-900/95 backdrop-blur-sm"
			transition:scale={{ duration: 300, easing: cubicOut, start: 0.5 }}
		>
			<!-- Header -->
			<div class="flex items-center justify-between border-b border-white/10 p-6">
				<h2 class="text-2xl font-medium text-zinc-100">Share Space News</h2>
				<button
					class="rounded-lg p-2 text-zinc-400 transition-colors
                           hover:bg-white/5 hover:text-zinc-100"
					onclick={onClose}
				>
					<X class="h-6 w-6" />
				</button>
			</div>

			<!-- Form -->
			<div class="space-y-6 p-6">
				<!-- URL Input -->
				<div class="space-y-2">
					<label for="url" class="block text-sm font-medium text-zinc-400"> News URL </label>
					<input
						id="url"
						type="url"
						bind:value={url}
						placeholder="https://..."
						class="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2
                               text-zinc-100 placeholder:text-zinc-600
                               focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
					/>
				</div>

				<!-- FOMO Score -->
				<div class="space-y-2">
					<label class="block text-sm font-medium text-zinc-400"> FOMO Score </label>
					<FomoSlider
						score={fomoScore}
						onUpvote={() => (fomoScore = Math.min(fomoScore + 5, 100))}
						onDownvote={() => (fomoScore = Math.max(fomoScore - 5, 0))}
					/>
				</div>

				<!-- Comment -->
				<div class="space-y-2">
					<label for="comment" class="block text-sm font-medium text-zinc-400">
						Why is this interesting?
					</label>
					<textarea
						id="comment"
						bind:value={comment}
						rows="3"
						class="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2
                               text-zinc-100 placeholder:text-zinc-600
                               focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
					/>
				</div>

				<!-- Email (Optional) -->
				<div class="space-y-2">
					<label for="email" class="block text-sm font-medium text-zinc-400">
						Your email (optional)
					</label>
					<input
						id="email"
						type="email"
						bind:value={email}
						placeholder="you@example.com"
						class="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2
                               text-zinc-100 placeholder:text-zinc-600
                               focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
					/>
				</div>

				<!-- Error Message -->
				{#if errorMessage}
					<p class="text-center text-sm text-red-400" transition:fade>
						{errorMessage}
					</p>
				{/if}

				<!-- Submit Button -->
				<button
					onclick={handleSubmit}
					disabled={loading || !url}
					class="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r
                           from-violet-500 to-fuchsia-500 px-6
                           py-3 text-white
                           transition-all hover:from-violet-600
                           hover:to-fuchsia-600 disabled:cursor-not-allowed disabled:opacity-50"
				>

						<span>Share News</span>
					<!-- {/if} -->
				</button>

				<!-- Status Messages -->
				{#if status === 'success'}
					<p class="text-center text-sm text-emerald-400" transition:fade>
						News shared successfully!
					</p>
				{:else if status === 'error'}
					<p class="text-center text-sm text-red-400" transition:fade>
						Failed to share news. Please try again.
					</p>
				{/if}
			</div>
		</div>
	</div>
</div>