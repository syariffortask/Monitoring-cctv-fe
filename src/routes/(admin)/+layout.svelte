<script>
  import Sidebar from '$lib/component/Sidebar.svelte';
  import Navbar from '$lib/component/Navbar.svelte';
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';

  const queryClient = new QueryClient();

  let minimized = false;   // desktop
  let mobileOpen = false;  // mobile

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      mobileOpen = !mobileOpen;
    } else {
      minimized = !minimized;
    }
  };

  const handleMobileToggle = (e) => {
    mobileOpen = e.detail;
  };
</script>

<div class="flex h-screen font-[Poppins] overflow-x-hidden">
  <Sidebar {minimized} {mobileOpen} on:mobileToggle={handleMobileToggle} />

  <div class="flex flex-col flex-1 overflow-x-hidden">
    <Navbar {toggleSidebar} />

    <QueryClientProvider client={queryClient}>
      <main class="flex-1 p-6 overflow-x-hidden">
        <slot />
      </main>
    </QueryClientProvider>
  </div>
</div>
