<script>
  // Placeholder for news items (you can replace this with your actual data fetching logic)
  let newsItems = [
    { title: "Mars Rover Discovers New Evidence of Water", summary: "NASA's Mars Rover has made a groundbreaking discovery on the Red Planet – traces of historical water flow. This revelation is not just about water; it hints at the possibility of life in Mars' past. The Rover's findings add a significant piece to the puzzle of Mars' environmental history, opening up new avenues for research and exploration. Scientists are now keenly analyzing this data, as it could reshape our understanding of the Martian landscape and its capacity to have supported life. This discovery propels us closer to answering the age-old question: Are we alone in the universe?" },
    { title: "SpaceX Announces New Lunar Mission", summary: "SpaceX has announced a new mission to the moon, scheduled for late 2023, aiming to establish a sustainable human presence." },
    { title: "SpaceX Announces New Lunar Mission", summary: "Hold on to your space helmets, fellow star gazers! SpaceX is gearing up for a monumental leap – a brand spanking new mission to the Moon, set for late 2023. This isn't just any lunar jaunt; it's the dawn of a new era! Imagine a sustainable human presence on the Moon, a base where astronauts can sip space coffee while gazing at Earth. The stakes? High. The excitement? Astronomical. If you've ever dreamt of moonwalking or felt that irresistible pull of the cosmos, this mission is a giant leap closer to that reality. Miss this, and you're missing a chapter of history. Get ready, space enthusiasts – the space race is on, and it's more thrilling than ever!"}

    // ... more news items
  ];
  


  




</script>

<div class="container mx-auto px-4">
  <header class="flex justify-between items-center py-4">
    <h1 class="text-md font-bold text-white">📡 spacefomo.com</h1>
    <nav>
      <ul class="flex space-x-4">
    <li><a href="#" class="text-white hover:text-gray-300">Feed</a></li>
        <li><a href="#" class="text-white hover:text-gray-300">About</a></li>
        <li><a href="#" class="text-white hover:text-gray-300">Join</a></li>
      </ul>
    </nav>
  </header>
  
  <!-- hero -->
  <section class="hero mt-8 py-8 flex justify-center items-center">
    <div class="max-w-md text-center">
      <h2 class="text-4xl font-bold text-white mb-4">Space Race FOMO relief in 100 words a pop</h2>
      <p class="text-xl text-gray-500 mb-8">Never miss a beat in space exploration and technology.</p>
      <form class="flex justify-center items-center">
        <input type="email" placeholder="email away" class="border border-gray-300 rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300" />
        <button class="bg-brandBlue rounded-r text-white px-4 py-2 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300">Subscribe</button>
      </form>
    </div>
  </section>
  
  <!-- categories -->
  <section class="categories mt-8 mb-8">
    <h3 class="text-xl text-white font-bold mb-4">Explore hot news</h3>
    <div class="flex space-x-4">
      <a href="#" class="text-gray-500 hover:bg-gray-300 px-4 py-2 rounded-full border border-gray-500">Spaceflight</a>
      <a href="#" class="text-gray-500 hover:bg-gray-300 px-4 py-2 rounded-full border border-gray-500">Startups</a>
      <a href="#" class="text-gray-500 hover:bg-gray-300 px-4 py-2 rounded-full border border-gray-500">Space Exploration</a>
      <a href="#" class="text-gray-500 hover:bg-gray-300 px-4 py-2 rounded-full border border-gray-500">Breakthroughs</a>    </div>
  </section>


  <section>
    {#each newsItems as item}
      <div class="news-item flex mb-6 bg-gray-800 shadow-xl rounded-xl overflow-hidden">
        <!-- Text Column -->
        <div class="text-column flex-1 p-6">
          <h3 class="text-2xl text-white font-bold mb-2">{item.title}</h3>
          <p class="text-gray-300">{item.summary}</p>
          <a href="{item.link}" class="text-blue-400 hover:text-blue-600 mt-4 inline-block">Read More</a>
        </div>

        <!-- Image Column -->
        <div class="image-column flex-none">
          <img src="{item.image}" alt="{item.title}" class="w-48 h-48 object-cover"/>
        </div>
      </div>
    {/each}
  </section>

  <section class="cta-section bg-gray-800 text-center p-6 rounded-lg mx-auto mt-8">
    <h2 class="text-3xl text-white font-bold mb-4">Call to Arms</h2>
    <p class="text-gray-300 mb-8">Placeholder subheading</p>
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Help Build Timeline
    </button>
  </section>
  
</div>

<footer>hey</footer>

<style>
  /* Add additional styling as needed */
</style>
