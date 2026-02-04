<script lang="ts">
  import { T, useTask } from "@threlte/core";
  import {
    useGltf,
    interactivity,
    Suspense,
    Text,
    useProgress,
  } from "@threlte/extras";
  import { type Object3D, MathUtils, Mesh, MeshStandardMaterial } from "three";
  import { Spring } from "svelte/motion";

  import {
    groupings,
    currentView,
    type View,
    loadingProgress,
  } from "$lib/view";
  import { addHoverShader, type HoverMaterial } from "./effects/hover";
  import { groups } from "./groups";

  import HoverGroup from "./HoverGroup.svelte";

  import Whiteboard from "./objects/Whiteboard.svelte";
  import Shelf from "./objects/Shelf.svelte";

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

  const { progress } = useProgress();
  progress.subscribe((progress) => loadingProgress.set(progress));

  let shelfCentroid = $state<[number, number, number]>([0, 0, 0]);
</script>

<Suspense final>
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
          {#await useGltf((!object.pack || object.pack == "office" ? "/3D voxel Office pack/glb" : "/3D voxel Chess pack/glb") + object.src) then gltf}
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

    <HoverGroup
      view="careers"
      position={[0, 0, -0.8]}
      rotation={[0, 180 * MathUtils.DEG2RAD, 0]}
    >
      <Whiteboard />
    </HoverGroup>

    <HoverGroup
      view="hobbies"
      bind:centroid={() => shelfCentroid, (c) => (shelfCentroid = c)}
    >
      <Shelf bind:centroid={() => shelfCentroid, (c) => (shelfCentroid = c)} />
    </HoverGroup>
  </T.Group>
</Suspense>
