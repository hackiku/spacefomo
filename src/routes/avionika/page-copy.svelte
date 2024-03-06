<!-- /avionika/+page.svelte -->
<script>
	// import { pb , fetchAvionics } from '$lib/pocketbase.js';
  import { onMount } from 'svelte';
	import { fetchSingleAvionicsRecord } from '$lib/pocketbase.js';
  import Nav from '$lib/ui/Nav.svelte';

  let url = '';
  // let avionicsUrls = [];

	let avionicsRecord = null;


  // Function to handle form submission
  // async function handleSubmit(event) {
  //   event.preventDefault();
  //   try {
  //     await pb.records.create('avionics', { intel_url: url });
  //     console.log('URL submitted successfully');
  //     url = ''; // Clear the input field after successful submission
      
  //     fetchAvionicsUrls(); // Refresh the list of URLs
  //   } catch (error) {
  //     console.error('Failed to submit URL:', error);
  //     // Optionally, handle the error (e.g., show an error message to the user)
  //   }
  // }

  // Function to fetch avionics URLs
  // async function fetchAvionicsUrls() {
  //   try {
  //     const records = await pb.collection('avionics').getFullList({ sort: '-created' });
  //     avionicsUrls = records;
  //   } catch (error) {
  //     console.error('Error fetching avionics records:', error);
  //   }
  // }

  // Use onMount to fetch URLs after the component mounts
  onMount(async () => {
    avionicsRecord = await fetchSingleAvionicsRecord();
  });
</script>



<Nav />

<main class="container mx-auto overflow-x-hidden px-6 md:px-16 lg:px-26 xl:px-44 py-16 space-y-24">
	<!-- --------------------- HERO ------------------------------- -->
	<section class="flex flex-col items-center space-y-6">
		<p class="text-xl font-mono">avionika prodzekt</p>
		<h1 class="text-4xl font-bold text-white mb-4">F-16 Fighting Falcon</h1>
	</section>
	
	<!-- --------------------- docs & drive btns ------------------------------- -->
	<section class="flex justify-center items-center space-x-4">
		<!-- docs -->
		<a href="https://docs.google.com/document/d/12SSsJHiNY_vQOvVSBCHxkV5B7UJ_63AwFyj_sd3ZlJE/edit"
			target="_blank" class="flex items-center rounded-2xl px-4 py-2 border border-gray-200 text-white hover:border-gray-400">
			<img src="icons/docs-logo.svg" alt="Docs" class="h-6 w-6 mr-2">
			rad f-16
		</a>
		<!-- drive -->
		<a href="https://drive.google.com/drive/folders/1txJkpCpcrGi1ECD8D-WbvsfqDoh2yzYM?usp=sharing"
			target="_blank" class="flex items-center rounded-2xl px-4 py-2 border border-gray-200 text-white hover:border-gray-400">
			<img src="icons/drive-logo.svg" alt="Drive" class="h-6 w-6 mr-2">
			folderče
		</a>
	</section>
	
<!-- --------------------- UPLOAD ------------------------------- -->
<section class="w-full flex flex-col items-center space-y-8">
	<h3 class="text-2xl font-bold text-white">Drop all of the intel 👇</h3>

	{#if avionicsRecord}
  <div>
    <p>Intel URL: <a href="{avionicsRecord.intel_url}" target="_blank">{avionicsRecord.intel_url}</a></p>
  </div>
{:else}
  <p>No avionics record found or loading...</p>
{/if}


	<!-- <form on:submit={handleSubmit} class="flex flex-col space-y-4">
		<label for="upload-url" class="text-white">Upload URL</label>
		<input type="text" id="upload-url" bind:value={url} class="px-4 py-2 border-2 border-gray-200 text-gray-900" placeholder="Enter URL" required>
		<button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Submit URL</button>
	</form>

</section>

	<section class="w-full flex flex-col items-center space-y-8">
    <h3 class="text-2xl font-bold text-white">Avionics Intel URLs</h3>
    {#each avionicsUrls as { intel_url }}
      <a href="{intel_url}" target="_blank" class="text-blue-500 hover:text-blue-700">{intel_url}</a>
    {/each}
  </section> -->



</main>
