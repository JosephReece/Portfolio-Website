<script lang="ts">
  import { currentView, OFFICE_PATH } from "$lib/view";
  import { T } from "@threlte/core";
  import { useGltf } from "@threlte/extras";
  import { type Object3D } from "three";
  import WhiteboardScreen from "./WhiteboardScreen.svelte";
</script>

<T.Group>
  <WhiteboardScreen
    position={[0, 1.64, -0.05]}
    focused={$currentView === "careers"}
  />

  <T.Group>
    {#await useGltf(OFFICE_PATH + "/Furniture/board_white_01.glb") then gltf}
      <T is={gltf.scene.clone(true) as Object3D} />
    {/await}
  </T.Group>
</T.Group>
