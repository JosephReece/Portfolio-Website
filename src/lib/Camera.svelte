<script lang="ts">
  import { T, useTask } from "@threlte/core";
  import {
    CameraControls,
    interactivity,
    useInteractivity,
    type CameraControlsRef,
  } from "@threlte/extras";
  import { cameraConfigs, currentView } from "$lib/view";

  interactivity();
  const { pointer } = useInteractivity();

  let controls: CameraControlsRef | undefined;

  // Parallax tuning
  const ROTATE_STRENGTH = 0.1; // radians max
  const SMOOTHING = 0.2;

  let lastAzimuth = 0;
  let lastPolar = 0;

  // Set base camera when view changes
  $: if (controls) {
    const cfg = cameraConfigs[$currentView];

    controls.setLookAt(
      cfg.position[0],
      cfg.position[1],
      cfg.position[2],
      cfg.target[0],
      cfg.target[1],
      cfg.target[2],
      true,
    );

    // Reset rotation state
    lastAzimuth = 0;
    lastPolar = 0;
  }

  // Mouse-driven parallax rotation
  useTask(() => {
    if (!controls) return;

    const targetAzimuth = - $pointer.x * ROTATE_STRENGTH;
    const targetPolar = $pointer.y * ROTATE_STRENGTH;

    // Smooth deltas
    const azimuthDelta = (targetAzimuth - lastAzimuth) * SMOOTHING;
    const polarDelta = (targetPolar - lastPolar) * SMOOTHING;

    controls.rotate(azimuthDelta, polarDelta, true);

    lastAzimuth += azimuthDelta;
    lastPolar += polarDelta;
  });
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
<T.PerspectiveCamera makeDefault zoom={1.4} />
