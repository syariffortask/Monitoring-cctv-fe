<script>
  import StatCard from "./ui/StatCard.svelte";
  import { Cctv, AlertTriangle, Camera } from "lucide-svelte"; 
  import { onMount } from "svelte";
  import { cameras, initCameras } from "$lib/stores/camera";
  import api from "$lib/api";

  // reactive store
  $cameras; // ini otomatis diisi oleh Svelte

  export let stats = {
    totalCamera: 0,
    activeCamera: 0,
    inactiveCamera: 0,
    snapshotToday: 0,
    lastDetected: 0,
    lastDetectedDate: '',
    cameraWithPothole: 0
  }

  onMount(async () => {
    initCameras();

    // last detection
    const lastDetection = await api.get('/results/latest');
    const lastDetectionData = lastDetection.data;
    stats.lastDetected = lastDetectionData?.detected_images?.length ?? 0;
    stats.lastDetectedDate = lastDetectionData.date;

    // last snapshot
    const lastSnapshot = await api.get('/snapshots/');
    const images = lastSnapshot.data?.images ?? [];
    stats.snapshotToday = images.length;
  });

  // reactive block → setiap $cameras berubah, stats ikut update
  $: stats.totalCamera = $cameras?.length ?? 0;
  $: stats.activeCamera = $cameras?.filter(c => c.status === "online").length ?? 0;
  $: stats.inactiveCamera = stats.totalCamera - stats.activeCamera;
</script>

<div class="flex flex-col md:flex-row gap-4">
  <StatCard
    title="Jumlah CCTV"
    value={stats.totalCamera}
    subtitle={`Aktif ${stats.activeCamera}, Nonaktif ${stats.inactiveCamera}`}
    icon={Cctv}
    bgIcon="bg-green-500"    
  />

  <StatCard
    title="Snapshot Terakhir"
    value={stats.snapshotToday}
    subtitle={`Dari ${stats.totalCamera} CCTV`}
    icon={Camera}
    bgIcon="bg-blue-500"
  />

  <StatCard
    title="Deteksi Terakhir"
    value={stats.lastDetected}
    subtitle={`${stats.lastDetectedDate}, Dari ${stats.totalCamera} CCTV`}
    icon={AlertTriangle} 
    color="text-red-600"
    bgIcon="bg-red-500"
  />
</div>
