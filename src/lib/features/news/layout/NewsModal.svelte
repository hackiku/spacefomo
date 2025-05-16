<!-- src/lib/features/news/feed/NewsModal.svelte -->
<script lang="ts">
  import { Dialog } from "bits-ui";
  import type { NewsItem } from '$lib/types/news';
  import BigCard from '../article/BigCard.svelte';
  
  let { article, isOpen, onClose } = $props<{
    article: NewsItem | null;
    isOpen: boolean;
    onClose: () => void;
  }>();
</script>

<Dialog.Root bind:open={isOpen} onOpenChange={(open) => !open && onClose()}>
  <Dialog.Portal>
    <!-- Backdrop overlay -->
    <Dialog.Overlay 
      class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    />
    
    <!-- Modal content -->
    <Dialog.Content
      class="fixed inset-4 sm:inset-auto sm:left-[50%] sm:top-[50%] sm:-translate-x-1/2 sm:-translate-y-1/2 
             z-50 w-full sm:w-[calc(100%-4rem)] sm:max-w-6xl h-[calc(100%-2rem)] sm:h-[calc(100%-8rem)] 
             data-[state=open]:animate-in data-[state=closed]:animate-out 
             data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 
             data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 
             outline-none overflow-hidden"
      onEscapeKeydown={onClose}
      preventScroll={true}
    >
      {#if article}
        <BigCard {article} onClose={onClose} />
      {/if}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>