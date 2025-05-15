<!-- src/lib/components/layout/NavigationMenu.svelte -->
<script lang="ts">
  import { NavigationMenu } from "bits-ui";
  import { CaretDown } from 'phosphor-svelte';
  import { dev } from '$app/environment';
  import { page } from '$app/stores';
  import { useNav } from '$lib/context/navContext.svelte';
  
  // Get navigation context
  const nav = useNav();
  
  // Helper function to determine if link is active
  const isActive = (path: string) => $page.url.pathname === path;
  
  // API section links
  const apiLinks = [
    {
      title: "News API",
      href: "/api/v1/news",
      description: "Get the latest space news in a structured JSON format"
    },
    {
      title: "Admin",
      href: "/admin",
      description: "Content management for authorized users"
    },
    {
      title: "Share",
      href: "/share",
      description: "Share interesting space news with your network"
    }
  ];
  
  // News section links
  const newsLinks = [
    {
      title: "Latest News",
      href: "/news",
      description: "Browse the most recent space industry updates"
    },
    {
      title: "Weekly FOMO",
      href: "/news/weekly",
      description: "See which news made the biggest impact this week"
    },
    {
      title: "Events",
      href: "/events",
      description: "Testy debuggy for news system"
    }
  ];
</script>

{#snippet ListItem({ title, href, description })}
  <li>
    <NavigationMenu.Link
      class="group relative block select-none space-y-1 p-3 hover:bg-muted border border-transparent
             hover:border-border text-foreground no-underline transition-colors
             before:absolute before:inset-0
             before:border before:border-primary/0
             before:translate-x-0.5 before:translate-y-0.5
             before:transition-transform before:duration-300
             hover:before:border-primary/10
             hover:before:translate-x-0 hover:before:translate-y-0
             cursor-pointer"
      {href}
    >
      <div class="text-sm font-medium leading-none">{title}</div>
      <p class="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
        {description}
      </p>
    </NavigationMenu.Link>
  </li>
{/snippet}

<div class="flex items-center gap-6">
  <!-- Navigation Menu Component -->
  <NavigationMenu.Root class="relative __z-50 flex">
    <NavigationMenu.List
      class="group flex list-none items-center justify-center"
    >
      <!-- API Section -->
      <NavigationMenu.Item value="api">
        <NavigationMenu.Trigger
          class="group relative inline-flex h-10 items-center justify-center px-4 py-2 
                text-muted-foreground transition-all hover:text-foreground
                data-[state=open]:text-primary
                before:absolute before:inset-0
                before:border before:border-primary/0
                before:translate-x-0.5 before:translate-y-0.5
                before:transition-transform before:duration-300
                hover:before:border-primary/10
                hover:before:translate-x-0 hover:before:translate-y-0
                data-[state=open]:before:border-primary/20
                data-[state=open]:before:translate-x-0 data-[state=open]:before:translate-y-0
                cursor-pointer active:scale-95"
        >
          <span class="text-base">API</span>
          <CaretDown
            class="relative top-[1px] ml-1.5 h-3.5 w-3.5 transition-transform duration-200 
                  group-data-[state=open]:rotate-180 text-muted-foreground/70 group-data-[state=open]:text-primary/70"
            aria-hidden="true"
          />
        </NavigationMenu.Trigger>
        <NavigationMenu.Content
          class="absolute left-0 top-0 data-[motion=from-start]:animate-in data-[motion=from-end]:animate-in
                data-[motion=to-start]:animate-out data-[motion=to-end]:animate-out data-[motion=from-start]:fade-in
                data-[motion=from-end]:fade-in data-[motion=to-start]:fade-out data-[motion=to-end]:fade-out
                data-[motion=from-start]:slide-in-from-left-5 data-[motion=from-end]:slide-in-from-right-5
                data-[motion=to-start]:slide-out-to-left-5 data-[motion=to-end]:slide-out-to-right-5"
        >
          <ul
            class="m-0 grid list-none gap-3 p-4 sm:w-[600px] sm:grid-flow-col sm:grid-rows-3"
          >
            <li class="row-span-3 mb-2 sm:mb-0">
              <NavigationMenu.Link
                href={dev ? "http://localhost:5173/api/v1/news" : "/api/v1/news"}
                class="group relative flex h-full w-full select-none flex-col justify-end
                      bg-card border border-border p-6 no-underline 
                      hover:bg-muted transition-colors
                      before:absolute before:inset-0
                      before:border before:border-primary/0
                      before:translate-x-0.5 before:translate-y-0.5
                      before:transition-transform before:duration-300
                      hover:before:border-primary/10
                      hover:before:translate-x-0 hover:before:translate-y-0
                      cursor-pointer"
              >
                <div class="mb-2 mt-4 text-lg font-medium text-foreground">API Access</div>
                <p class="text-muted-foreground text-sm leading-relaxed">
                  Get structured space news data for your applications and integrations
                </p>
              </NavigationMenu.Link>
            </li>
            {#each apiLinks as link}
              {@render ListItem(link)}
            {/each}
          </ul>
        </NavigationMenu.Content>
      </NavigationMenu.Item>
      
      <!-- News Section -->
      <NavigationMenu.Item value="news">
        <NavigationMenu.Trigger
          class="group relative inline-flex h-10 items-center justify-center px-4 py-2 
                text-muted-foreground transition-all hover:text-foreground
                data-[state=open]:text-primary
                before:absolute before:inset-0
                before:border before:border-primary/0
                before:translate-x-0.5 before:translate-y-0.5
                before:transition-transform before:duration-300
                hover:before:border-primary/10
                hover:before:translate-x-0 hover:before:translate-y-0
                data-[state=open]:before:border-primary/20
                data-[state=open]:before:translate-x-0 data-[state=open]:before:translate-y-0
                cursor-pointer active:scale-95"
        >
          <span class="text-base">News</span>
          <CaretDown
            class="relative top-[1px] ml-1.5 h-3.5 w-3.5 transition-transform duration-200 
                  group-data-[state=open]:rotate-180 text-muted-foreground/70 group-data-[state=open]:text-primary/70"
            aria-hidden="true"
          />
        </NavigationMenu.Trigger>
        <NavigationMenu.Content
          class="absolute left-0 top-0 data-[motion=from-start]:animate-in data-[motion=from-end]:animate-in
                data-[motion-to-start]:animate-out data-[motion=to-end]:animate-out data-[motion=from-start]:fade-in
                data-[motion=from-end]:fade-in data-[motion=to-start]:fade-out data-[motion=to-end]:fade-out
                data-[motion=from-start]:slide-in-from-left-5 data-[motion=from-end]:slide-in-from-right-5
                data-[motion=to-start]:slide-out-to-left-5 data-[motion=to-end]:slide-out-to-right-5"
        >
          <ul class="grid gap-3 p-4 sm:w-[500px] md:grid-cols-2">
            {#each newsLinks as link}
              {@render ListItem(link)}
            {/each}
          </ul>
        </NavigationMenu.Content>
      </NavigationMenu.Item>
      
      <!-- About Link (Opens Drawer Instead of Navigation) -->
      <NavigationMenu.Item>
        <button
          class="group relative inline-flex h-10 items-center justify-center px-4 py-2 
                text-muted-foreground transition-all hover:text-foreground
                before:absolute before:inset-0
                before:border before:border-primary/0
                before:translate-x-0.5 before:translate-y-0.5
                before:transition-transform before:duration-300
                hover:before:border-primary/10
                hover:before:translate-x-0 hover:before:translate-y-0
                cursor-pointer active:scale-95"
          onclick={nav.openAbout}
        >
          <span class="text-base">About</span>
        </button>
      </NavigationMenu.Item>
    </NavigationMenu.List>
    
    <!-- Viewport for dynamic content -->
    <div class="perspective-[2000px] absolute right-0 top-full flex justify-center z-50">
      <NavigationMenu.Viewport
        class="relative mt-2 h-[var(--bits-navigation-menu-viewport-height)] 
              w-[var(--bits-navigation-menu-viewport-width)] origin-[top_center] overflow-hidden 
              bg-background rounded-b-2xl __border __border-border shadow-md data-[state=open]:animate-in
              data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
              data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
      />
    </div>
  </NavigationMenu.Root>
</div>