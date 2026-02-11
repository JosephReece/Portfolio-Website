import { Material, Mesh, type Object3D } from "three";

export function portal(node: HTMLElement, target: HTMLElement = document.body) {
  target.appendChild(node);

  return {
    update(newTarget: HTMLElement) {
      if (newTarget && newTarget !== target) {
        newTarget.appendChild(node);
        target = newTarget;
      }
    },
    destroy() {
      node.remove();
    },
  };
}

function isShadowVisibleMaterial(material: Material | Material[]) {
  const mats = Array.isArray(material) ? material : [material];

  return mats.some((mat: any) => {
    // Skip fully transparent materials
    if (mat.transparent && mat.opacity === 0) return false;

    // Skip GLTF BLEND materials
    if (mat.transparent) return false;

    // Skip custom "Invisible" materials by name
    if (mat.name?.toLowerCase().includes("invisible")) return false;

    return true;
  });
}

export function setShadows(
  node: Object3D | null | undefined,
  cast: boolean = true,
  receive: boolean = true
) {
  if (!node) return;

  node.traverse((child) => {
    if (child instanceof Mesh) {
      const visible = isShadowVisibleMaterial(child.material);

      child.castShadow = cast && visible;
      child.receiveShadow = receive && visible;
    }
  });
}