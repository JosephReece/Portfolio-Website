<script lang="ts">
  import { T } from "@threlte/core";
  import { CameraControls } from "@threlte/extras";
  import type { CameraControlsRef } from "@threlte/extras";
  import { cameraConfigs, currentView } from "$lib/view";

  let controls: CameraControlsRef | undefined;

  // React to view changes
  $: if (controls) {
    const cfg = cameraConfigs[$currentView];

    controls.setLookAt(
      cfg.position[0],
      cfg.position[1],
      cfg.position[2],
      cfg.target[0],
      cfg.target[1],
      cfg.target[2],
      true
    );
  }
</script>

<!-- Camera controls -->
<CameraControls
  bind:ref={controls}
  enabled={false}
  smoothTime={0.25}
  dollySpeed={0.6}
  truckSpeed={0.8}
/>

<!-- Camera itself -->
<T.PerspectiveCamera
  makeDefault
  zoom={1.4}
/>