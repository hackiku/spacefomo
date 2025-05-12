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
      title: "Categories",
      href: "/news/categories",
      description: "Browse space news by topic and industry segment"
    }
  ];
</script>

{#snippet ListItem({ title, href, description })}
  <li>
    <NavigationMenu.Link
      class="hover:bg-zinc-800/50 hover:text-zinc-200 focus:bg-zinc-800/50 focus:text-zinc-200 block select-none 
             space-y-1 rounded-md p-3 leading-none no-underline transition-colors"
      {href}
    >
      <div class="text-sm font-medium leading-none">{title}</div>
      <p class="text-zinc-400 line-clamp-2 text-sm leading-snug">
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
          class="group inline-flex h-8 w-max items-center justify-center px-3 py-2 
                text-zinc-400 transition-all hover:scale-110 hover:text-zinc-200
                data-[state=open]:text-zinc-200"
        >
          API
          <CaretDown
            class="relative top-[1px] ml-1 h-3 w-3 transition-transform duration-200 
                  group-data-[state=open]:rotate-180"
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
            class="m-0 grid list-none gap-x-2.5 p-3 sm:w-[600px] sm:grid-flow-col sm:grid-rows-3"
          >
            <li class="row-span-3 mb-2 sm:mb-0">
              <NavigationMenu.Link
                href={dev ? "http://localhost:5173/api/v1/news" : "/api/v1/news"}
                class="flex h-full w-full select-none flex-col justify-end rounded-md
                      bg-zinc-800/50 p-6 no-underline hover:bg-zinc-800 focus:shadow-md"
              >
                <div class="mb-2 mt-4 text-lg font-medium text-zinc-200">API Access</div>
                <p class="text-zinc-400 text-sm leading-tight">
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
          class="group inline-flex h-8 w-max items-center justify-center px-3 py-2 
                text-zinc-400 transition-all hover:scale-110 hover:text-zinc-200
                data-[state=open]:text-zinc-200"
        >
          News
          <CaretDown
            class="relative top-[1px] ml-1 h-3 w-3 transition-transform duration-200 
                  group-data-[state=open]:rotate-180"
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
          class="inline-flex h-8 w-max items-center justify-center px-3 py-2 
                text-zinc-400 transition-all hover:scale-110 hover:text-zinc-200"
          onclick={nav.toggleAbout}
        >
          About
        </button>
      </NavigationMenu.Item>
    </NavigationMenu.List>
    
    <!-- Viewport for dynamic content -->
    <div class="perspective-[2000px] absolute right-0 top-full flex justify-center z-50">
      <NavigationMenu.Viewport
        class="bg-zinc-900 relative mt-2 h-[var(--bits-navigation-menu-viewport-height)] 
              w-[var(--bits-navigation-menu-viewport-width)] origin-[top_center] overflow-hidden 
              rounded-md border border-zinc-800 shadow-lg data-[state=open]:animate-in
              data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
              data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
      />
    </div>
  </NavigationMenu.Root>
</div>