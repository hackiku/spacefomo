<!-- $routes/app/+page.svelte -->

<main class="flex flex-col px-8 mt-12 md:px-28">
    <h1 class="text-2xl mb-4">OpenAI Integration App</h1>

    <div class="mb-4">
        <label for="prompt" class="block mb-2">Enter your prompt:</label>
        <input
            type="text"
            id="prompt"
            class="border p-2 w-full mb-4"
            placeholder="Type something..."
        />
        <button class="bg-blue-500 text-white px-4 py-2">Submit</button>
    </div>

    <div class="grid grid-cols-2 gap-4">
        <div>
            <h2 class="text-xl">Plaintext Response:</h2>
            <pre class="bg-gray-100 p-4">Plaintext response will be displayed here...</pre>
        </div>
        <div>
            <h2 class="text-xl">JSON Response:</h2>
            <pre class="bg-gray-100 p-4">JSON response will be displayed here...</pre>
        </div>
    </div>
</main>
