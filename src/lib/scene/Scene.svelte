<script lang="ts">
  import { T, useTask } from "@threlte/core";
  import { useGltf, interactivity, Suspense, Text } from "@threlte/extras";
  import { type Object3D, MeshStandardMaterial } from "three";
  import { Spring } from "svelte/motion";

  import { cameraConfigs, currentView, type View } from "$lib/view";
  import { addHoverShader, type HoverMaterial } from "./hover";
  import { groups } from "./groups";

  import WhiteboardCover from "./WhiteboardCover.svelte";

  interactivity();

  type GroupDetails = {
    materials: HoverMaterial[];
    scale: Spring<number>;
    hover: Spring<number>;
  };

  const groupDetails = new Map<string, GroupDetails>();

  for (const group of groups) {
    groupDetails.set(group.id, {
      materials: [],
      scale: new Spring(1, { stiffness: 0.15, damping: 0.4 }),
      hover: new Spring(0, { stiffness: 0.2, damping: 0.5 }),
    });
  }

  const goTo = (view: View) => {
    const newView = view === $currentView ? "home" : view;
    currentView.set(newView);
  };

  useTask((delta) => {
    groupDetails.forEach(({ materials, hover }) => {
      const h = hover.current;

      for (const mat of materials) {
        const u = mat.userData.hoverUniforms;
        u.uTime.value += delta;
        u.uHover.value = h;
      }
    });
  });
</script>

<Suspense final>
  {#snippet fallback()}
    <Text
      position.z={-1}
      text="Loading..."
      fontSize={1}
      color="black"
      anchorX="50%"
      anchorY="50%"
      oncreate={(ref) => {
        ref.lookAt(...cameraConfigs["home"].position);
      }}
    />
  {/snippet}

  <T.Group>
    {#each groups as group}
      {@const details = groupDetails.get(group.id)!}

      <T.Group
        position={group.position ?? [0, 0, 0]}
        rotation={group.rotation ?? [0, 0, 0]}
        scale={details.scale.current}
        onclick={(e: MouseEvent) => {
          if (group.goto) {
            e.stopPropagation();
            goTo(group.goto!);

            details.scale.target = 1;
            details.hover.target = 0;
          }
        }}
        onpointerenter={() => {
          if (group.goto && group.goto !== $currentView) {
            details.scale.target = 1.05;
            details.hover.target = 1;
          }
        }}
        onpointerleave={() => {
          if (group.goto) {
            details.scale.target = 1;
            details.hover.target = 0;
          }
        }}
      >
        {#each group.objects as object}
          {#await useGltf(((!object.pack || object.pack == 'office') ? "/3D voxel Office pack/glb" : "/3D voxel Chess pack/glb") + object.src) then gltf}
            {@const clonedScene = gltf.scene.clone(true) as Object3D}
            {@const materials: HoverMaterial[] = []}

            {@const _ = clonedScene.traverse((child: any) => {
              if (
                child.isMesh &&
                child.material instanceof MeshStandardMaterial
              ) {
                addHoverShader(child.material);
                materials.push(child.material as HoverMaterial);
              }
            })}

            {@const __ = (() => {
              materials.forEach((m) => details.materials.push(m));
            })()}

            <T
              is={clonedScene}
              position={object.position ?? [0, 0, 0]}
              rotation={object.rotation ?? [0, 0, 0]}
              scale={object.scale ?? 1}
            />
          {/await}
        {/each}
      </T.Group>
    {/each}

    <WhiteboardCover />

  </T.Group>
</Suspense>
