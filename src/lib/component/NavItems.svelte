<script>
  export let href = null;         // opsional: jika tidak ada, pakai <button>
  export let icon;
  export let label;
  export let minimized = false;
  export let onClick = null;      // optional handler

  import { page } from '$app/stores';
  $: isActive = href && $page.url.pathname === href;
</script>

{#if href}
  <!-- Link navigation -->
  <a
    href={href}
    class="w-full text-left flex items-center space-x-3 py-2 px-3 rounded "
    class:hover:bg-white={!isActive}
    class:hover:text-gray-900={!isActive}
    class:bg-white={isActive}
    class:text-gray-900={isActive}
    class:font-bold={isActive}
  >
    <svelte:component this={icon} size={20} />
    {#if !minimized}<span class="menu-label">{label}</span>{/if}
  </a>
{:else}
  <!-- Action button -->
  <button
    on:click={onClick}
    class="w-full text-left flex items-center space-x-3 py-2 px-3 rounded hover:bg-white hover:text-gray-900 text-white"
  >
    <svelte:component this={icon} size={20} />
    {#if !minimized}<span class="menu-label">{label}</span>{/if}
  </button>
{/if}
