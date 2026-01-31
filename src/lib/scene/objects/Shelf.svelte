<script lang="ts">
  import { T } from "@threlte/core";
  import { Align, Text3DGeometry, useGltf } from "@threlte/extras";
  import { Spring } from "svelte/motion";
  import type { Object3D } from "three";

  import { currentView, OFFICE_PATH } from "$lib/view";
  import { centerPositions } from "$lib/utils";
  import PokerStack from "./PokerStack.svelte";
  import ChessPiece from "./ChessPiece.svelte";

  let { centroid = $bindable() } = $props();
  let focused = $derived($currentView === "hobbies");
  let hoveredKey = $state<string | null>(null);

  // --- Animation Springs ---
  const yOffset = new Spring(0, { stiffness: 0.1, damping: 0.5 });
  const squashStretch = new Spring(1, { stiffness: 0.2, damping: 0.3 });
  const opacity = new Spring(0, { stiffness: 0.05, damping: 0.8 });

  // --- Hardcoded Label Configurations ---
  // Rotation is [x, y, z] in radians. Offset is relative to the object's position.
  const hoverData: Record<
    string,
    {
      title: string;
      desc: string;
      rotation: [number, number, number];
      offset: [number, number, number];
    }
  > = {
    rook: {
      title: "Chess",
      desc: "Chess is my favourite strategy game of all time\ndespite how unforgiving it can be.",
      rotation: [0, Math.PI / 8, 0],
      offset: [0, 0.3, 0],
    },
    pokerStack: {
      title: "Poker",
      desc: "Poker has been a fun hobby. Studying the maths,\nstrategy and running my uni's poker society\nhas been a unique challenge!",
      rotation: [0, Math.PI / 8, 0],
      offset: [0.1, 0.35, 0],
    },
    chineseText: {
      title: "Languages",
      desc: "I love learning languages, and recently Chinese\nhas stolen my heart. I am planning to reach a HSK3\nlevel by the end of the year.",
      rotation: [0, Math.PI / 16, 0],
      offset: [0.1, 0.3, 0],
    },
  };

  const centerLogic = centerPositions({
    shelf: [4.2, 0, -0.9],
    rook: [3.95, 1.14, -0.9],
    pokerStack: [4.18, 1.15, -0.9],
    chineseText: [4.45, 1.2, -0.9],
  });

  const positions = centerLogic.positions;

  $effect(() => {
    centroid = centerLogic.centroid;
  });

  $effect(() => {
    if (hoveredKey) {
      yOffset.target = 0.1;
      squashStretch.target = 1.2;
      opacity.target = 1;
    } else {
      yOffset.set(0);
      squashStretch.set(1);
      opacity.set(0);
    }
  });

  const onEnter = (key: string) => (hoveredKey = key);
  const onLeave = () => (hoveredKey = null);
</script>

{#snippet HoverLabel(key: string, position: [number, number, number])}
  {#if focused && hoveredKey == key}
    {@const config = hoverData[key]}
    <T.Group
      position={[
        position[0] + config.offset[0],
        position[1] + config.offset[1] + yOffset.current,
        position[2] + config.offset[2],
      ]}
      rotation={config.rotation}
      scale={[
        2 - squashStretch.current,
        squashStretch.current,
        2 - squashStretch.current,
      ]}
      visible={opacity.current > 0.01}
    >
      <Align>
        {#snippet children({ align })}
          <T.Mesh>
            <Text3DGeometry
              text={`${config.title}\n${config.desc}`}
              oncreate={align}
              size={0.05}
              depth={0.01}
              font="fonts/UnifontExMono_Regular.json"
            />
            <T.MeshStandardMaterial
              color="#000000"
              opacity={opacity.current}
              roughness={0.65}
              metalness={0.1}
            />
          </T.Mesh>
        {/snippet}
      </Align>
    </T.Group>
  {/if}
{/snippet}

<T.Group>
  {#await useGltf(OFFICE_PATH + "/Furniture/shelves_03.glb") then gltf}
    <T
      is={gltf.scene.clone(true) as Object3D}
      position={positions.shelf}
      rotation={[0, Math.PI / 2, 0]}
    />
  {/await}

  <T.Group onpointerenter={() => onEnter("rook")} onpointerleave={onLeave}>
    <ChessPiece position={positions.rook} rotation.y={Math.PI / 8}/>
  </T.Group>
  {@render HoverLabel("rook", positions.rook)}

  <T.Group
    onpointerenter={() => onEnter("pokerStack")}
    onpointerleave={onLeave}
  >
    <PokerStack position={positions.pokerStack} />
  </T.Group>
  {@render HoverLabel("pokerStack", positions.pokerStack)}

  <T.Group
    position={positions.chineseText}
    scale={0.08}
    onpointerenter={() => onEnter("chineseText")}
    onpointerleave={onLeave}
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
  {@render HoverLabel("chineseText", positions.chineseText)}
</T.Group>
