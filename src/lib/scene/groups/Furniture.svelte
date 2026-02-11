<script lang="ts">
  import { setShadows } from "$lib/utils";
  import { T } from "@threlte/core";

  let { scene = $bindable() } = $props();

  const node = scene.getObjectByName("Furniture");

  $effect(() => {
    setShadows(node);
  });
</script>

{#if node}
  <T is={node} />
{/if}
