<script>
  import { Box } from "lucide-svelte";
  export let title = "";
  export let value = 0;
  export let subtitle = "";
  export let icon = Box;             // default icon
  export let color = "text-gray-700"; // warna angka
  export let bgIcon = "bg-blue-500";         // warna background icon
</script>

<div class="flex-1 relative rounded-2xl shadow-lg bg-white p-3 md:p-6 bg-gradient-to-r from-gray-100 to-gray-250">
  <!-- Konten utama -->
  <div>
    <h2 class="text-md font-medium md:mb-2">{title}</h2>
    <div class={`text-2xl md:text-3xl font-bold ${color}`}>{value}</div>
    {#if subtitle}
      <p class="text-xs md:text-sm text-gray-500">{subtitle}</p>
    {/if}
  </div>

  <!-- Icon di kanan tengah -->
  <div class={`absolute right-4 top-1/2 -translate-y-1/2 text-white rounded-full p-3 ${bgIcon}`}>
    <svelte:component this={icon} class="w-4 h-4 md:w-8 md:h-8" />
  </div>
</div>
