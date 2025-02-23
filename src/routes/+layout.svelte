<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import '../app.css';
	import Nav from '$lib/layout/Nav.svelte';
	import Footer from '$lib/layout/Footer.svelte';
	import { fomoStore } from '$lib/stores/fomoStore';
	import { newsStore } from '$lib/stores/newsStore';

	let { data, children } = $props();

	$effect(() => {
		if (data.weeks?.length) {
			fomoStore.initializeWeeks(
				data.weeks.map((week) => ({
					...week,
					startDate: new Date(week.startDate),
					endDate: new Date(week.endDate),
					createdAt: new Date(week.createdAt)
				}))
			);
		}

		if (data.news?.length) {
			newsStore.initializeNews(data.news);
		}
	});
</script>

<div class="min-h-screen">
	<Nav />
	<main>
		{@render children()}
	</main>
	<Footer />
</div>
