<!-- $routes/+page.svelte -->

<script lang="ts">
  import Hero from "$lib/components/Hero.svelte";
  import FomoMeter from "$lib/components/FomoMeter.svelte";
  import Feed from "$lib/feed/Feed.svelte";
  import type { NewsItem } from "$lib/feed/NewsCard.svelte";

  let remainingTime = 12 * 13 * 59 * 1000; // 24 hours in milliseconds
  let currentScore = 185; // Placeholder FOMO score

  let newsItems: NewsItem[] = [
    {
      id: "1",
      title: "SpaceX Successfully Launches Starship Prototype",
      summary: "SpaceX's Starship prototype completed a successful high-altitude test flight, marking a significant milestone in the development of the company's next-generation spacecraft designed for missions to Mars.",
      tldr: "SpaceX's Starship prototype achieves successful high-altitude test flight, advancing Mars mission capabilities.",
      score: 1250,
      url: "https://example.com/spacex-starship-launch",
      tags: ["spacex", "starship", "mars"],
      source: "spacenews.com",
      readTime: "3m",
      dataPoints: [
        { label: "Flight Duration", value: "6 minutes" },
        { label: "Max Altitude", value: "10 km" },
        { label: "Prototype Version", value: "SN15" },
        { label: "Launch Site", value: "Boca Chica, TX" }
      ]
    },
    // ... Add more news items with the updated structure
  ];
</script>

<main class="relative flex flex-col items-center justify-center min-h-screen ">
  <Hero />
  <FomoMeter {remainingTime} {currentScore} />
  <Feed {newsItems} />
</main>