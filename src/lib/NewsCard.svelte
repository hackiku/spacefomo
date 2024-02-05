<!-- NewsCard.svelte -->
<script>
  import pb from 'pocketbase';
  
  import FomoCounter from "./FomoCounter.svelte";
  export let title;
  export let shortDescription;
  export let longDescription;
  export let link;
  export let image;
  export let date; // new prop for date
  export let time; // new prop for time
  export let source; // new prop for source
  export let fomoScore; // new prop for FOMO score
  
  // const pb = new PocketBase('http://127.0.0.1:8090');

  async function fetchNewsItems() {
    const { data, error } = await supabase
    .from('news_items')
    .select('*')
    if (error) console.log('Error fetching news:', error)
    else return data
}


  $: formattedNumbers = longDescription.match(/\d+/g)?.map(num => `• ${num}`) || [];

  let isOpen = false;

  function toggleOpen() {
    isOpen = !isOpen;
  }

  function handleKeydown(event) {
    if (event.key === 'Enter') {
      toggleOpen();
    }
  }
  
  let fomoPercentage = parseFloat(fomoScore);
  function updateFomoScore(newScore) {
    fomoPercentage = newScore;
    // Here you can also add logic to update the score in your database or global state
  }

</script>


<div 
  class="news-card relative bg-gray-800 p-6 mb-4 rounded-2xl cursor-pointer flex" 
  on:click={toggleOpen}
  role="button" 
  tabindex="0"
  on:keydown={handleKeydown}>

  <div class="flex-1">
    <!-- FomoCounter, positioned absolutely -->
    <div class="fomo-counter-container absolute top-0 right-0 m-4">
      <FomoCounter {fomoPercentage} on:update={updateFomoScore} />
    </div>
    
    <div class="flex gap-x-2 align-left text-sm text-gray-400 mb-2">
      <span>{source}</span>
      <span>•</span>
      <span>{date}</span>
      <!-- <span>FOMO: {fomoScore}</span> -->
    </div>
    <h2 class="text-xl text-white font-bold mb-2">{title}</h2>
        
    {#if !isOpen}
      <p class="text-gray-300">{shortDescription}</p>
    {:else}
      <p class="text-gray-300 mb-4">{longDescription}</p>
      <a href={link} class="text-blue-400 hover:text-blue-600 mb-4 inline-block">Read More</a>
      <!-- Image Column (only when open) -->
      <!-- Display bullet points -->
      {#if formattedNumbers.length}
        <ul class="list-inside list-disc">
          {#each formattedNumbers as number}
            <li class="text-gray-300">{number}</li>
          {/each}
        </ul>
      {/if}
    {/if}
  </div>

</div>

