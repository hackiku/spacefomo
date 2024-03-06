<script>
  import Nav from '$lib/ui/Nav.svelte';
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

	<div class="w-full max-w-md">
			<div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0 md:space-x-4">
					<div class="flex-1">
							<input type="text" id="upload-url" class="w-full px-4 py-2 border-2 border-gray-200 text-gray-900" placeholder="Enter URL">
					</div>
					<button type="submit" class="mt-2 md:mt-0 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors">Upload URL</button>
			</div>
	</div>

</section>

</main>
