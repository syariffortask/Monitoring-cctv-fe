<script>
  import { createEventDispatcher } from 'svelte';
  import { SquarePen, Trash2 } from 'lucide-svelte';
  import Button from '$lib/component/ui/Button.svelte';

  export let columns = [];
  export let data = [];

  const dispatch = createEventDispatcher();
</script>

<!-- Wrapper utama -->
<div class="w-full overflow-x-auto">
  <!-- Wrapper vertikal (biar max-height kepake + sticky header tetap jalan) -->
  <div class="overflow-y-auto md:max-h-[600px]">
    <table class="min-w-full  table-auto border-collapse rounded-lg shadow-md">
      <thead class="bg-gray-900 text-white sticky top-0 z-10 border-b border-gray-600">
        <tr>
          <th class="px-4 py-3 text-sm border-r border-gray-600 whitespace-nowrap">No</th>
          {#each columns as column}
            <th class="px-4 py-3 text-sm border-r border-gray-600 whitespace-nowrap">
              {column.label}
            </th>
          {/each}
          <th class="px-4 py-3 text-sm whitespace-nowrap">Action</th>
        </tr>
      </thead>
      <tbody class="bg-white text-gray-800 divide-y divide-gray-200 text-center">
        {#each data as row, i}
          <tr class="hover:bg-gray-100">
            <td class="px-4 py-2 text-sm border-r border-gray-300 whitespace-nowrap">{i + 1}</td>
            {#each columns as column}
              <td class="px-4 py-2 text-sm border-r border-gray-300 whitespace-nowrap">
                {row[column.field]}
              </td>
            {/each}
            <td class="px-4 py-2 text-sm flex gap-2 justify-center whitespace-nowrap">
              <Button on:click={() => dispatch('delete', row)} color="gray" title="Hapus">
                <Trash2 size={16}/>
              </Button>
              <Button on:click={() => dispatch('edit', row)} color="gray" title="Edit">
                <SquarePen size={16} />
              </Button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

