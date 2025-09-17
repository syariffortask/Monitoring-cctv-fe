<script>
  import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
  import api from '$lib/api';
  import MainImageViewer from '$lib/component/MainImageViewer.svelte';
  import Button from '$lib/component/ui/Button.svelte';
  import { Download, CircleArrowRight , CircleArrowLeft, Camera,Loader } from 'lucide-svelte';

  const qc = useQueryClient();
  let selectedImage = 0;
  let downloading = false;

  // QUERY (store)
  const snapshotsQuery = createQuery({
    queryKey: ['snapshots'],
    queryFn: async () => {
      const r = await api.get('/snapshots/');
      return r.data?.images ?? [];
    },
    staleTime: 0,
    refetchInterval: 0, // set 5000 kalau mau auto-refresh
  });

  // MUTATION (store)
  const snapshotMutation = createMutation({
    mutationFn: async () => {
      const r = await api.post('/snapshots/');
      return r.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['snapshots'] });
      selectedImage = 0;
    }
  });

  

  // Wrapper agar bisa dipakai di <Button onClick={...}>
  const getSnap = () => $snapshotMutation.mutate();

  // Optional: jaga-jaga kalau jumlah gambar berubah
  $: {
    const len = $snapshotsQuery.data?.length ?? 0;
    if (selectedImage > len - 1) selectedImage = Math.max(0, len - 1);
  }

  // Navigasi
  const prevImage = () => { if (selectedImage > 0) selectedImage--; };
  const nextImage = () => { if (selectedImage < ($snapshotsQuery.data?.length ?? 0) - 1) selectedImage++; };

  async function downloadSnap() {
    downloading = true;
    try {
      const res = await api.get('/snapshots/download-all', { responseType: 'blob',timeout:0 });
      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'snapshots.zip';
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      downloading = false;
    } catch (error) {
      console.log('Error downloading image:', error);
    } finally {
      downloading = false;
    }
  }
</script>

<div class="flex gap-4 w-full">
  <!-- Main Content -->
  <div class="flex-1 flex flex-col items-center">
    {#if $snapshotsQuery.isLoading}
      <p>Loading images...</p>
    {:else if ($snapshotsQuery.data?.length ?? 0) === 0}
      <div class="flex flex-col items-center text-gray-500 gap-2">
        <p>No images available, click button below:</p>
        <Button onClick={getSnap} disabled={$snapshotMutation.isPending} color="gray">
          {$snapshotMutation.isPending ? 'Processing...' : 'Get Snapshot'}
        </Button>
      </div>
    {:else}
      <MainImageViewer src={$snapshotsQuery.data[selectedImage]} />

      <!-- Tombol Next/Prev untuk mobile -->
      <div class="flex justify-between w-full mt-4 gap-2 md:hidden bg-gray-900 py-2 px-4">
        <button on:click={getSnap} class="text-white">
          {#if $snapshotMutation.isPending}
            <Loader size="25" />
          {:else}
            <Camera size="25" />
          {/if}
        </button>
        <button on:click={downloadSnap} disabled={downloading}>
          {#if downloading}
            <Loader size="25" color="white" />
          {:else}
            <Download size="25" color="white" />
          {/if}
        </button>
        <button on:click={prevImage}><CircleArrowLeft size="25" color="white" /></button>
        <h1 class="text-white font-bold">{selectedImage + 1} / {$snapshotsQuery.data.length}</h1>
        <button on:click={nextImage} ><CircleArrowRight size="25" color="white"/></button>
      </div>
    {/if}
  </div>

  <!-- Mini Sidebar Thumbnail di Desktop -->
  {#if ($snapshotsQuery.data?.length ?? 0) > 0}
    <div class="hidden md:flex w-60 flex-col gap-4 h-full pl-4">
      <div class="flex items-center gap-2 justify-between">
        <!-- Tombol Capture -->
        <button 
          on:click={getSnap}
          class="bg-gray-900 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center w-full">
          {$snapshotMutation.isPending ? 'Processing...' : 'Capture'}
        </button>
        <!-- Tombol Download -->
        <button 
          on:click={downloadSnap}
          class="bg-gray-900 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center">
          <Download size="25" />
        </button>
      </div>

      <!-- List Thumbnail Scrollable -->
      <div class="flex-1 overflow-y-auto pr-1">
        <div class="flex flex-col gap-2">
          {#each $snapshotsQuery.data as image, i}
            <button
              on:click={() => selectedImage = i}
              class={`cursor-pointer rounded overflow-hidden border transition 
                ${selectedImage === i ? 'ring-2 ring-blue-600 border-blue-400' : 'hover:ring-2 hover:ring-blue-300'}`}>
              <img src={image} alt="thumbnail" class="w-full h-24 object-cover" />
            </button>
          {/each}
        </div>
      </div>
    </div>
  {/if}

</div>
