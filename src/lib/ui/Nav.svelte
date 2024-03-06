<!-- $lib/ui/Nav.svelte -->
<script>
  let menuOpen = false;
</script>


<nav class="
lg:mx-20 md:mx-20 mx-4 flex flex-col md:flex-row justify-between items-center p-4">

<!-- <nav class="flex flex-col justify-start p-6 mx-20"> -->
  <div class="container mx-auto flex justify-between w-full">
    <a href="/" class="logo text-2xl">📡 spacefomo</a>
    <button class="md:hidden" on:click={() => menuOpen = !menuOpen}>
      <!-- Hamburger Icon SVG -->
      <svg viewBox="0 0 20 20" fill="currentColor" class="w-8 h-8">
        <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
      </svg>
    </button>
  </div>

    <ul class={`transition-all duration-300 ease-out ${menuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 ml-auto`}>
      <li><a href="/avionika">avionika</a></li>
      <li><a href="/feed">feed</a></li>
      <li><a href="/deathray">moon.gg</a></li>
      <li>
        <button class="bg-brandBlue p-3 px-6 text-white whitespace-nowrap">
          Sign Up
        </button>
      </li>
      <li class="relative group">
        <a class="flex h-6 w-6 justify-center items-center relative" href="https://workspace.google.com/u/0/marketplace/app/autolatex_equations/850293439076" target="_blank" rel="noopener noreferrer">
          <img src="icons/docs-logo.svg" alt="Docs" class="">
          <div class="absolute hidden group-hover:flex justify-center items-center
            bg-brandBlue p-1 whitespace-nowrap"
            style="transform: rotate(-20deg);" >
            <span class="text-white text-xs">add-on →</span>
          </div>
        </a>
      </li>
    </ul>
</nav>
