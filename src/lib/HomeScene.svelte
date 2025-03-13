<script lang="ts">
  import { onMount } from "svelte";
  import { interactivity } from "@threlte/extras";
  import { T } from "@threlte/core";
  import { Tween } from "svelte/motion";
  import { sineOut } from "svelte/easing";

  let rotation = 0;
  let color = "#3498db"; // Initial color

  const extraSpin = new Tween(0, {
    duration: 500,
    easing: sineOut,
  });

  onMount(() => {
    const animate = () => {
      rotation += 0.03;
      requestAnimationFrame(animate);
    };

    animate();
  });

  function onPointerEnter() {
    color = "#2ecc71"; // Change to green on hover
  }

  function onPointerLeave() {
    color = "#3498db"; // Change back to blue on leave
  }

  function onClick() {
    extraSpin.set(extraSpin.current + 2);
  }

  interactivity();
</script>

<T.Group rotation={[0, rotation + extraSpin.current, 0]}>
  <T.Mesh
    onpointerenter={onPointerEnter}
    onpointerleave={onPointerLeave}
    onclick={onClick}
  >
    <T.BoxGeometry args={[1, 1, 1]} />
    <T.MeshStandardMaterial {color} />
  </T.Mesh>
</T.Group>
