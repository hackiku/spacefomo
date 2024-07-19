<!-- $routes/app/+page.svelte -->

<script lang="ts">
    let responseMessage = '';

    async function testOpenAI() {
        try {
            const res = await fetch('/app/api/openai-test');
            const data = await res.json();
            responseMessage = data.message;
        } catch (error) {
            console.error('Error calling OpenAI test endpoint:', error);
            responseMessage = 'Error occurred while calling the OpenAI test endpoint.';
        }
    }
</script>

<main class="flex flex-col px-8 mt-12 md:px-28">
    <h1 class="text-2xl mb-4">OpenAI Integration App</h1>

    <button on:click={testOpenAI} class="bg-blue-500 text-white px-4 py-2 mb-4">Test OpenAI</button>

    <div>
        <h2 class="text-xl">Response:</h2>
        <pre class="bg-gray-800 p-4">{responseMessage}</pre>
    </div>
</main>
