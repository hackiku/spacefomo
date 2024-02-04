<!-- FomoCounter.svelte -->
<script>
  export let fomoPercentage;
  
  function increase() {
    if (fomoPercentage < 100) fomoPercentage = (parseFloat(fomoPercentage) + 1).toFixed(1);
  }
  
  function decrease() {
    if (fomoPercentage > 0) fomoPercentage = (parseFloat(fomoPercentage) - 1).toFixed(1);
  }

  // New function to stop propagation of click events
  function handleClick(event) {
    event.stopPropagation();
  }
</script>

<div class="flex flex-col items-center justify-center w-24 h-24 fomo-counter-container" on:click={handleClick}>
  <button class="focus:outline-none" on:click|stopPropagation={increase}>+</button>
  <div class="percentage text-2xl">{fomoPercentage}%</div>
  <button class="focus:outline-none" on:click|stopPropagation={decrease}>-</button>
</div>


<style>
  .fomo-counter-container {
    /* Styling for the FOMO counter container */
    background-color: #333; /* Dark gray background */
    border-radius: 9999px; /* Round shape */
    box-shadow: 0 2px 4px rgba(0,0,0,0.5); /* Optional: Adds a subtle shadow */
    transform: translate(25%, -25%); /* Adjust as needed for alignment */
  }
  button {
    background: none;
    border: none;
    color: white;
    padding: 0.25rem;
    font-size: 1.25rem; /* Adjust button font size */
    cursor: pointer;
    /* Add more button styles if necessary */
  }
  .percentage {
    color: white; /* Adjust text color */
    margin: 0.1rem 0; /* Reduced margin to bring buttons closer */
    /* Add more text styles if necessary */
  }
  /* Additional styles if needed */
</style>
