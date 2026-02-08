<script lang="ts">
  import { T } from "@threlte/core";
  import HoverGroup from "../HoverGroup.svelte";
  import { currentView, type Vector } from "$lib/view";
  import CareersScreen from "./careers/CareersScreen.svelte";
  import { MathUtils } from "three";

  let { scene = $bindable() } = $props();

  const node = scene.getObjectByName("Careers");
  let position: Vector | null = $state(null);

  $effect(() => {
    if (node && !position) {
      position = [node.position.x, node.position.y, node.position.z];
      node.position.set(0, 0, 0);
    }
  });
</script>

{#if node && position}
  <HoverGroup view="careers" bind:centroid={position}>
    <T is={node} />

    <CareersScreen
      position={[-0.1, 0.5, 0]}
      rotation.y={MathUtils.DEG2RAD * 90}
      focused={$currentView === "careers"}
    />
  </HoverGroup>
{/if}
