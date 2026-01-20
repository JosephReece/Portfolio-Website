<script lang="ts">
  import { OFFICE_PATH } from "$lib/view";
  import { T } from "@threlte/core";
  import { useGltf } from "@threlte/extras";
  import { type Object3D } from "three";
</script>

<T.Group>
  {#await useGltf(OFFICE_PATH + "/Furniture/board_white_01.glb") then gltf}
    <T is={gltf.scene.clone(true) as Object3D} />
  {/await}
</T.Group>

