<script>
  import { onMount } from 'svelte';
  import { pb } from '$lib/pocketbase.js'; // Import the PocketBase client instance

  onMount(async () => {
    try {
      // Fetch records from the 'articles' collection
      const response = await pb.records.getList('articles', 1, 50, { sort: '-created' });
      
      // Log the records to the console
      console.log(response.items); // Assuming 'items' contains the array of records
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    }
  });
</script>

  <h1>News from PocketBase</h1>
  <!-- You'll eventually display your articles here -->

<style>
  /* Your CSS styles */
</style>
