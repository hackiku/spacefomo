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

<div class="space-y-6 p-6 md:p-8">
	<!-- Product -->
	<section class="space-y-4 pb-6">
		<h2 class="text-2xl font-medium text-foreground">About SpaceFomo</h2>
		<p class="text-lg leading-relaxed text-muted-foreground">
			Your window to the cosmos. Space news curated by the community, distilled by AI — with summaries, insights, and a FOMO score that measures how much you'll regret missing out.
		</p>
		<div class="max-w-sm pt-2">
			<EmailForm />
		</div>
	</section>

	<!-- Personal -->
	<section class="space-y-4 border-t border-border pt-6">
		<div class="flex items-start gap-6">
			<div class="flex-1 space-y-4">
				<h3 class="text-xl font-medium text-foreground flex items-center gap-2">
					<span>Hi, I'm Ivan</span> 
					<span class="text-primary">👋</span> 
					<span class="hidden sm:inline text-muted-foreground font-light">Wanna go to space?</span>
				</h3>
				<p class="leading-relaxed text-muted-foreground">
					Indie founder & product designer building SpaceFomo and 
					<a href="https://pipewriter.io"
						class="text-primary transition-colors hover:text-secondary underline underline-offset-4"
						target="_blank"
						rel="noopener noreferrer">Pipewriter</a>. 
					
					Since my first day of flight school, I've been obsessed with
					<a href="https://wingy.vercel.app"
						class="text-primary transition-colors hover:text-secondary underline underline-offset-4"
						target="_blank"
						rel="noopener noreferrer">wing design</a>,
					<a href="https://6pack.cc"
						class="text-primary transition-colors hover:text-secondary underline underline-offset-4"
						target="_blank"
						rel="noopener noreferrer">pilot UX</a>, and
					<a href="https://jzro.co"
						class="text-primary transition-colors hover:text-secondary underline underline-offset-4"
						target="_blank"
						rel="noopener noreferrer">orbital flight</a> interfaces.
				</p>
			</div>

			<div class="h-24 w-24 flex-shrink-0 overflow-hidden border border-border">
				<img src="/api/placeholder/96/96" alt="Ivan" class="h-full w-full object-cover" />
			</div>
		</div>

		<p class="leading-relaxed text-muted-foreground">
			Maybe I can help build your space project? Let's test in production together.
		</p>
	</section>

	<!-- Contact -->
	<section class="flex items-center gap-4 pt-4 border-t border-border">
		<button
			class="group relative flex-1 flex items-center gap-2 
					border border-border bg-card/50 px-4 py-2
					hover:bg-muted transition-colors
					before:absolute before:inset-0
					before:border before:border-primary/10
					before:translate-x-0.5 before:translate-y-0.5
					before:transition-transform before:duration-300
					hover:before:translate-x-0 hover:before:translate-y-0"
			onclick={copyEmail}
		>
			<span class="text-muted-foreground group-hover:text-foreground">{email}</span>
			<Copy weight="light" class="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
			{#if copySuccess}
				<span class="text-xs text-primary font-medium">Copied!</span>
			{/if}
		</button>

		<a
			href="https://linkedin.com/in/ivankaraman"
			target="_blank"
			rel="noopener noreferrer"
			class="group relative flex items-center justify-center h-10 w-10
                 bg-muted border border-border text-muted-foreground
                 hover:text-foreground transition-colors
                 before:absolute before:inset-0
                 before:border before:border-primary/10
                 before:translate-x-0.5 before:translate-y-0.5
                 before:transition-transform before:duration-300
                 hover:before:translate-x-0 hover:before:translate-y-0"
			aria-label="Ivan's LinkedIn profile"
		>
			<LinkedinLogo class="h-5 w-5" />
		</a>
	</section>
</div>