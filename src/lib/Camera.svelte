<script lang="ts">
  import { interactivity, useInteractivity } from "@threlte/extras";
  import { T } from "@threlte/core";
  import { cameraConfigs, currentView, type View } from "$lib/view";
  import { quadInOut } from "svelte/easing";
  import { Tween } from "svelte/motion";

  interactivity();
  const { pointer } = useInteractivity();

  const createTweens = (initial: number[], duration: number, tween: (t: number) => number) =>
    initial.map(
      (value) => new Tween(value, { duration, easing: tween }),
    );

  // Create tweens for position and rotation
  const posTweens = createTweens(cameraConfigs.home.position, 800, quadInOut);
  const rotTweens = createTweens(cameraConfigs.home.rotation, 800, quadInOut);

  // Update targets when view changes
  // Parallax rotation drift amount
  const driftStrength = 0.03;

  // Apply pointer-based parallax to rotation tweens
  $: {
    const cfg = cameraConfigs[$currentView];

    cfg.position.forEach((val, i) => {
      posTweens[i].target = val;
    });

    cfg.rotation.forEach((val, i) => {
      if (i === 0) rotTweens[i].target = val // + $pointer.y * driftStrength; // X-axis
      if (i === 1) rotTweens[i].target = val // + -$pointer.x * driftStrength; // Y-axis
      else rotTweens[i].target = val;
    });
  }
</script>

<T.Group position={posTweens.map((t) => t.current) as [number, number, number]}>
  <T.PerspectiveCamera
    makeDefault
    zoom={1.4}
    position={[0, 0, 0]}
    rotation={rotTweens.map((t) => t.current) as [number, number, number]}
  />
</T.Group>
