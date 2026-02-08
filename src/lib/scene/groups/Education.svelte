<script lang="ts">
  import { T } from "@threlte/core";
  import HoverGroup from "../HoverGroup.svelte";
  import type { Vector } from "$lib/view";

  let { scene = $bindable() } = $props();

  const node = scene.getObjectByName("Education");
  let position: Vector | null = $state(null);

  $effect(() => {
    if (node && !position) {
      position = [
        node.position.x,
        node.position.y,
        node.position.z,
      ];
      node.position.set(0, 0, 0);
    }
  });
</script>

{#if node && position}
  <HoverGroup view="education" bind:centroid={position}>
    <T is={node} />
  </HoverGroup>
{/if}
