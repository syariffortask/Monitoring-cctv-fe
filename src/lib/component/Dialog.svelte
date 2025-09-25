<script>
  import { fade, scale } from 'svelte/transition';
  import { X } from 'lucide-svelte';
  import Hls from 'hls.js';
  import { afterUpdate, onDestroy } from 'svelte';

  export let isOpen = false;
  export let modalTitle = '';
  export let value = { title: 'offline', src: '' };
  export let onClose = () => {};

  let videoEl;
  let hls;

  // Re-init setiap kali modal terbuka atau URL berubah
  afterUpdate(() => {
    if (isOpen && value?.src) {
      initPlayer();
    } else if (!isOpen) {
      cleanup();
    }
  });

  function initPlayer() {
    if (!videoEl || !value?.src) return;
    cleanup(); // pastikan bersih dulu

    if (Hls.isSupported()) {
      hls = new Hls({
        lowLatencyMode: true,
        enableWorker: false, // disable worker supaya aman di Vite
        manifestLoadingTimeOut: 20000
      });
      hls.loadSource(value.src);
      hls.attachMedia(videoEl);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoEl.play().catch(() => {});
      });
    } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari native HLS
      videoEl.src = value.src;
      videoEl.play().catch(() => {});
    }
  }

  function cleanup() {
    if (hls) {
      hls.destroy();
      hls = null;
    }
    if (videoEl) {
      videoEl.pause?.();
      videoEl.removeAttribute('src');
      videoEl.load?.();
    }
  }

  onDestroy(cleanup);
</script>

{#if isOpen}
  <div class="p-4 fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50" transition:fade>
    <div class="bg-white p-2 rounded-md shadow-md w-full md:max-w-3xl space-y-2" transition:scale>
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold">{modalTitle}</h2>
        <button on:click={onClose} class="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>
      <video
        bind:this={videoEl}
        class="rounded-lg shadow w-full"
        autoplay
        muted
        controls
        playsinline
        poster="https://placehold.co/720x480?text=Loading..."
      ></video>
    </div>
  </div>
{/if}
