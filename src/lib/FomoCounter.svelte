<!-- FomoCounter.svelte -->
<script>
	let fomoPercentage = 0;
	
	function increase() {
		if (fomoPercentage < 100) fomoPercentage += 1;
	}
	
	function decrease() {
		if (fomoPercentage > 0) fomoPercentage -= 1;
	}
</script>

<div class="fomo-counter">
	<button on:click={increase}>+</button>
	<div class="percentage text-2xl">{fomoPercentage}%</div>
	<button on:click={decrease}>-</button>
</div>

<style>
	.fomo-counter {
		/* Add your styling for the counter */
	}
</style>
