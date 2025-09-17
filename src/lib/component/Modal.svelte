<script>
  import { fade, scale } from 'svelte/transition';
  import { X } from 'lucide-svelte';

  export let isOpen = false;
  export let onClose = () => {};
  export let onSave = () => {};
  export let fields = [];
  export let modalTitle = '';
  export let initialValues = {};

  let formData = {};
  let errors = {};

  // Set formData dan errors ketika modal terbuka
  $: if (isOpen) {
    formData = {};
    errors = {};
    fields.forEach(field => {
      formData[field.name] = initialValues[field.name] ?? field.default ?? '';
      errors[field.name] = '';
    });
  }

  const handleSubmit = () => {
    let hasError = false;

    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        errors[field.name] = `${field.label} wajib diisi`;
        hasError = true;
      } else {
        errors[field.name] = '';
      }
    });

    if (!hasError) {
      const payload = { ...formData };
      fields.forEach(f => {
        if (f.type === 'number' && payload[f.name] === '') {
          payload[f.name] = null;
        }
      });

      onSave(payload);
      onClose();
    }
  };
</script>

{#if isOpen}
  <div class="p-4 fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50" transition:fade>
    <div class="bg-white p-6 rounded-lg shadow-md w-full md:max-w-3xl space-y-4" transition:scale>
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold">{modalTitle}</h2>
        <button on:click={onClose} class="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>
      <div class=" grid grid-cols-1 md:grid-cols-2 gap-4">
        {#each fields as field}
          <div class="flex flex-col">
            <label for="{field.name}" class=" text-xs md:text-sm font-medium text-gray-700">{field.label}</label>
            <input
              type={field.type || 'text'}
              bind:value={formData[field.name]}
              placeholder={field.placeholder}
              class="w-full px-1 py-1 border rounded-md focus:outline-none placeholder:text-xs focus:ring focus:border-blue-500"
              required={field.required}
            />
            {#if errors[field.name]}
              <p class="text-sm text-red-500 mt-1">{errors[field.name]}</p>
            {/if}
          </div>
        {/each}
      </div>
      <div class="flex justify-end space-x-2 pt-2">
        <button
          on:click={onClose}
          class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
        >
          Batal
        </button>
        <button
          on:click={handleSubmit}
          class="bg-gray-900 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded"
        >
          Simpan
        </button>
      </div>
    </div>
  </div>
{/if}
