<!-- src/lib/components/cta/share/ShareModal.svelte -->
<script lang="ts">
	import { Dialog, Button } from 'bits-ui';
	import { X, Link, Envelope, ArrowClockwise } from 'phosphor-svelte';
	import FomoSlider from '$lib/features/fomo/FomoSlider.svelte';

	let { onClose } = $props<{
		onClose: () => void;
	}>();

	// Form state
	let url = $state('');
	let email = $state('');
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
</script>

<Dialog.Root open={true} onOpenChange={(open) => !open && onClose()}>
	<Dialog.Portal>
		<Dialog.Overlay 
			class="bg-black/50 backdrop-blur-sm fixed inset-0 z-50"
		/>
		
		<Dialog.Content
			class="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 
			       bg-zinc-900/95 backdrop-blur-sm fixed z-50 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]
				   data-[state=open]:animate-in data-[state=closed]:animate-out
				   data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
				   data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
			onCloseAutoFocus={(e) => e.preventDefault()}
		>
			<!-- Header -->
			<Dialog.Title class="flex items-center justify-between border-b border-white/10 p-6">
				<h2 class="text-2xl font-medium text-zinc-100">Share Space News</h2>
				
				<!-- Enhanced close button with ESC text -->
				<Dialog.Close 
					class="flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-zinc-300
						   transition-colors hover:bg-zinc-700 hover:text-zinc-100 cursor-pointer"
				>
					<span class="text-sm font-medium text-zinc-400">ESC</span>
					<div class="h-4 w-px bg-zinc-600"></div>
					<X class="h-5 w-5" />
				</Dialog.Close>
			</Dialog.Title>

			<!-- Form -->
			<div class="space-y-6 p-6">
				<!-- URL Input -->
				<div class="relative">
					<div class="flex items-stretch h-14 rounded-full border border-zinc-600">
						<div class="flex items-center pl-4 w-10">
							<Link weight="light" class="w-5 h-5 text-zinc-500/40" />
						</div>
						
						<input
							type="url"
							bind:value={url}
							placeholder="https://..."
							class="min-w-[120px] flex-1 px-2 bg-transparent text-base
									text-zinc-100 placeholder:text-zinc-600
									border-0 focus:outline-none focus:ring-1 
									focus:ring-zinc-700 rounded-lg"
							disabled={loading}
						/>
					</div>
                    
                    {#if errorMessage && errorMessage.includes('URL')}
                        <p class="absolute -bottom-6 left-0 text-sm text-red-400">
                            {errorMessage}
                        </p>
                    {/if}
				</div>

				<!-- FOMO Score -->
				<div class="space-y-2 pt-2">
					<Dialog.Description class="block text-sm font-medium text-zinc-400">
						FOMO Score
					</Dialog.Description>
					<FomoSlider
						score={fomoScore}
						onUpvote={() => (fomoScore = Math.min(fomoScore + 5, 100))}
						onDownvote={() => (fomoScore = Math.max(fomoScore - 5, 0))}
					/>
				</div>

				<!-- Email (Optional) -->
				<div class="relative">
					<div class="flex items-stretch h-14 rounded-full border border-zinc-600">
						<div class="flex items-center pl-4 w-10">
							<Envelope weight="light" class="w-5 h-5 text-zinc-500/40" />
						</div>
						
						<input
							type="email"
							bind:value={email}
							placeholder="your@email.com (optional)"
							class="min-w-[120px] flex-1 px-2 bg-transparent text-base
									text-zinc-100 placeholder:text-zinc-600
									border-0 focus:outline-none focus:ring-1 
									focus:ring-zinc-700 rounded-lg"
							disabled={loading}
						/>
					</div>
                    
                    {#if errorMessage && errorMessage.includes('email')}
                        <p class="absolute -bottom-6 left-0 text-sm text-red-400">
                            {errorMessage}
                        </p>
                    {/if}
				</div>

				<!-- Submit Button -->
				<Button.Root
					onclick={handleSubmit}
					disabled={loading || !url}
					class="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r
                           from-violet-500 to-fuchsia-500 px-6
                           py-3 text-white mt-8
                           transition-all hover:from-violet-600
                           hover:to-fuchsia-600 active:scale-95
                           disabled:cursor-not-allowed disabled:opacity-50"
				>
                    {#if loading}
                        <ArrowClockwise class="h-5 w-5 animate-spin" />
                        <span>Sending...</span>
                    {:else}
                        <span>Share News</span>
                    {/if}
				</Button.Root>

				<!-- Status Messages -->
				{#if status === 'success'}
					<div class="flex items-center justify-center">
						<p class="text-center text-sm text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-full">
							News shared successfully!
						</p>
					</div>
				{:else if status === 'error' && !errorMessage.includes('URL') && !errorMessage.includes('email')}
					<div class="flex items-center justify-center">
						<p class="text-center text-sm text-red-400 bg-red-500/10 px-4 py-2 rounded-full">
							Failed to share news. Please try again.
						</p>
					</div>
				{/if}
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>