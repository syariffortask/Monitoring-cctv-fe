<script>
  import { onMount } from "svelte";
  import L from "leaflet";
  import "leaflet/dist/leaflet.css";
  import { cameras, initCameras } from "$lib/stores/camera";

  export let center = [0, 0];
  export let zoom = 2;

  let map;
  let mapEl;
  let markers = {};

  const onlineIcon = L.icon({
    iconUrl: "icon/online.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const offlineIcon = L.icon({
    iconUrl: "icon/danger.png",
    iconSize: [25, 36],
    iconAnchor: [12, 36],
  });

  onMount(() => {
    initCameras();
    map = L.map(mapEl, { center, zoom });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
    setTimeout(() => map.invalidateSize(), 300);
  });

  $: if ($cameras.length && map) {
    $cameras.forEach(cam => {
      if (cam.latitude && cam.longitude) {
        if (!markers[cam.id]) {
          // buat marker baru
          const marker = L.marker([cam.latitude, cam.longitude], {
            icon: cam.status === "online" ? onlineIcon : offlineIcon
          }).addTo(map);

          marker.bindTooltip(cam.name, { direction: "top", offset: [0, -40] });
          // marker.bindPopup('Status: ' + cam.status);

          markers[cam.id] = marker;
        } else {
          // update icon & popup kalau status berubah
          markers[cam.id].setIcon(cam.status === "online" ? onlineIcon : offlineIcon);
          // markers[cam.id].setPopupContent('Status: ' + cam.status);
        }
      }
    });
  }
</script>


<div bind:this={mapEl} class="w-full h-full rounded-xl"></div>

<style>
  :global(.leaflet-container) {
    width: 100%;
    height: 100%;
    border-radius: 0.75rem;
  }
</style>
