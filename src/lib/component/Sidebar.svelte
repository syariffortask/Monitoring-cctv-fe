<script>
  import { fade } from 'svelte/transition';
  import NavItems from './NavItems.svelte';
  import MenuItems from './MenuItems.svelte';
  import { Search, Cctv, LogOut, LayoutDashboardIcon, X,Home} from 'lucide-svelte';
  import { createEventDispatcher } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import Swal from 'sweetalert2';
  export let minimized = false; // desktop
  export let mobileOpen = false; // mobile
  export let role = 'admin';
  const dispatch = createEventDispatcher();

  const closeMobile = () => {
    dispatch("mobileToggle", false);
  };

  const handleLogout = async () => {
  const result = await Swal.fire({
    title: 'Kamu Yakin?',
    text: "Anda akan logout dan keluar dari aplikasi.",
    icon: 'warning',
    iconColor: '#1E2939',
    showCancelButton: true,
    confirmButtonColor: '#CDD2CF',
    cancelButtonColor: '#1E2939',
    confirmButtonText: 'Ya, Keluar!'
  });

    if (result.isConfirmed) {
      localStorage.removeItem('token');
      goto('/'); // redirect setelah logout sukses
    
    }
  };
  const menus = [
    { label: 'Dashboard', icon: Home, href: '/dashboard', roles: ['admin','user'] },
    { label: 'Detection', icon: Search, href: '/detection', roles: ['admin','user'] },
    { label: 'Camera', icon: Cctv, href: '/camera', roles: ['admin'] },
    { label: 'Logout', icon: LogOut, roles: ['admin','user'], onClick: () => handleLogout() },
  ];
</script>

<!-- Sidebar desktop -->
<aside class={`hidden md:flex transition-all duration-300 ${minimized ? 'w-20' : 'w-64'} bg-gray-900 text-white p-4 space-y-6 flex-col`}>
  <div class="flex items-center justify-center border-b border-gray-500 pb-4 mb-2">
    <img
      src={minimized
        ? 'img/logo_cpi.png'
        : 'img/cpi.png'}
      alt="Logo"
      class={minimized ? 'h-8' : 'h-10'}
    />
  </div>
  <nav class="space-y-1 text-white font-medium">
    {#each menus as menu (menu.href)}
      {#if menu.roles.includes(role)}
        <NavItems {...menu} {minimized} />
      {/if}
    {/each}
  </nav>
</aside>

<!-- Sidebar mobile -->
{#if mobileOpen}
  <div class="md:hidden w-full fixed inset-0 bg-black/50 z-[99]">
  
    <div class="fixed bottom-0 w-full p-8 bg-gray-900 text-white rounded-t-3xl " transition:fade={{ duration: 100 }}>
      <!-- <button class="absolute bottom-20 right-50" on:click={closeMobile}>
        <X size={25} color="white" />
      </button> -->
      <ul class="flex space-x-2 justify-between list-none">
        {#each menus as menu}
          {#if menu.roles.includes(role)}
            <MenuItems {menu} {closeMobile} />
          {/if}
        {/each}
      </ul>
    </div>
  </div>
{/if}
