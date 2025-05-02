<!-- // src/lib/components/cta/share/EnhancedShareModal.svelte -->

<script lang="ts">
  import { Dialog, Button } from 'bits-ui';
  import { X, Link, Envelope, ArrowClockwise, TwitterLogo, LinkedinLogo, Copy, Check } from 'phosphor-svelte';
  import StatusMessage from './StatusMessage.svelte';

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
  let copied = $state(false);
  
  // Social sharing URLs
  const getTwitterShareUrl = () => {
    const text = "Check out this space news on SpaceFomo!";
    return `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
  };
  
  const getLinkedinShareUrl = () => {
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  };
  
  // Copy URL to clipboard
  function copyToClipboard() {
    navigator.clipboard.writeText(url);
    copied = true;
    setTimeout(() => {
      copied = false;
    }, 2000);
  }

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
      // Direct call to API
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
      setTimeout(() => onClose(), 2000);
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
    <Dialog.Overlay class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />

    <Dialog.Content
      class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 
           fixed top-[50%] left-[50%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%]
           overflow-hidden rounded-3xl
           border border-white/10
           bg-zinc-900/95 backdrop-blur-sm"
      onCloseAutoFocus={(e) => e.preventDefault()}
    >
      <!-- Header -->
      <Dialog.Title class="flex items-center justify-between border-b border-white/10 p-6">
        <h2 class="text-2xl font-medium text-zinc-100">Share Space News</h2>

        <!-- Enhanced close button with ESC text -->
        <Dialog.Close
          class="flex cursor-pointer items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2
               text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-zinc-100"
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
          <div class="flex h-14 items-stretch rounded-full border border-zinc-600">
            <div class="flex w-10 items-center pl-4">
              <Link weight="light" class="h-5 w-5 text-zinc-500/40" />
            </div>

            <input
              type="url"
              bind:value={url}
              placeholder="https://..."
              class="min-w-[120px] flex-1 rounded-lg border-0 bg-transparent
                  px-2 text-base
                  text-zinc-100 placeholder:text-zinc-600 focus:ring-1
                  focus:ring-zinc-700 focus:outline-none"
              disabled={loading}
            />
          </div>

          {#if errorMessage && errorMessage.includes('URL')}
            <p class="absolute -bottom-6 left-0 text-sm text-red-400">
              {errorMessage}
            </p>
          {/if}
        </div>

        <!-- FOMO Score Slider -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <Dialog.Description class="text-sm font-medium text-zinc-400">
              FOMO Score (How urgent is this news?)
            </Dialog.Description>
            <span class="text-lg font-semibold bg-clip-text text-transparent
                       bg-gradient-to-br from-violet-400 to-fuchsia-500">
              {fomoScore}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            bind:value={fomoScore}
            class="w-full appearance-none bg-zinc-800 h-2 rounded-full accent-violet-500"
          />
        </div>

        <!-- Email (Optional) -->
        <div class="relative">
          <Dialog.Description class="block text-sm font-medium text-zinc-400 mb-2">
            Notify me about this submission (optional)
          </Dialog.Description>
          <div class="flex h-14 items-stretch rounded-full border border-zinc-600">
            <div class="flex w-10 items-center pl-4">
              <Envelope weight="light" class="h-5 w-5 text-zinc-500/40" />
            </div>

            <input
              type="email"
              bind:value={email}
              placeholder="your@email.com"
              class="min-w-[120px] flex-1 rounded-lg border-0 bg-transparent
                  px-2 text-base
                  text-zinc-100 placeholder:text-zinc-600 focus:ring-1
                  focus:ring-zinc-700 focus:outline-none"
              disabled={loading}
            />
          </div>

          {#if errorMessage && errorMessage.includes('email')}
            <p class="absolute -bottom-6 left-0 text-sm text-red-400">
              {errorMessage}
            </p>
          {/if}
        </div>
        
        <!-- Social Sharing Options -->
        {#if isValidUrl(url)}
          <div class="border-t border-zinc-800 pt-5 mt-6">
            <h3 class="text-sm font-medium text-zinc-400 mb-4">Share on social media</h3>
            <div class="flex flex-wrap gap-3">
              <!-- Twitter/X Share -->
              <a 
                href={getTwitterShareUrl()}
                target="_blank" 
                rel="noopener noreferrer"
                class="flex items-center gap-2 px-4 py-2 rounded-lg 
                      bg-zinc-800/50 border border-zinc-700/30 text-zinc-300
                      hover:bg-zinc-700 transition-colors"
              >
                <TwitterLogo class="h-5 w-5" />
                <span>X</span>
              </a>
              
              <!-- LinkedIn Share -->
              <a 
                href={getLinkedinShareUrl()}
                target="_blank" 
                rel="noopener noreferrer"
                class="flex items-center gap-2 px-4 py-2 rounded-lg 
                      bg-zinc-800/50 border border-zinc-700/30 text-zinc-300
                      hover:bg-zinc-700 transition-colors"
              >
                <LinkedinLogo class="h-5 w-5" />
                <span>LinkedIn</span>
              </a>
              
              <!-- Copy Link Button -->
              <button
                onclick={copyToClipboard}
                class="flex items-center gap-2 px-4 py-2 rounded-lg 
                      bg-zinc-800/50 border border-zinc-700/30 text-zinc-300
                      hover:bg-zinc-700 transition-colors"
              >
                {#if copied}
                  <Check class="h-5 w-5 text-emerald-400" />
                  <span class="text-emerald-400">Copied!</span>
                {:else}
                  <Copy class="h-5 w-5" />
                  <span>Copy Link</span>
                {/if}
              </button>
            </div>
          </div>
        {/if}

        <!-- Submit Button -->
        <Button.Root
          onclick={handleSubmit}
          disabled={loading || !url}
          class="mt-8 flex w-full items-center justify-center gap-2 rounded-full
                 bg-gradient-to-r from-violet-500 to-fuchsia-500
                 px-6 py-3 text-white
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
            <p
              class="rounded-full bg-emerald-500/10 px-4 py-2 text-center text-sm text-emerald-400"
            >
              News shared successfully!
            </p>
          </div>
        {:else if status === 'error' && !errorMessage.includes('URL') && !errorMessage.includes('email')}
          <div class="flex items-center justify-center">
            <p class="rounded-full bg-red-500/10 px-4 py-2 text-center text-sm text-red-400">
              Failed to share news. Please try again.
            </p>
          </div>
        {/if}
      </div>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>