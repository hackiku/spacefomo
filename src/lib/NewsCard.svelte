<script>
  export let title;
  export let shortDescription;
  export let longDescription;
  export let link;
  export let image;
  export let date; // new prop for date
  export let time; // new prop for time
  export let source; // new prop for source
  export let fomoScore; // new prop for FOMO score

  let isOpen = false;

  function toggleOpen() {
    isOpen = !isOpen;
  }

  function handleKeydown(event) {
    if (event.key === 'Enter') {
      toggleOpen();
    }
  }

</script>

<div 
  class="news-card bg-gray-800 p-6 mb-4 rounded-lg cursor-pointer flex" 
  on:click={toggleOpen}
  role="button" 
  tabindex="0"
  on:keydown={handleKeydown}>

  <div class="flex-1">
    <div class="flex gap-x-2 align-left text-sm text-gray-400 mb-2">
      <span>{source} •</span>
      <span>{date}</span>
      <!-- <span>FOMO: {fomoScore}</span>       -->
    </div>
    <h2 class="text-xl text-white font-bold mb-2">{title}</h2>
    {#if !isOpen}
      <p class="text-gray-300">{shortDescription}</p>
    {:else}
      <p class="text-gray-300 mb-4">{longDescription}</p>
      <a href={link} class="text-blue-400 hover:text-blue-600 mb-4 inline-block">Read More</a>
      <!-- Image Column (only when open) -->
      <div class="flex-none ml-4">
        <img src={image} alt={title} class="w-48 h-48 object-cover rounded"/>
      </div>    
      {/if}
  </div>

</div>
