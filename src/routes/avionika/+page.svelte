<script>
  import Nav from '$lib/ui/Nav.svelte';
</script>

<Nav />

<main class="container mx-auto px-6 md:px-16 lg:px-26 xl:px-44 py-16 space-y-24">
	<!-- --------------------- HERO ------------------------------- -->
	<section class="flex flex-col items-center space-y-6">
		<h1 class="text-4xl font-bold text-white font-mono mb-4">avionika prodz</h1>
		<h4 class="text-xl font-bold text-white mb-4">General Dynamics F-16 Fighting Falcon</h4>
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
	<section class="flex flex-col items-center space-y-4">
		<h3 class="text-xl font-bold text-white">Info itd.</h3>
		
		<!-- Upload URL Form -->
		<form class="flex flex-col items-center space-y-2">
			<label for="upload-url" class="text-white">Upload URL</label>
			<input type="text" id="upload-url" class="px-4 py-2 border-2 border-gray-200 text-gray-900" placeholder="Enter URL">
			<button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Upload URL</button>
		</form>
		
		<!-- Upload File Form -->
		<form class="flex flex-col items-center space-y-2">
			<label for="upload-file" class="text-white">Upload File</label>
			<input type="file" id="upload-file" class="px-4 py-2 border-2 border-gray-200 text-gray-900">
			<button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Upload File</button>
		</form>
	</section>
</main>
