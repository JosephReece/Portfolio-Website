<script lang="ts">
  import { T, useTask } from "@threlte/core";
  import HoverGroup from "../HoverGroup.svelte";
  import { currentView, type Vector } from "$lib/view";
  import { Spring } from "svelte/motion";

  let { scene = $bindable() } = $props();

  const focused = $derived($currentView === "hobbies");
  const node = scene.getObjectByName("Hobbies");

  const plane = node.getObjectByName("Plane");
  const rook = node.getObjectByName("White_Rook");
  const text = node.getObjectByName("Text");

  let position: Vector | null = $state(null);
  let hoverReady = $state(false);

  let baselines = $state({
    plane: { x: 0, y: 0, z: 0 },
    rook: { x: 0, y: 0, z: 0 },
    text: { x: 0, y: 0, z: 0 },
  });

  function snapshot(obj: any) {
    return {
      x: obj.position.x,
      y: obj.position.y,
      z: obj.position.z,
    };
  }

  $effect(() => {
    if (node && !position) {
      position = [node.position.x, node.position.y, node.position.z];
      node.position.set(0, 0, 0);

      if (!hoverReady) {
        baselines.plane = snapshot(plane);
        baselines.rook = snapshot(rook);
        baselines.text = snapshot(text);
      }

      hoverReady = true;
    }
  });

  const hoverHeight = 0.1;

  const lift = {
    plane: new Spring(0, { stiffness: 0.1, damping: 0.45 }),
    rook: new Spring(0, { stiffness: 0.1, damping: 0.45 }),
    text: new Spring(0, { stiffness: 0.1, damping: 0.45 }),
  };

  const snap = {
    plane: new Spring(0, { stiffness: 0.12, damping: 0.9 }),
    rook: new Spring(0, { stiffness: 0.12, damping: 0.9 }),
    text: new Spring(0, { stiffness: 0.12, damping: 0.9 }),
  };

  const spinning = {
    plane: false,
    rook: false,
    text: false,
  };

  function hover(name: keyof typeof lift) {
    if (!focused) return;

    lift[name].target = hoverHeight;
    spinning[name] = true;
  }

  function unhover(name: keyof typeof lift) {
    lift[name].target = 0;

    spinning[name] = false;

    // snap rotation back to zero
    snap[name].set(0);
  }

  const SPIN_SPEED = 0.01; // radians per frame

  useTask(() => {
    if (!hoverReady) return;

    if (plane) {
      plane.position.y = baselines.plane.y + lift.plane.current;

      if (spinning.plane) {
        plane.rotation.y += SPIN_SPEED;
        snap.plane.set(plane.rotation.y);
      } else {
        plane.rotation.y = snap.plane.current;
      }
    }

    if (rook) {
      rook.position.y = baselines.rook.y + lift.rook.current;

      if (spinning.rook) {
        rook.rotation.y += SPIN_SPEED;
        snap.rook.set(rook.rotation.y);
      } else {
        rook.rotation.y = snap.rook.current;
      }
    }

    if (text) {
      text.position.y = baselines.text.y + lift.text.current;

      if (spinning.text) {
        text.rotation.y += SPIN_SPEED;
        snap.text.set(text.rotation.y);
      } else {
        text.rotation.y = snap.text.current;
      }
    }
  });
</script>

{#if node && position}
  <HoverGroup view="hobbies" bind:centroid={position}>
    <T is={node}>
      {#if plane}
        <T
          is={plane}
          onpointerenter={() => hover("plane")}
          onpointerleave={() => unhover("plane")}
        />
      {/if}

      {#if rook}
        <T
          is={rook}
          onpointerenter={() => hover("rook")}
          onpointerleave={() => unhover("rook")}
        />
      {/if}

      {#if text}
        <T
          is={text}
          onpointerenter={() => hover("text")}
          onpointerleave={() => unhover("text")}
        />
      {/if}
    </T>
  </HoverGroup>
{/if}
