<!-- src/lib/components/cta/share/ShareModal.svelte -->

<script lang="ts">
  import { Dialog, Button } from 'bits-ui';
  import { X, Link, Envelope, ArrowClockwise, TwitterLogo, LinkedinLogo, Copy, Check } from 'phosphor-svelte';
  import StatusMessage from './StatusMessage.svelte';
  import { cn } from '$lib/utils';

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
  let urlFocused = $state(false);
  let emailFocused = $state(false);
  
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
  
  function handleUrlFocus() {
    urlFocused = true;
    if (errorMessage.includes('URL')) errorMessage = '';
  }
  
  function handleUrlBlur() {
    urlFocused = false;
  }
  
  function handleEmailFocus() {
    emailFocused = true;
    if (errorMessage.includes('email')) errorMessage = '';
  }
  
  function handleEmailBlur() {
    emailFocused = false;
  }
</script>

<Dialog.Root open={true} onOpenChange={(open) => !open && onClose()}>
  <Dialog.Portal>
    <Dialog.Overlay class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" />

    <Dialog.Content
      class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 
             fixed top-[50%] left-[50%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%]
             overflow-hidden rounded-md
             border border-border
             bg-card"
      onCloseAutoFocus={(e) => e.preventDefault()}
    >
      <!-- Header -->
      <Dialog.Title class="flex items-center justify-between border-b border-border p-6">
        <h2 class="text-2xl font-medium text-foreground">Share Space News</h2>

        <!-- Enhanced close button with ESC text -->
        <Dialog.Close
          class="group relative flex cursor-pointer items-center gap-2 p-2
                 bg-muted text-muted-foreground
                 before:absolute before:inset-0
                 before:border before:border-primary/10
                 before:translate-x-0.5 before:translate-y-0.5
                 before:transition-transform before:duration-300
                 hover:before:translate-x-0 hover:before:translate-y-0
                 hover:text-foreground"
        >
          <span class="text-sm font-medium">ESC</span>
          <div class="h-4 w-px bg-border"></div>
          <X class="h-5 w-5" />
        </Dialog.Close>
      </Dialog.Title>

      <!-- Form -->
      <div class="space-y-6 p-6">
        <!-- URL Input -->
        <div class="relative">
          <div 
            class={cn(
              "flex items-stretch h-14 border bg-input overflow-hidden",
              urlFocused ? "ring-1 ring-venus-yellow border-venus-yellow/40" : "border-border"
            )}
          >
            <div class="flex items-center justify-center pl-4 w-10">
              <Link weight="light" class="w-5 h-5 text-muted-foreground/50" />
            </div>

            <input
              type="url"
              bind:value={url}
              placeholder="https://..."
              onfocus={handleUrlFocus}
              onblur={handleUrlBlur}
              class="min-w-[120px] flex-1 px-2 bg-transparent text-foreground 
                     placeholder:text-muted-foreground/50 border-0 outline-none 
                     focus:ring-0 h-full"
              disabled={loading}
            />
          </div>

          {#if errorMessage && errorMessage.includes('URL')}
            <p class="absolute -bottom-6 left-0 text-sm text-destructive">
              {errorMessage}
            </p>
          {/if}
        </div>

        <!-- FOMO Score Slider -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <Dialog.Description class="text-sm font-medium text-muted-foreground">
              FOMO Score (How urgent is this news?)
            </Dialog.Description>
            <span class="fomo-score">
              {fomoScore}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            bind:value={fomoScore}
            class="w-full appearance-none bg-muted h-2 rounded-full accent-primary"
          />
        </div>

        <!-- Email (Optional) -->
        <div class="relative">
          <Dialog.Description class="block text-sm font-medium text-muted-foreground mb-2">
            Notify me about this submission (optional)
          </Dialog.Description>
          <div 
            class={cn(
              "flex items-stretch h-14 border bg-input overflow-hidden",
              emailFocused ? "ring-1 ring-venus-yellow border-venus-yellow/40" : "border-border"
            )}
          >
            <div class="flex items-center justify-center pl-4 w-10">
              <Envelope weight="light" class="w-5 h-5 text-muted-foreground/50" />
            </div>

            <input
              type="email"
              bind:value={email}
              placeholder="your@email.com"
              onfocus={handleEmailFocus}
              onblur={handleEmailBlur}
              class="min-w-[120px] flex-1 px-2 bg-transparent text-foreground 
                     placeholder:text-muted-foreground/50 border-0 outline-none 
                     focus:ring-0 h-full"
              disabled={loading}
            />
          </div>

          {#if errorMessage && errorMessage.includes('email')}
            <p class="absolute -bottom-6 left-0 text-sm text-destructive">
              {errorMessage}
            </p>
          {/if}
        </div>
        
        <!-- Social Sharing Options -->
        {#if isValidUrl(url)}
          <div class="border-t border-border pt-5 mt-6">
            <h3 class="text-sm font-medium text-muted-foreground mb-4">Share on social media</h3>
            <div class="flex flex-wrap gap-3">
              <!-- Twitter/X Share -->
              <a 
                href={getTwitterShareUrl()}
                target="_blank" 
                rel="noopener noreferrer"
                class="group relative flex items-center gap-2 px-4 py-2 
                      bg-muted border border-border text-muted-foreground
                      hover:text-foreground transition-colors
                      before:absolute before:inset-0
                      before:border before:border-primary/10
                      before:translate-x-0.5 before:translate-y-0.5
                      before:transition-transform before:duration-300
                      hover:before:translate-x-0 hover:before:translate-y-0"
              >
                <TwitterLogo class="h-5 w-5" />
                <span>X</span>
              </a>
              
              <!-- LinkedIn Share -->
              <a 
                href={getLinkedinShareUrl()}
                target="_blank" 
                rel="noopener noreferrer"
                class="group relative flex items-center gap-2 px-4 py-2 
                      bg-muted border border-border text-muted-foreground
                      hover:text-foreground transition-colors
                      before:absolute before:inset-0
                      before:border before:border-primary/10
                      before:translate-x-0.5 before:translate-y-0.5
                      before:transition-transform before:duration-300
                      hover:before:translate-x-0 hover:before:translate-y-0"
              >
                <LinkedinLogo class="h-5 w-5" />
                <span>LinkedIn</span>
              </a>
              
              <!-- Copy Link Button -->
              <button
                onclick={copyToClipboard}
                class="group relative flex items-center gap-2 px-4 py-2 
                      bg-muted border border-border text-muted-foreground
                      hover:text-foreground transition-colors
                      before:absolute before:inset-0
                      before:border before:border-primary/10
                      before:translate-x-0.5 before:translate-y-0.5
                      before:transition-transform before:duration-300
                      hover:before:translate-x-0 hover:before:translate-y-0"
              >
                {#if copied}
                  <Check class="h-5 w-5 text-primary" />
                  <span class="text-primary">Copied!</span>
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
          class="group relative mt-8 flex w-full items-center justify-center gap-2
                 bg-primary text-primary-foreground py-3 px-6
                 transition-all hover:bg-primary/90 active:scale-95
                 disabled:cursor-not-allowed disabled:opacity-50
                 before:absolute before:inset-0
                 before:border before:border-primary/50
                 before:translate-x-0.5 before:translate-y-0.5
                 before:transition-transform before:duration-300
                 hover:before:translate-x-0 hover:before:translate-y-0"
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
            <p class="bg-muted border border-primary/20 px-4 py-2 text-center text-sm text-foreground">
              News shared successfully!
            </p>
          </div>
        {:else if status === 'error' && !errorMessage.includes('URL') && !errorMessage.includes('email')}
          <div class="flex items-center justify-center">
            <p class="bg-muted border border-destructive/20 px-4 py-2 text-center text-sm text-destructive">
              Failed to share news. Please try again.
            </p>
          </div>
        {/if}
      </div>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>