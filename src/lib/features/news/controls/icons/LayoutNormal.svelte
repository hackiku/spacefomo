<!-- src/lib/features/news/controls/icons/LayoutCompact.svelte -->
<script lang="ts">
  let className: string | undefined = undefined;
  export { className as class };
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class={className}
>
  <rect x="3" y="3" width="18" height="18" rx="2" />
  <path d="M3 9h18" />
  <path d="M3 15h18" />
</svg>