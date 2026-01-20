<script lang="ts">
  import { T, useThrelte } from "@threlte/core";
  import { Align, Text3DGeometry, useGltf } from "@threlte/extras";
  import type { Object3D } from "three";
  import { Vector3 } from "three";
  import { CHESS_PATH, OFFICE_PATH } from "$lib/view";
  import PokerStack from "./PokerStack.svelte";
  import { centerPositions } from "../../utils";

  const { camera } = useThrelte();

  let hovered = false;
  const tooltipPosition = new Vector3();

  let { centroid = $bindable() } = $props();

  const centerLogic = centerPositions({
    shelf: [4.2, 0, -0.9],
    rook: [3.9, 1.14, -0.9],
    pokerStack: [4.1, 1.15, -0.9],
    chineseText: [4.45, 1.24, -0.9],
  });

  const positions = centerLogic.positions;
  $effect(() => {
    centroid = centerLogic.centroid;
  });

  function updateTooltipPosition(object: Object3D) {
    const objectPos = new Vector3();
    object.getWorldPosition(objectPos);

    const direction = new Vector3()
      .subVectors($camera.position, objectPos)
      .normalize();

    tooltipPosition.copy(objectPos).add(direction.multiplyScalar(1));
    hovered = true;
  }

  function clearTooltip() {
    hovered = false;
  }
</script>

<T.Group>
  <!-- Shelf -->
  {#await useGltf(OFFICE_PATH + "/Furniture/shelves_03.glb") then gltf}
    <T
      is={gltf.scene.clone(true) as Object3D}
      position={positions.shelf}
      rotation={[0, Math.PI / 2, 0]}
      onpointerenter={(e: any) => updateTooltipPosition(e.object)}
      onpointerleave={clearTooltip}
    />
  {/await}

  <!-- Chess Rook -->
  {#await useGltf(CHESS_PATH + "/black_rook.glb") then gltf}
    <T
      is={gltf.scene.clone(true) as Object3D}
      position={positions.rook}
      rotation={[0, Math.PI / 2, 0]}
      scale={0.2}
      onpointerenter={(e: any) => updateTooltipPosition(e.object)}
      onpointerleave={clearTooltip}
    />
  {/await}

  <!-- Poker Chips -->
  <PokerStack
    position={positions.pokerStack}
    onpointerenter={(e: any) => updateTooltipPosition(e.object)}
    onpointerleave={clearTooltip}
  />

  <!-- Chinese Learning Text -->
  <T.Group
    position={positions.chineseText}
    scale={0.15}
    onpointerenter={(e: any) => updateTooltipPosition(e.object)}
    onpointerleave={clearTooltip}
  >
    <Align>
      {#snippet children({ align })}
        <T.Mesh>
          <Text3DGeometry
            font="fonts/Noto Sans SC_Regular.json"
            text="中文"
            oncreate={align}
            size={1}
            depth={0.5}
            height={1}
          />
          <T.MeshStandardMaterial
            color="#000000"
            roughness={0.65}
            metalness={0.1}
          />
        </T.Mesh>
      {/snippet}
    </Align>
  </T.Group>
</T.Group>
