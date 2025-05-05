<!-- src/lib/features/fomo/FomoApp.svelte -->
<script lang="ts">
	import BarTimeline from './timeline/BarTimeline.svelte';
	import CalendarMenu from './calendar/CalendarMenu.svelte';
	import { Share } from 'phosphor-svelte';
	import { Button } from 'bits-ui';
	import ShareModal from '$lib/components/cta/share/ShareModal.svelte';

	// State for share modal
	let showShareModal = $state(false);

	// Handle share button click
	function handleShareClick() {
		showShareModal = true;
	}
</script>

<!-- Match max width and padding with Nav.svelte spacing -->
<div class="h-full w-full">
	<div class="mx-auto h-full max-w-[1920px] px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-32">
		<div class="relative flex h-full items-center">
			<!-- Calendar menu button on the left -->
			<div class="z-30 flex-shrink-0">
				<CalendarMenu />
			</div>
			
			<!-- Timeline in the middle (flex-grow) -->
			<div class="mx-4 h-full _flex-grow">
				<BarTimeline />
			</div>

			<!-- Share button on the right -->
			<div class="z-30 flex-shrink-0">
				<Button.Root
					onclick={handleShareClick}
					class="inline-flex h-10 w-10 items-center 
				justify-center rounded-full
				bg-zinc-800 text-zinc-200 transition-all
				hover:bg-zinc-700 hover:text-white active:scale-95"
					aria-label="Share News"
				>
					<Share weight="bold" class="h-5 w-5" />
				</Button.Root>
			</div>

		</div>
	</div>
</div>

<!-- Share modal -->
{#if showShareModal}
	<ShareModal onClose={() => (showShareModal = false)} />
{/if}
