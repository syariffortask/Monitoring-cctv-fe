<script>
  import { fade, scale } from 'svelte/transition';
  import { X } from 'lucide-svelte';

  export let isOpen = false;
  export let onClose = () => {};
  export let modalTitle = '';
  export let value = {
    title: 'offline',
    src: 'https://placehold.co/720x480?text=Offline'
  };

</script>

{#if isOpen}
  <div class="p-4 fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50" transition:fade>
    <div class="bg-white p-1 rounded-md shadow-md w-full md:max-w-3xl space-y-2" transition:scale>
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold">{modalTitle}</h2>
        <button on:click={onClose} class="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>
      <div class=" grid grid-cols-1">
         <iframe
          title="{value.title}"
          src="{value.src ? value.src : 'https://placehold.co/720x480?text=No Resource'}"
          width="100%"
          height="480"
          frameborder="0"
          allow="autoplay; fullscreen"
          allowfullscreen
          class="rounded-lg shadow"
        ></iframe>
      </div>
      
    </div>
  </div>
{/if}