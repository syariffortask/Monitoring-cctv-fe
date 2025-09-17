<script>
  import { createEventDispatcher } from 'svelte';
  export let onClick = () => {};
  export let disabled = false;
  export let type = 'button';
  export let color = 'blue';
  export let textColor = 'white';

  const dispatch = createEventDispatcher();

  $: btnClass = `bg-${color}-900 hover:bg-${color}-700 text-${textColor} font-bold py-2 px-4 rounded`;

  function handleClick(event) {
    onClick(event);            // jalankan fungsi yang dikirim lewat props
    dispatch('click', event);  // lempar event ke luar komponen
  }
</script>

<button on:click={handleClick} {disabled} type={type} class={btnClass}>
  <slot>Button</slot>
</button>
