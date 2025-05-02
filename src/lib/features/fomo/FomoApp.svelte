<!-- src/lib/features/fomo/FomoApp.svelte -->
<script lang="ts">
  import BarTimeline from "./timeline/BarTimeline.svelte";
  import CalendarButton from "./calendar/CalendarButton.svelte";
</script>

<div class="h-full w-full ">
  <div class="h-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4">
		<CalendarButton />
  
		<!-- <div class="opacity-80"> -->
			<BarTimeline />
		<!-- </div>  -->
  
	</div>
</div>