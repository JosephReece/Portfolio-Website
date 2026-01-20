import type { Vector } from "$lib/view";

/**
 * Calculates the centroid of a set of positions and returns 
 * new positions relative to that center.
 */
export function centerPositions<T extends string>(
  positions: Record<T, Vector>
): { positions: Record<T, Vector>; centroid: Vector } {
  const keys = Object.keys(positions) as T[];
  const values = Object.values(positions) as Vector[];
  const count = values.length;

  if (count === 0) {
    return { positions, centroid: [0, 0, 0] };
  }

  // 1. Calculate the Centroid
  const centroid: Vector = values.reduce(
    (acc, curr) => [acc[0] + curr[0], acc[1] + curr[1], acc[2] + curr[2]],
    [0, 0, 0]
  ).map(val => val / count) as Vector;

  // 2. Create new positions relative to the centroid
  const centeredPositions = {} as Record<T, Vector>;
  
  for (const key of keys) {
    const p = positions[key];
    centeredPositions[key] = [
      p[0] - centroid[0],
      p[1] - centroid[1],
      p[2] - centroid[2]
    ];
  }

  return { positions: centeredPositions, centroid };
}