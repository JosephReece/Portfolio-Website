import { Object3D, Vector3 } from "three";
import type { Vector } from "./view";

export function centerObjectOnChildren(root: Object3D) {
  const children = root.children;
  if (children.length === 0) return null;

  const centroid = new Vector3();
  for (const child of children) {
    centroid.add(child.position);
  }

  centroid.divideScalar(children.length);

  // root.position.add(centroid);

  for (const child of children) {
    child.position.sub(centroid);
  }

  return centroid;
}
