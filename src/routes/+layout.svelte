<script>
	import "../app.css";
	import { ModeWatcher } from "mode-watcher";
	import Nav from '$lib/components/Nav.svelte';
	</script>
 
<ModeWatcher />
<Nav />
<slot />