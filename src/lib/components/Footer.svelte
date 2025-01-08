<!-- src/lib/components/Footer.svelte -->
<script lang="ts">
  import { Github, Twitter, Linkedin, Mail } from 'lucide-svelte';
  import EmailForm from './cta/EmailForm.svelte';
</script>

<footer class="border-t border-border">
  <div class="container py-16">
    <!-- Email Form Section -->
    <div class="max-w-md mx-auto mb-16">
      <h3 class="text-2xl font-medium text-foreground mb-4 text-center">
        Stay in orbit
      </h3>
      <EmailForm />
    </div>

    <!-- Social Links -->
    <div class="flex justify-center gap-6">
      <a 
        href="mailto:hello@spacefomo.com" 
        class="p-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <Mail class="w-6 h-6" />
      </a>
      <a 
        href="https://github.com/spacefomo" 
        target="_blank" 
        rel="noopener noreferrer"
        class="p-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <Github class="w-6 h-6" />
      </a>
      <a 
        href="https://linkedin.com/company/spacefomo" 
        target="_blank" 
        rel="noopener noreferrer"
        class="p-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <Linkedin class="w-6 h-6" />
      </a>
    </div>
  </div>
</footer>