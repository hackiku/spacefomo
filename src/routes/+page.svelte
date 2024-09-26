<!-- $routes/+page.svelte -->

<script lang="ts">
  import Hero from "$lib/components/Hero.svelte";
  import FomoBar from "$lib/fomo/FomoBar.svelte";
  import Feed from "$lib/news/Feed.svelte";
  import type { NewsItem } from "$lib/news/NewsCard.svelte";

  let currentScore = 86;
  let remainingTime = 15950; // About 4.5 hours in seconds
  
  // Generate dates for the last 7 days
  let dates = Array.from({length: 7}, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }).reverse();

  function handleDateSelected(event: CustomEvent<string>) {
    console.log('Selected date:', event.detail);
    // Here you would typically update the currentScore and remainingTime based on the selected date
  }

  let newsItems: NewsItem[] = [
    {
      id: "1",
      title: "W Boson Mystery Solved: Standard Model Prevails",
      summary: "Large Hadron Collider confirms W boson mass aligns with Standard Model predictions, contradicting earlier Fermilab results. This discovery reinforces current physics understanding but disappoints hopes for new theories explaining dark matter.",
      tldr: "LHC confirms W boson mass matches Standard Model, closing potential avenue for new physics theories.",
      score: 95,
      url: "https://example.com/w-boson-mystery-solved",
      tags: ["particle physics", "LHC", "Standard Model"],
      source: "CERN",
      readTime: "4m",
      dataPoints: [
        { label: "W Boson Mass", value: "80,360.2 ± 9.9 MeV" },
        { label: "Standard Model Prediction", value: "80,357 ± 6 MeV" },
        { label: "Measurement Precision", value: "0.01%" },
        { label: "Implications", value: "No new physics" }
      ]
    },
    {
      id: "2",
      title: "Breakthrough in Ionic Propulsion for Deep Space Missions",
      summary: "Scientists develop highly efficient ionic propulsion system, potentially revolutionizing long-distance space travel. The new method promises increased thrust and lower fuel consumption, making missions to outer planets more feasible.",
      tldr: "New ionic propulsion tech could enable longer, faster deep space missions.",
      score: 88,
      url: "https://example.com/ionic-propulsion-breakthrough",
      tags: ["space tech", "propulsion", "deep space"],
      source: "Space.com",
      readTime: "3m",
      dataPoints: [
        { label: "Thrust Increase", value: "35%" },
        { label: "Fuel Efficiency", value: "50% improvement" },
        { label: "Potential Range", value: "Outer solar system" },
        { label: "Development Stage", value: "Advanced prototype" }
      ]
    },
    {
      id: "3",
      title: "AI Achieves Human-Level Performance in Complex Strategy Game",
      summary: "A new AI model demonstrates human-level strategic thinking in a complex, multiplayer game environment. This breakthrough suggests significant advancements in AI's ability to handle nuanced decision-making and long-term planning.",
      tldr: "AI matches human strategy in complex game, signaling leap in decision-making capabilities.",
      score: 92,
      url: "https://example.com/ai-strategy-game-breakthrough",
      tags: ["AI", "machine learning", "game theory"],
      source: "TechCrunch",
      readTime: "5m",
      dataPoints: [
        { label: "Game Complexity", value: "High" },
        { label: "AI Performance", value: "Human-equivalent" },
        { label: "Training Time", value: "500,000 games" },
        { label: "Key Innovation", value: "Long-term planning" }
      ]
    }
  ];
</script>

<main class="relative flex flex-col items-center justify-center min-h-screen text-white bg-gradient-to-b from-gray-900 to-black">
  <Hero />
  <div class="w-full relative mb-24">
    <FomoBar {currentScore} {remainingTime} {dates} on:dateSelected={handleDateSelected} />
  </div>
  <Feed {newsItems} />
</main>

<style>
  :global(body) {
    background-color: #000;
    color: #fff;
    font-family: 'Roboto', sans-serif;
  }

  main {
    padding: 2rem;
  }

  :global(.news-card) {
    background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
    border: 1px solid #333;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }

  :global(.news-card:hover) {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }

  :global(.fomo-score) {
    font-size: 1.5rem;
    font-weight: bold;
    color: #ff4500;
  }

  :global(.tag) {
    background-color: rgba(255, 69, 0, 0.2);
    color: #ff4500;
    font-weight: 500;
  }
</style>