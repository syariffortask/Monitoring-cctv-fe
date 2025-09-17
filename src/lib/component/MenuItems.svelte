<script>
  export let menu;
  export let closeMobile = () => {};
</script>

<li class="hover:text-gray-300 cursor-pointer">
  {#if menu.href}
    <a
      href={menu.href}
      on:click={closeMobile}
      class="block w-full text-center"
    >
      <svelte:component this={menu.icon} size={25} />
    </a>
  {:else if menu.onClick}
    <button
      on:click={() => { menu.onClick(); closeMobile(); }}
      class="block w-full text-center"
    >
      <svelte:component this={menu.icon} size={25} />
    </button>
  {/if}
</li>
