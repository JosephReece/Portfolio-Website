<script lang="ts">
  import { T } from "@threlte/core";
  import type { Object3D } from "three";

  let props = $props();

  const CHIP_COUNT = 8;
  const CHIP_Y_STEP = 0.011;
  const CHIP_JITTER = 0.004;

  // Generate jitter once on initialization
  const chipOffsets = Array.from({ length: CHIP_COUNT }).map((_, i) => ({
    x: (Math.random() - 0.5) * CHIP_JITTER,
    y: i * CHIP_Y_STEP,
    z: (Math.random() - 0.5) * CHIP_JITTER,
  }));
</script>

<T.Group {...props} scale={1.4}>
  {#each chipOffsets as offset}
    <T.Mesh position={[offset.x, offset.y, offset.z]}>
      <T.BoxGeometry args={[0.04, 0.01, 0.04]} />
      <T.MeshStandardMaterial color="red" />
    </T.Mesh>
  {/each}
</T.Group>
