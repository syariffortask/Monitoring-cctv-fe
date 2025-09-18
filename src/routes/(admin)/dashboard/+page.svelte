<script>
  import OverView from "$lib/component/OverView.svelte";
  import AuthGuard from "$lib/component/AuthGuard.svelte";
  import MapCamera from "$lib/component/MapCamera.svelte";
  
</script>
<!-- Untuk role admin -->
<AuthGuard allowRole={['admin','user']} />

<div class="flex mt-[-10px] flex-col h-full">
  <!-- OverView Card (tinggi otomatis, kontennya saja) -->
  <div class="md:p-2">
    <OverView />
  </div>

  <!-- Map Section (ambil penuh sisa layar) -->
  <div class="flex-1 min-h-0 mt-4 md:p-2">
    <div class="bg-white rounded-md shadow-md h-full">
      <MapCamera center={[-6.173, 106.911179]} zoom={12} />
      
    </div>
  </div>
</div>
