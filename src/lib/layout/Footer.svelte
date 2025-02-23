<!-- src/lib/components/Footer.svelte -->
<script lang="ts">
  import { GithubLogo, TwitterLogo , LinkedinLogo, Envelope } from 'phosphor-svelte';
  // import EmailForm from './cta/EmailForm.svelte';
</script>

<footer class="border-t border-stone-800">
  <div class="container py-8">
    <!-- Email Form Section -->
    <div class="max-w-md mx-auto mb-16">
      <h3 class="text-2xl font-medium text-foreground mb-4 text-center">
        Stay in orbit
      </h3>
      <!-- <EmailForm /> -->
    </div>

    <!-- Social Links -->
    <div class="flex justify-center gap-6">
      <a 
        href="mailto:hello@spacefomo.com" 
        class="p-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <Envelope class="w-6 h-6" />
      </a>
      <a 
        href="https://github.com/spacefomo" 
        target="_blank" 
        rel="noopener noreferrer"
        class="p-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <GithubLogo class="w-6 h-6" />
      </a>
      <a 
        href="https://linkedin.com/company/spacefomo" 
        target="_blank" 
        rel="noopener noreferrer"
        class="p-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <LinkedinLogo class="w-6 h-6" />
      </a>
    </div>
		<a href="https://www.buymeacoffee.com/spacefomo" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-violet.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
  </div>
</footer>