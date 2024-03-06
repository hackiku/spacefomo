<!-- /avionika/+page.svelte -->
<script>
	// import { pb , fetchAvionics } from '$lib/pocketbase.js';
  import { onMount } from 'svelte';
	// import { fetchSingleAvionicsRecord } from '$lib/pocketbase.js';
  import Nav from '$lib/ui/Nav.svelte';
  import ScreenSizeDebug from '$lib/ui/ScreenSizeDebug.svelte';
  
  let url = '';
  // let avionicsUrls = [];

  // let avionicsRecord = null;


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

<ScreenSizeDebug />
<Nav />

<!-- md:px-8 lg:px-26  -->



<main class="container mx-auto overflow-hidden h-screen mb-4
  py-16 space-y-12 px-4 sm:px-10 md:px-16 lg:px-28 xl:px-72">

<!-- --------------------- hero ------------------------------- -->
    <section class="text-center space-y-6">
    <p class="text-xl font-mono">avionika prodzekt</p>
    <h1 class="text-4xl font-bold text-white">F-16 Fighting Falcon</h1>
  </section>


  <!-- --------------------- buttons ------------------------------- -->
  <section class="flex flex-wrap md:flex-nowrap justify-center items-center gap-4 w-full">

    <a href="https://docs.google.com/document/d/12SSsJHiNY_vQOvVSBCHxkV5B7UJ_63AwFyj_sd3ZlJE/edit" target="_blank"
      class="flex items-center justify-center rounded-2xl w-full px-8 py-4 text-xl border border-gray-200 text-white hover:border-gray-400">
      <img src="icons/docs-logo.svg" alt="Docs" class="h-8 w-8 mr-2"> rad f-16
    </a>
    <a href="https://drive.google.com/drive/folders/1txJkpCpcrGi1ECD8D-WbvsfqDoh2yzYM?usp=sharing" target="_blank"
      class="flex items-center justify-center rounded-2xl w-full px-8 py-4 text-xl border border-gray-200 text-white hover:border-gray-400">
      <img src="icons/drive-logo.svg" alt="Drive" class="h-8 w-8 mr-2"> folderče
    </a>
  </section>

  <hr class="opacity-20">

  <!-- --------------------- intel ------------------------------- -->

  <section class="w-full flex flex-col items-center space-y-8">
    <h3 class="text-3xl font-bold text-white">Drop intel 👇</h3>
    <form on:submit={handleSubmit} class="flex flex-wrap md:flex-nowrap justify-center items-center gap-4 w-full">
      <!-- Removed label for directness and to save space -->
      <input type="text" id="upload-url" bind:value={url} class="w-full md:w-2/3 px-4 py-4 border-2 border-gray-200 text-gray-900 rounded-xl" placeholder="Paste link here" required>
      <button type="submit" class="w-full md:w-1/3 px-8 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-700">Submit URL</button>
    </form>
  </section>

</main>
