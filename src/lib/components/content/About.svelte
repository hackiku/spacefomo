<!-- src/lib/components/content/About.svelte -->
<script lang="ts">
	import { Copy, LinkedinLogo } from 'phosphor-svelte';
	import EmailForm from '../cta/email/EmailForm.svelte';

	let copySuccess = $state(false);
	const email = 'ivan@spacefomo.com';

	async function copyEmail() {
		try {
			await navigator.clipboard.writeText(email);
			copySuccess = true;
			setTimeout(() => (copySuccess = false), 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}
</script>

<div class="space-y-2 p-8">
	<!-- Product -->
	<section class="space-y-4 pb-8">
		<h2 class="text-2xl font-medium text-zinc-100">About Spacefomo</h2>
		<p class="text-lg leading-normal text-zinc-400">
			Space news sent by you, digested by AI. Summaries, data and a FOMO score—how much will you
			dread being out of the loop.
		</p>
		<EmailForm />
	</section>

	<!-- Personal -->
	<section class="space-y-3">
		<div class="flex items-start gap-6">
			<div class="flex-1 space-y-4">
				<h3 class="text-xl font-medium text-zinc-200">Hi I'm Ivan 👋 Wanna go to space?</h3>
				<p class="leading-relaxed text-zinc-400">
					Indie founder & product designer. Building Spacefomo and <a
						href="https://pipewriter.io"
						class="text-violet-400 transition-colors hover:text-violet-300"
						target="_blank"
						rel="noopener noreferrer">Pipewriter</a
					>, UX app for writers. Since day 1 of flight school I've been obsessed with 
				
				
							<a
				href="https://wingy.vercel.app"
				class="text-violet-400 transition-colors hover:text-violet-300"
				target="_blank"
				rel="noopener noreferrer">wing design</a
			>,
			<a
				href="https://6pack.cc"
				class="text-violet-400 transition-colors hover:text-violet-300"
				target="_blank"
				rel="noopener noreferrer">pilot UX</a
			>, 
			<a
				href="https://jzro.co"
				class="text-violet-400 transition-colors hover:text-violet-300"
				target="_blank"
				rel="noopener noreferrer">orbital flight</a
			> aerospacey interfaces.
				</p>
			</div>

			<div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-full bg-zinc-800">
				<img src="/api/placeholder/96/96" alt="Ivan" class="h-full w-full object-cover" />
			</div>
		</div>

		<p class="leading-relaxed text-zinc-400">
			Maybe I can help build yours? Let's test in prod together
		</p>
	</section>

	<!-- Contact -->
	<section class="flex items-center gap-4 pt-4">
		<button
			class="group flex flex-1 items-center gap-2 rounded-lg border border-zinc-800
             px-4 py-2 transition-colors hover:bg-zinc-800/50"
			onclick={copyEmail}
		>
			<span class="text-zinc-400 group-hover:text-zinc-300">{email}</span>
			<Copy weight="light" class="h-4 w-4 text-zinc-500 group-hover:text-zinc-400" />
			{#if copySuccess}
				<span class="text-xs text-emerald-500">Copied!</span>
			{/if}
		</button>

		<a
			href="https://linkedin.com/in/ivankaraman"
			target="_blank"
			rel="noopener noreferrer"
			class="rounded-full border border-zinc-800 p-2
             transition-colors hover:bg-zinc-800/50"
		>
			<LinkedinLogo class="h-5 w-5 text-zinc-400" />
		</a>
	</section>
</div>
