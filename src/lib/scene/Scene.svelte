<script lang="ts">
  import { interactivity } from "@threlte/extras";
  import { T } from "@threlte/core";
  import { useGltf } from "@threlte/extras";
  import type { Object3D, ShaderMaterial } from "three";
  import { currentView, type Vector, type View } from "$lib/view";
  import { hoverShader } from "./hover";

  interactivity();

  const goTo = (view: View) => {
    if (view === $currentView) {
      console.log(view + " --> home");
      currentView.set("home");
    } else {
      console.log($currentView + " --> " + view);
      currentView.set(view);
    }
  };

  type ObjectConfig = {
    src: string;
    position?: Vector;
    rotation?: Vector;
  };

  type GroupConfig = {
    position?: Vector;
    goto?: View;
    rotation?: Vector;
    objects: ObjectConfig[];
  };

  const SECTION_UNIT = 2.4;
  const WALL_OFFSET = 0.09;

  const groups: GroupConfig[] = [
    // Flooring
    {
      position: [0, 0, 0],
      objects: [
        // Floors (3x3)
        ...Array.from({ length: 3 }).flatMap((_, row) =>
          Array.from({ length: 3 }).map((_, col) => ({
            src: "/Structure/floor_02_L.glb",
            position: [col * SECTION_UNIT, 0, row * SECTION_UNIT],
          })),
        ),

        // Right wall (rotated)
        ...Array.from({ length: 3 }).map((_, i) => ({
          src: "/Structure/wall_01_M.glb",
          position: [i * SECTION_UNIT, 0, -(SECTION_UNIT / 2) - WALL_OFFSET],
          rotation: [0, Math.PI / 2, 0],
        })),

        // Left wall
        ...Array.from({ length: 3 }).map((_, i) => ({
          src:
            i === 1
              ? "/Structure/wall_01_M_door.glb"
              : "/Structure/wall_01_M.glb",
          position: [-(SECTION_UNIT / 2) - WALL_OFFSET, 0, i * SECTION_UNIT],
        })),

        // Corner
        {
          src: "/Structure/corner_01.glb",
          position: [-(SECTION_UNIT / 2) - 0.1, 0, -(SECTION_UNIT / 2) - 0.1],
        },
      ] as any,
    },

    // Whiteboard (Careers)
    {
      goto: "careers",
      objects: [
        {
          src: "/Furniture/board_white_01.glb",
          position: [0, 0, -0.8],
          rotation: [0, Math.PI, 0],
        },
      ],
    },

    // Shelf (Hobbies)
    {
      goto: "hobbies",
      objects: [
        {
          src: "/Furniture/shelves_03.glb",
          position: [4.2, 0, -0.9],
          rotation: [0, Math.PI / 2, 0],
        },
      ],
    },

    // Bookshelf (Education)
    {
      goto: "education",
      objects: [
        {
          src: "/Furniture/shelves_06.glb",
          position: [-1, 0, 4.5],
          rotation: [0, -Math.PI / 2, 0],
        },
      ],
    },

    // Desk (Projects)
    {
      rotation: [0, Math.PI, 0],
      position: [2.4, 0, -0.7],
      goto: "projects",
      objects: [
        { src: "/Furniture/table_06.glb" },
        {
          src: "/Furniture/chair_02.glb",
          position: [-0.25, 0, -0.5],
          rotation: [0, Math.PI, 0],
        },
        { src: "/Accessories/lamp_02.glb", position: [-0.7, 0.9, 0.2] },
        { src: "/Accessories/computer_screen.glb", position: [0, 0.9, 0.1] },
        {
          src: "/Accessories/computer_keyboard.glb",
          position: [0.1, 0.9, -0.2],
        },
        { src: "/Accessories/computer_mouse.glb", position: [-0.3, 0.9, -0.2] },
      ],
    },

    // Seating Area (Contact Information and Referrals)
    {
      position: [3.5, 0, 4],
      goto: "contact",
      objects: [
        { src: "/Furniture/table_small_01.glb" },
        {
          src: "/Furniture/couch_02.glb",
          position: [1.2, 0, 0],
          rotation: [0, Math.PI / 2, 0],
        },
        {
          src: "/Furniture/armchair_02.glb",
          position: [0, 0, -1.2],
          rotation: [0, Math.PI, 0],
        },
      ],
    },
  ];
</script>

<T.Group>
  {#each groups as group}
    <T.Group  
      position={group.position ?? [0, 0, 0]}
      rotation={group.rotation ?? [0, 0, 0]}
      onclick={group.goto
        ? (e: MouseEvent) => {
            e.stopPropagation();
            goTo(group.goto!);
          }
        : undefined}
      onpointerenter={() => {}}
      onpointerleave={() => {}}
    >
      {#each group.objects as object}
        {#await useGltf("/3D voxel Office pack/glb" + object.src) then gltf}
          {@const clonedScene = gltf.scene.clone(true) as Object3D}
          {@const _ = clonedScene.traverse((child: any) => {
            if (child.isMesh) {
              child.material = hoverShader.clone();
            }
          })}

          <T
            is={clonedScene}
            position={object.position ?? [0, 0, 0]}
            rotation={object.rotation ?? [0, 0, 0]}
          />
        {/await}
      {/each}
    </T.Group>
  {/each}
</T.Group>
