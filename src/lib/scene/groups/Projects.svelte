<script lang="ts">
  import { T } from "@threlte/core";
  import HoverGroup from "../HoverGroup.svelte";
  import type { Vector } from "$lib/view";
  import { setShadows } from "$lib/utils";

  let { scene = $bindable() } = $props();

  const node = scene.getObjectByName("Projects");
  let position: Vector | null = $state(null);

  $effect(() => {
    if (node && !position) {
      position = [node.position.x, node.position.y, node.position.z];
      node.position.set(0, 0, 0);
    }
  });

  $effect(() => {
    setShadows(node);
  });
</script>

{#if node && position}
  <HoverGroup view="projects" bind:centroid={position}>
    <T is={node} />
  </HoverGroup>
{/if}
