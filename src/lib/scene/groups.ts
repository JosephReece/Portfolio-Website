import type { Vector, View } from "$lib/view";

export type ObjectConfig = {
  pack?: 'office' | 'chess';
  src: string;
  position?: Vector;
  scale?: number;
  rotation?: Vector;
};

export type GroupConfig = {
  id: string;
  position?: Vector;
  goto?: View;
  rotation?: Vector;
  objects: ObjectConfig[];
};

const SECTION_UNIT = 2.4;
const WALL_OFFSET = 0.09;
const ZERO: Vector = [0, 0, 0];

export const groups = ([
  // Flooring
  {
    id: "flooring",
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
    id: "whiteboard",
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
    id: "shelf",
    goto: "hobbies",
    objects: [
      {
        src: "/Furniture/shelves_03.glb",
        position: [4.2, 0, -0.9],
        rotation: [0, Math.PI / 2, 0],
      },
      {
        pack: 'chess',
        src: "/black_rook.glb",
        scale: 0.2,
        position: [4, 1.14, -0.9],
        rotation: [0, Math.PI / 2, 0],
      },
    ],
  },

  // Bookshelf (Education)
  {
    id: "bookshelf",
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
    id: "desk",
    rotation: [0, Math.PI, 0],
    position: [2.4, 0, -0.5],
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
    id: "seating",
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
] as GroupConfig[]).map((group) => {
  const objects = group.objects || [];
  if (objects.length === 0) return group;

  // Calculate Centroid
  const sum = objects.reduce(
    (acc, obj) => {
      const pos = obj.position || [0, 0, 0];
      return [acc[0] + pos[0], acc[1] + pos[1], acc[2] + pos[2]];
    },
    [0, 0, 0]
  );

  const count = objects.length;
  const centroid: Vector = [sum[0] / count, sum[1] / count, sum[2] / count];

  // New Group Position = Old Group Position + Centroid
  const currentGroupPos = group.position || [0, 0, 0];
  const newGroupPosition: Vector = [
    currentGroupPos[0] + centroid[0],
    currentGroupPos[1] + centroid[1],
    currentGroupPos[2] + centroid[2],
  ];

  // Move Objects
  const centeredObjects = objects.map((obj) => {
    const pos = obj.position || [0, 0, 0];
    return {
      ...obj,
      position: [
        pos[0] - centroid[0],
        pos[1] - centroid[1],
        pos[2] - centroid[2],
      ] as Vector,
    };
  });

  return {
    ...group,
    position: newGroupPosition,
    objects: centeredObjects,
  };
});