<!-- src/routes/ai/+page.svelte -->
<script lang="ts">
  import { fetchNewsFromSupabaseFunction } from '$lib/services/api/supabase/newsApiService';
	import { supabase } from '$lib/services/supabase/client';
  // import { onMount } from 'svelte';

  // Function states
  let news = $state([]);
  let newsLoading = $state(true);
  let newsError = $state(null);
  let functionUrl = $state('');
  let responseData = $state(null);
  let rawResponse = $state('');

  // Config values with defaults
  let supabaseUrl = $state(import.meta.env.VITE_SUPABASE_URL || '');
  let limit = $state(5);
  let minScore = $state(0);
  let sortBy = $state('fomo_score');
  let sortDir = $state('desc');

  // Testing functions
  async function testDirectFetch() {
    try {
      // Clear previous data
      responseData = null;
      rawResponse = '';
      newsError = null;
      newsLoading = true;

      // Build the URL manually for testing
      functionUrl = `${supabaseUrl}/functions/v1/get-news?limit=${limit}&minScore=${minScore}&sortBy=${sortBy}&sortDir=${sortDir}`;
      
      // Get session for auth token
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || '';

      // Make the request
      const response = await fetch(functionUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      // Log full response
      rawResponse = `Status: ${response.status} ${response.statusText}\n\nHeaders:\n`;
      
      response.headers.forEach((value, key) => {
        rawResponse += `${key}: ${value}\n`;
      });

      // Parse response
      const result = await response.json();
      responseData = result;

      if (response.ok) {
        news = result.data || [];
        newsError = null;
      } else {
        throw new Error(result.error || 'Error fetching news');
      }
    } catch (err) {
      console.error('Failed direct fetch:', err);
      newsError = err instanceof Error ? err.message : 'An unknown error occurred';
    } finally {
      newsLoading = false;
    }
  }

  async function testServiceFunction() {
    try {
      newsLoading = true;
      newsError = null;
      responseData = null;
      
      const params = {
        limit,
        minScore,
        sortBy,
        sortDir
      };
      
      const result = await fetchNewsFromSupabaseFunction(params);
      responseData = result;
      news = result.data || [];
    } catch (err) {
      console.error('Failed service function:', err);
      newsError = err instanceof Error ? err.message : 'An unknown error occurred';
    } finally {
      newsLoading = false;
    }
  }

  function resetState() {
    news = [];
    newsLoading = false;
    newsError = null;
    responseData = null;
    rawResponse = '';
  }

  // For UI only
  let activeTab = $state('debug');
</script>

<div class="container mx-auto p-4 max-w-6xl mt-16">
  <header class="mb-6">
    <div class="flex items-center gap-3 mb-2">
      <h1 class="text-2xl font-bold">AI Pipeline Debug</h1>
    </div>
    <p class="text-zinc-400">Test your Supabase Function endpoints and news processing.</p>
  </header>

  <!-- Debug Controls -->
  <div class="bg-zinc-800 border border-zinc-700 rounded-lg p-4 mb-6">
    <div class="flex gap-4 mb-4 border-b border-zinc-700 pb-4">
      <button 
        class="px-3 py-1.5 rounded-lg {activeTab === 'debug' ? 'bg-violet-600 text-white' : 'bg-zinc-700 text-zinc-300'}"
        onclick={() => activeTab = 'debug'}
      >
        Function Debug
      </button>
      <button 
        class="px-3 py-1.5 rounded-lg {activeTab === 'pipeline' ? 'bg-violet-600 text-white' : 'bg-zinc-700 text-zinc-300'}"
        onclick={() => activeTab = 'pipeline'}
      >
        AI Pipeline
      </button>
    </div>

    {#if activeTab === 'debug'}
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm text-zinc-400 mb-1">Supabase URL</label>
            <input 
              type="text" 
              bind:value={supabaseUrl}
              class="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-200" 
              placeholder="https://yourproject.supabase.co"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-zinc-400 mb-1">Limit</label>
              <input 
                type="number" 
                bind:value={limit}
                class="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-200"
              />
            </div>
            <div>
              <label class="block text-sm text-zinc-400 mb-1">Min Score</label>
              <input 
                type="number" 
                bind:value={minScore}
                class="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-200"
              />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-sm text-zinc-400 mb-1">Sort By</label>
            <select 
              bind:value={sortBy}
              class="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-200"
            >
              <option value="fomo_score">FOMO Score</option>
              <option value="created_at">Date Created</option>
              <option value="publication_date">Publication Date</option>
              <option value="id">ID</option>
            </select>
          </div>

          <div>
            <label class="block text-sm text-zinc-400 mb-1">Sort Direction</label>
            <select 
              bind:value={sortDir}
              class="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-200"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        <div class="flex gap-3">
          <button
            onclick={testDirectFetch}
            class="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg"
          >
            Test Direct Fetch
          </button>

          <button
            onclick={testServiceFunction}
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg"
          >
            Test Service Function
          </button>

          <button
            onclick={resetState}
            class="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded-lg"
          >
            Reset
          </button>
        </div>
      </div>
    {:else if activeTab === 'pipeline'}
      <div class="text-center py-8 text-zinc-400">
        <p>AI Pipeline controls will be added here.</p>
        <p class="text-sm mt-2">First, let's make sure our function endpoint works!</p>
      </div>
    {/if}
  </div>

  <!-- Response Area -->
  <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
    <!-- Left column: status and data -->
    <div class="lg:col-span-3 space-y-4">
      <!-- Status -->
      {#if newsLoading}
        <div class="bg-zinc-800 border border-zinc-700 rounded-lg p-6 flex justify-center">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
        </div>
      {:else if newsError}
        <div class="bg-red-900/30 border border-red-800/50 rounded-lg p-4">
          <h3 class="text-lg font-semibold text-red-400 mb-2">Error</h3>
          <p class="text-red-300">{newsError}</p>
          
          {#if functionUrl}
            <div class="mt-4 p-3 bg-black/30 rounded border border-red-800/30 overflow-auto text-sm">
              <p class="text-zinc-400">Attempted URL:</p>
              <pre class="text-zinc-300 mt-1">{functionUrl}</pre>
            </div>
          {/if}
        </div>
      {/if}

      <!-- Raw Response data -->
      {#if rawResponse}
        <div class="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
          <h3 class="text-lg font-semibold text-zinc-300 mb-2">Raw Response</h3>
          <pre class="bg-black/30 p-3 rounded border border-zinc-700 overflow-auto text-sm text-zinc-300 max-h-40">{rawResponse}</pre>
        </div>
      {/if}

      <!-- Response data -->
      {#if responseData}
        <div class="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
          <h3 class="text-lg font-semibold text-zinc-300 mb-2">Response Data</h3>
          <pre class="bg-black/30 p-3 rounded border border-zinc-700 overflow-auto text-sm text-zinc-300 max-h-60">{JSON.stringify(responseData, null, 2)}</pre>
        </div>
      {/if}

      <!-- News Items -->
      {#if news.length > 0}
        <div class="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
          <h3 class="text-lg font-semibold text-zinc-300 mb-4">News Items ({news.length})</h3>
          
          <div class="space-y-4">
            {#each news as item (item.id)}
              <div class="p-3 bg-zinc-900 border border-zinc-700 rounded-lg">
                <div class="flex justify-between">
                  <h4 class="font-medium text-zinc-200">{item.title}</h4>
                  <span class="bg-violet-500/20 text-violet-300 text-sm px-2 rounded-full">
                    Score: {item.fomo_score}
                  </span>
                </div>
                
                {#if item.summary}
                  <p class="text-zinc-400 text-sm mt-2">{item.summary}</p>
                {/if}
                
                <div class="mt-3 flex justify-between items-center text-sm">
                  <span class="text-zinc-500">{item.source || 'Unknown source'}</span>
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="text-violet-400 hover:underline"
                  >
                    View source
                  </a>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>

    <!-- Right column: pipeline -->
    <div class="lg:col-span-1">
      <div class="bg-zinc-800 border border-zinc-700 rounded-lg p-4 sticky top-4">
        <h3 class="text-lg font-semibold text-zinc-300 mb-3">Pipeline</h3>
        
        <div class="space-y-2">
          <div class="flex items-center gap-2 p-2 rounded bg-zinc-900/70 border border-zinc-700">
            <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span class="text-sm text-zinc-300">Database Connection</span>
          </div>
          
          <div class="flex items-center gap-2 p-2 rounded bg-zinc-900/70 border border-zinc-700">
            <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span class="text-sm text-zinc-300">API Endpoint</span>
          </div>
          
          <div class="flex items-center gap-2 p-2 rounded bg-zinc-900/70 border border-zinc-700">
            <div class="w-3 h-3 rounded-full bg-zinc-500"></div>
            <span class="text-sm text-zinc-300">Auth Token</span>
          </div>
          
          <div class="flex items-center gap-2 p-2 rounded bg-zinc-900/70 border border-zinc-700">
            <div class="w-3 h-3 rounded-full bg-zinc-500"></div>
            <span class="text-sm text-zinc-300">Content Processing</span>
          </div>
          
          <div class="flex items-center gap-2 p-2 rounded bg-zinc-900/70 border border-zinc-700">
            <div class="w-3 h-3 rounded-full bg-zinc-500"></div>
            <span class="text-sm text-zinc-300">Entity Extraction</span>
          </div>
          
          <div class="flex items-center gap-2 p-2 rounded bg-zinc-900/70 border border-zinc-700">
            <div class="w-3 h-3 rounded-full bg-zinc-500"></div>
            <span class="text-sm text-zinc-300">Summarization</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>