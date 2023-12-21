<script>
  export let title;
  export let shortDescription;
  export let longDescription;
  export let link;
  export let image;

  let isOpen = false;

  function toggleOpen() {
    isOpen = !isOpen;
  }
</script>

<div class="news-card bg-gray-800 p-6 mb-4 rounded-lg cursor-pointer" on:click={toggleOpen}>
  <h2 class="text-xl text-white font-bold mb-2">{title}</h2>
  {#if !isOpen}
    <p class="text-gray-300">{shortDescription}</p>
  {:else}
    <p class="text-gray-300 mb-4">{longDescription}</p>
    <a href={link} class="text-blue-400 hover:text-blue-600 mb-4 inline-block">Read More</a>
    <img src={image} alt={title} class="w-48 h-48 object-cover"/>
  {/if}
</div>
