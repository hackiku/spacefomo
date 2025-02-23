<!-- src/lib/layout/GridLayout.svelte -->
<script lang="ts">
	import Controls from '$lib/features/news/controls/Controls.svelte';
	import News from '$lib/features/news/News.svelte';
	import Timeline from '$lib/features/fomo/Timeline.svelte';
	import { fomoStore } from '$lib/stores/fomoStore';
	import type { LayoutOption, GridClasses } from '$lib/types/layout';
	import { onMount } from 'svelte';

	let isSticky = $state(false);
	let sidebarRef: HTMLDivElement;
	let activeLayout = $state<LayoutOption['name']>('normal');
	let columnCount = $state(2);

	const gridClasses: Record<LayoutOption['name'], GridClasses> = {
		compact: {
			container: 'max-w-2xl px-4',
			main: 'md:grid-cols-12 gap-16',
			sidebar: 'md:col-span-3 bg-violet-900/10 -ml-44 mr-44',
			content: 'md:col-span-9 -ml-22 pr-44'
		},
		normal: {
			container: 'max-w-4xl',
			main: 'md:grid-cols-12 gap-20',
			sidebar: 'md:col-span-4',
			content: 'md:col-span-8'
		},
		wide: {
			container: 'max-w-7xl px-4 sm:px-12',
			main: 'md:grid-cols-12 gap-10',
			sidebar: 'md:col-span-4',
			content: 'md:col-span-8'
		}
	};

	onMount(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				isSticky = !entry.isIntersecting;
			},
			{ threshold: 0, rootMargin: '-1px 0px 0px 0px' }
		);

		if (sidebarRef) {
			observer.observe(sidebarRef);
		}

		return () => observer.disconnect();
	});

	const getGridClass = (count: number) =>
		count === 1 ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2';
	const gridClass = $derived(getGridClass(columnCount));

	const currentWeek = $derived(
		$fomoStore.weeks.find((w) => w.weekNumber === $fomoStore.activeWeek)
	);
</script>

<div class="mx-auto {gridClasses[activeLayout].container}">
	<div class="grid grid-cols-1 {gridClasses[activeLayout].main} pb-32">
		<!-- Left Column -->
		<div
			bind:this={sidebarRef}
			class="space-y-8 transition-all duration-200 {gridClasses[activeLayout].sidebar}"
			class:sticky={isSticky}
			class:top-0={isSticky}
		>
			<div class="h-screen sticky flex flex-col gap-12 top-24">
				<Controls bind:activeLayout bind:columnCount class="md:sticky md:top-4" />
  	  	<Timeline />
	  	</div>

		</div>

		<!-- Right Column - News Grid -->
		<div class={gridClasses[activeLayout].content}>
			<div class="gap-6 {gridClass}">
				<News />
			</div>
		

		</div>
	</div>
</div>
