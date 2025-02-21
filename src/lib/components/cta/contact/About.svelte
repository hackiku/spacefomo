<!-- src/lib/components/cta/contact/About.svelte -->
<script lang="ts">
  import { Copy } from 'phosphor-svelte';
	import EmailForm from '../email/EmailForm.svelte'
  
  let copySuccess = $state(false);
  const email = 'ivan@spacefomo.com';

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      copySuccess = true;
      setTimeout(() => copySuccess = false, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }
</script>

<div class="p-8 space-y-8">
  <!-- Product -->
  <section class="space-y-4">
    <h2 class="text-2xl font-medium text-zinc-100">About Spacefomo</h2>
    <p class="text-zinc-400 leading-relaxed">
      Spacefomo tracks the pulse of the new space race through AI-curated news with a 
			"FOMO score" - how much it makes you dread being out of the loop. 
			measuring launch activity, industry buzz, and technological breakthroughs. 
      Stay informed about the latest developments in space.
    </p>
		<EmailForm />
  </section>

  <!-- Personal -->
  <section class="space-y-4">
    <h3 class="text-xl font-medium text-zinc-200">About Me</h3>
    <p class="text-zinc-400 leading-relaxed">
      I'm Ivan, an aerospace engineer turned product designer and developer. I build tools 
      that make complex engineering click, like <a href="https://pipewriter.io" 
      class="text-violet-400 hover:text-violet-300 transition-colors" 
      target="_blank" rel="noopener noreferrer">Pipewriter</a>, 
      a UX writing app bridging the gap between words and wireframes.
    </p>
  </section>

  <!-- Services -->
  <section class="space-y-4">
    <h3 class="text-xl font-medium text-zinc-200">Work With Me</h3>
    <p class="text-zinc-400 leading-relaxed">
      I help space startups build and launch compelling digital products. From interactive 
      mission visualizations to dynamic dashboards for launch control, I combine aerospace 
      engineering principles with modern web technology to create tools that engineers love 
      and investors understand.
    </p>
  </section>

  <!-- Contact -->
  <section class="pt-4">
    <button 
      class="group flex items-center gap-2 px-4 py-2 rounded-lg
             border border-zinc-800 hover:bg-zinc-800/50 transition-colors"
      onclick={copyEmail}
    >
      <span class="text-zinc-400 group-hover:text-zinc-300">{email}</span>
      <Copy 
        weight="light" 
        class="w-4 h-4 text-zinc-500 group-hover:text-zinc-400" 
      />
      {#if copySuccess}
        <span class="text-xs text-emerald-500">Copied!</span>
      {/if}
    </button>
  </section>
</div>