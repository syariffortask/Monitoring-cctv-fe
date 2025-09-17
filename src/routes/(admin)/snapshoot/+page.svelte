<script>
  import { onMount } from "svelte";
  import MainImageViewer from "$lib/component/MainImageViewer.svelte";
  import Button from "$lib/component/ui/Button.svelte";
  import AuthGuard from '$lib/component/AuthGuard.svelte';
  import api from '$lib/api';


  let selectedImage = 0;
  let images = [];
  let date = '';

  onMount(async () => {
    try {
      const res = await api.get('/snapshots/');
      const data = res.data;
      console.log(data);
      images = Array.isArray(data.images) ? [...data.images] : [];
      selectedImage = 0;
      date = data.date;
    } catch (error) {
      images = [];
      selectedImage = 0;
      console.error('Fetch error:', error);
    }

    const handler = (e) => {
      if (e.key === 'ArrowRight' && selectedImage < images.length - 1) {
        selectedImage++;
      } else if (e.key === 'ArrowLeft' && selectedImage > 0) {
        selectedImage--;
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  });


  const prevImage = () => {
    if (selectedImage > 0) selectedImage--;
  };

  const nextImage = () => {
    if (selectedImage < images.length - 1) selectedImage++;
  };

  async function downloadSnap() {
    try {
      const res = await api.get('/snapshots/download-all', {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'snapshots.zip');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download gagal:', error);
    }
}


</script>
<AuthGuard allowRole={['admin']}/>

<div class="flex gap-4 w-full  items-start mt-4">
  <!-- Main Image -->
  <div class="flex-1 flex flex-col items-center w-full">
    
    {#if images && images.length > 0}
      <MainImageViewer src={images[selectedImage]} />
    {:else if images && images.length === 0}
      <div class="flex-1 flex items-center justify-center text-gray-500">
        No images available for the selected date.
      </div>
    {:else}
      <div class="flex-1 flex items-center justify-center text-gray-500">
        Loading images...
      </div>
    {/if}

    <!-- Tombol mobile next/prev -->
    {#if images.length > 0}
      <div class="flex justify-center w-full mt-4 gap-2 md:hidden text-xs">
        <Button onClick={prevImage} disabled={selectedImage === 0} color="gray" textColor="white">
          Prev
        </Button>
        <Button onClick={nextImage} disabled={selectedImage === images.length - 1} color="gray" textColor="white">
          Next
        </Button>
      </div>
    {/if}


  </div>

  <!-- Sidebar hanya tampil di desktop -->
  <div class="hidden w-60 md:flex flex-col gap-4 h-full pl-4">
    <div class="">
      <button on:click={downloadSnap} class="bg-gray-900 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mb-1 w-full">Download All</button>
    </div>
    <div class="flex-1 overflow-y-auto pr-1">
      <div class="flex flex-col gap-2">
        {#each images as image, i}
          <button
            on:click={() => selectedImage = i}
            class={`cursor-pointer rounded overflow-hidden border transition 
              ${selectedImage === i ? 'ring-3 ring-blue-600 border-blue-400' : 'hover:ring-2 hover:ring-blue-300'}`}
          >
            <img src={image} alt="thumbnail" class="w-full h-full object-cover" />
          </button>
        {/each}
      </div>
    </div>
  </div>
</div>
