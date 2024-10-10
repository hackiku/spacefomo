<!-- src/lib/news/SubmitLink.svelte -->

<script lang="ts">
  import { addNewsItem } from '$lib/server/db/mockDb';
  import type { NewsItem } from '$lib/types';
  import { v4 as uuidv4 } from 'uuid';

  let url = '';
  let title = '';
  let source = '';

  async function handleSubmit() {
    const newItem: NewsItem = {
      id: uuidv4(),
      title,
      summary: '', // To be filled by AI
      tldr: '', // To be filled by AI
      score: 0, // To be calculated
      url,
      tags: [], // To be filled later
      source,
      readTime: '', // To be calculated
      dataPoints: [], // To be filled later
      date: new Date().toISOString(),
      author: '', // You might want to add this to the form
      publication: source, // Assuming source is the publication
    };

    addNewsItem(newItem);

    // Here you would typically call your API to process the link
    // For now, we'll just log it
    console.log('Submitted:', newItem);

    // Clear the form
    url = '';
    title = '';
    source = '';
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <input bind:value={url} type="url" placeholder="URL" required>
  <input bind:value={title} type="text" placeholder="Title" required>
  <input bind:value={source} type="text" placeholder="Source" required>
  <button type="submit">Submit Link</button>
</form>

