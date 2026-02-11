<script lang="ts">
  import { T, useTask } from "@threlte/core";
  import HoverGroup from "../HoverGroup.svelte";
  import { currentView, tooltip, type Vector } from "$lib/view";
  import { Spring } from "svelte/motion";
  import { MathUtils } from "three";

  let { scene = $bindable() } = $props();

  const focused = $derived($currentView === "hobbies");
  const node = scene.getObjectByName("Hobbies");

  const plane = node.getObjectByName("Plane");
  const rook = node.getObjectByName("White_Rook");
  const text = node.getObjectByName("Text");

  const names = ["plane", "rook", "text"] as const;
  type HoverName = (typeof names)[number];

  const tooltipDetails = {
    plane: {
      title: "Flying",
      description:
        "I am a licensed microlight pilot and earned my NPPL(M) at 18 through a flying bursary. Always fun to fly around and see the views of the UK from above.",
    },
    rook: {
      title: "Chess & Poker",
      description:
        "I love chess; currently sitting at the 2000 online elo mark. I hope one day to be a titled player. I am also quite fond of poker, it's fun socially, but I really enjoy the strategy and maths behind it too.",
    },
    text: {
      title: "Languages",
      description:
        "I have been obsessed with languages for quite some time. I am always jumping from one language to the next. Currently battling Mandarin tones, and will try and aim for a HSK3 certificate this year.",
    },
  };

  let position: Vector | null = $state(null);
  let hoverReady = $state(false);

  let hoverQueue: HoverName[] = $state([]);
  const activeHover = $derived(hoverQueue[0] ?? null);

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

  $effect(() => {
    if (!focused) {
      hoverQueue = [];
    }
  });

  const lift = {
    plane: new Spring(0, { stiffness: 0.1, damping: 0.45 }),
    rook: new Spring(0, { stiffness: 0.1, damping: 0.45 }),
    text: new Spring(0, { stiffness: 0.1, damping: 0.45 }),
  };

  let wobbleTime = $state({
    plane: 0,
    rook: 0,
    text: 0,
  });

  const wobbleDetails = { stiffness: 0.04, damping: 0.6 };
  const wobble = {
    plane: new Spring(0, wobbleDetails),
    rook: new Spring(0, wobbleDetails),
    text: new Spring(0, wobbleDetails),
  };

  const snapDetails = { stiffness: 0.1, damping: 1.2 };
  const snap = {
    plane: new Spring(0, snapDetails),
    rook: new Spring(0, snapDetails),
    text: new Spring(0, snapDetails),
  };

  const spinning = {
    plane: false,
    rook: false,
    text: false,
  };

  const HOVER_HEIGHT = 0.1;
  const SPIN_SPEED = 0.01;
  const WOBBLE_AMPLITUDE = 0.08;
  const WOBBLE_SPEED = 0.0025;

  function hover(name: HoverName) {
    if (!focused) return;

    if (!hoverQueue.includes(name)) {
      hoverQueue = [...hoverQueue, name];
    }
  }

  function unhover(name: HoverName) {
    hoverQueue = hoverQueue.filter((n) => n !== name);
  }

  // React to active hover changes
  $effect(() => {
    names.forEach((name) => {
      const isActive = activeHover === name;

      if (isActive) {
        tooltip.set(tooltipDetails[name]);
        lift[name].target = HOVER_HEIGHT;
        wobble[name].target = 1;
        spinning[name] = true;
      } else {
        lift[name].target = 0;
        wobble[name].target = 0;
        spinning[name] = false;
        snap[name].set(0);
      }
    });

    if (!activeHover) {
      tooltip.set(null);
    }
  });

  const quickRoute = (y: number) =>
    ((a) => (a > Math.PI ? a - Math.PI * 2 : a))(
      MathUtils.euclideanModulo(y, Math.PI * 2),
    );

  useTask(() => {
    if (!hoverReady) return;

    function animate(obj: any, name: HoverName) {
      obj.position.y = baselines[name].y + lift[name].current;

      if (spinning[name]) {
        obj.rotation.y += SPIN_SPEED;
        snap[name].set(quickRoute(obj.rotation.y));

        wobbleTime[name] += WOBBLE_SPEED;
        const w = wobble[name].current * WOBBLE_AMPLITUDE;

        obj.rotation.x = Math.sin(wobbleTime[name] * 1.3) * w;
        obj.rotation.z = Math.cos(wobbleTime[name] * 1.1) * w;
      } else {
        obj.rotation.y = snap[name].current;
        obj.rotation.x *= 0.9;
        obj.rotation.z *= 0.9;
      }
    }

    if (plane) animate(plane, "plane");
    if (rook) animate(rook, "rook");
    if (text) animate(text, "text");
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
