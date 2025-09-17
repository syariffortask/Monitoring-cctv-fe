<!-- Navbar.svelte -->
<script>
  export let toggleSidebar;
</script>

<nav class="flex items-center justify-between px-6 py-2 bg-white shadow sticky top-0 z-10">
  <!-- Toggle Button (kiri) -->
  <button on:click={toggleSidebar} aria-label="Toggle Sidebar" class="p-2 rounded hover:bg-gray-100">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" fill="none"
         viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"/>
    </svg>
  </button>

  <!-- Profile Picture (kanan) -->
  <div class="flex items-center space-x-3">
    <img src="https://avatar.iran.liara.run/public/boy" alt="Profile" class="w-10 h-10 rounded-full border-2 border-gray-300" />
  </div>
</nav>