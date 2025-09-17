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
      const res = await api.get('/results/latest');
      const data = res.data;
      images = Array.isArray(data.detected_images) ? [...data.detected_images] : [];
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

  const DatabyDate = async (date) => {
    try {
      const formattedDate = date.replaceAll('-', '');
      const res = await api.get(`/results/${formattedDate}`);
      const data = res.data;
      images = Array.isArray(data.detected_images) ? [...data.detected_images] : [];
      selectedImage = 0;
    } catch (error) {
      images = [];
      selectedImage = 0;
      console.error('Fetch error:', error.message);
    }
  };

  const prevImage = () => {
    if (selectedImage > 0) selectedImage--;
  };

  const nextImage = () => {
    if (selectedImage < images.length - 1) selectedImage++;
  };
</script>
<AuthGuard allowRole={['admin']}/>

<div class="flex gap-4 w-full h-[calc(100vh-100px)] items-start mt-4">
  <!-- Main Image -->
  <div class="flex-1 flex flex-col items-center w-full">
    <div class="md:hidden mb-2 w-full">
      <input
        type="date"
        bind:value={date}
        class="border rounded px-3 py-1 w-full"
        on:change={() => DatabyDate(date)}
      />
    </div>

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
    <div>
      <input
        type="date"
        bind:value={date}
        class="border rounded px-3 py-1 w-full"
        on:change={() => DatabyDate(date)}
      />
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
