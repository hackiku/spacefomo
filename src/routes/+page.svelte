<!-- homepage spacefomo -->

<script>
  import { onMount } from 'svelte';
  import { fetchNews } from '$lib/newsService.js';
  import Nav from '$lib/ui/Nav.svelte';
  import NewsCard from '$lib/NewsCard.svelte';
  import FomoCounter from '$lib/FomoCounter.svelte';
  // import NewsPocketbase from '$lib/NewsPocketbase.svelte';

  let newsItems = [
    {
      title: 'Virgin Galactic to launch 6th commercial spaceflight on Jan. 26',
      shortDescription: 'Featuring four private astronauts from diverse backgrounds.',
      longDescription: `Virgin Galactic, a key player in 2012 space tourism, announced their sixth commercial spaceflight at $120,000 a pop. Their Galactic 06, scheduled for January 26. This mission will carry four private astronauts, hailing from Texas, California, Austria, and a dual national from Ukraine and California. The flight utilizes an air-launched system comprising the VMS Eve carrier aircraft and the VSS Unity space plane. Piloted by C.J. Sturckow and Nicola Pecile, the mission will ascend to about 50,000 feet before launch. After a successful streak of spaceflights in 2023, Virgin Galactic plans to focus on developing their next-generation 'Delta class' space plane, aiming for higher frequency missions starting in 2025.`,
      link: 'https://www.space.com/virgin-galactic-6th-commercial-spaceflight-january-2024',
      image: 'virgin-galactic-spacecraft.jpg',
      date: '12 Dec 2023',
      time: '14:00',
      source: 'Space.com',
      fomoScore: '9.5'
    },
    {
      title: 'Mars Rover Discovers New Evidence of Water',
      shortDescription: 'Ingenuity finds historical water flow 20km from Jezero Crater.',
      longDescription: `NASA\'s Mars Rover has made a groundbreaking discovery on the Red Planet – traces of historical water flow. This revelation is not just about water; it hints at the possibility of life in Mars\' past. The Rover\'s findings add a significant piece to the puzzle of Mars\' environmental history, opening up new avenues for research and exploration. Scientists are now keenly analyzing this data, as it could reshape our understanding of the Martian landscape and its capacity to have supported life. This discovery propels us closer to answering the age-old question: Are we alone in the universe?`,
      link: '#',
      image: 'mars-rover.jpg',
      date: '12 Dec 2023',
      time: '14:00',
      source: 'NASA',
      fomoScore: '9.5'
    },
    {
      title: 'SpaceX Announces New Lunar Mission',
      shortDescription: 'SpaceX sets its sights on the Moon with a new mission for late 2023.',
      longDescription: `SpaceX is embarking on an ambitious lunar mission targeted for late 2023, marking a significant milestone in space exploration. Key highlights of this mission include:
- Establishment of a sustainable human base on the Moon, paving the way for prolonged lunar habitation.
- Advances in lunar research and potential resource utilization, crucial for future deep-space missions.
- Development of technologies to ensure astronaut safety and efficient lunar surface operations.
- Exploration of the Moon's surface, offering new insights into its composition and history.
Why it matters: This mission represents a pivotal step in expanding human presence beyond Earth, laying the groundwork for further space exploration and potential interplanetary travel.
`,
      link: '#',
      image: 'spacex-moon.jpg',
      date: '3 days ago',
      time: '18:30',
      source: 'SpaceX',
      fomoScore: '9.8'
    },
    {
      title: 'Hubble Captures Breathtaking New Galaxy Image',
      shortDescription: 'The Hubble Space Telescope reveals stunning new details of a distant galaxy.',
      longDescription: `In a remarkable feat of cosmic photography, the Hubble Space Telescope has captured a breathtaking image of a distant galaxy, revealing new details that were previously obscured. This new image provides astronomers with invaluable insights into the galaxy\'s structure, composition, and the mysteries of its luminous core. The clarity and detail of the image have left scientists and space enthusiasts alike in awe, offering a glimpse into the complexities of our universe and reminding us of the endless wonders yet to be discovered.`,
      link: '#',
      image: 'hubble-galaxy.jpg',
      date: '2023-07-21',
      time: '11:45',
      source: 'Space.com',
      fomoScore: '9.2'
    }
  ];

  onMount(() => {
    fetchNews();
  });

</script>


<!-- ------------------------------- HTML --------------------------------- -->
<Nav />

<!-- <NewsPocketbase /> -->

<main class="container mx-auto px-4">

<!-- hero -->
<section class="hero mt-8 py-8 flex justify-center items-center">
  <div class="max-w-md text-center">
    <h2 class="text-4xl font-bold text-white mb-4">Space Race FOMO relief in 100 words a pop</h2>
    <p class="text-xl text-gray-500 mb-8">AI-digested space industry news you can't afford to miss.</p>
    <!-- <form class="flex justify-center items-center">
      <input type="email" placeholder="email away" class="border border-gray-300 rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300" />
      <button class="bg-brandBlue rounded-r text-white px-4 py-2 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300">Subscribe</button>
    </form> -->
  </div>
</section>


<div class="container mx-auto px-40">

<!-- fomo counter -->
<FomoCounter />

<!-- categories -->
<section class="categories mt-8 mb-8">
  <div class="flex space-x-4">
    <a href="#" class="text-gray-500 hover:bg-gray-300 px-4 py-2 rounded-full border border-gray-500">Spaceflight</a>
    <a href="#" class="text-gray-500 hover:bg-gray-300 px-4 py-2 rounded-full border border-gray-500">Startups</a>
    <a href="#" class="text-gray-500 hover:bg-gray-300 px-4 py-2 rounded-full border border-gray-500">Space Exploration</a>
    <a href="#" class="text-gray-500 hover:bg-gray-300 px-4 py-2 rounded-full border border-gray-500">Breakthroughs</a>    
  </div>
</section>


<!-- <section>
  {#each newsItems as item}
    <NewsCard
      title={item.title}
      shortDescription={item.shortDescription}
      longDescription={item.longDescription}
      link={item.link}
      image={item.image}
      date={item.date}
      time={item.time}
      source={item.source}
      fomoScore={item.fomoScore} />
  {/each}
</section> -->
  
<section class="cta-section bg-gray-800 text-center p-6 rounded-lg mx-auto mt-8">
  <h2 class="text-3xl text-white font-bold mb-4">Call to Arms</h2>
  <p class="text-gray-300 mb-8">Placeholder subheading</p>
  <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
    Help Build Timeline
  </button>
</section>

</div>
</main>

<footer>footer</footer>

<style>
/* Add additional styling as needed */
</style>
