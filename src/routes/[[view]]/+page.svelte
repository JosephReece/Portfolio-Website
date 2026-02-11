<script lang="ts">
  import { onMount, type Component } from "svelte";
  import { fade } from "svelte/transition";
  import { Tween } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { Canvas, useTask } from "@threlte/core";
  import { OrbitControls, Sky } from "@threlte/extras";
  import { T } from "@threlte/core";

  import Scene from "$lib/scene/Scene.svelte";
  import CustomRenderer from "$lib/scene/CustomRenderer.svelte";
  import Camera from "$lib/scene/Camera.svelte";
  import ViewDropdown from "$lib/ui/ViewDropdown.svelte";

  import { loadingProgress, type Vector } from "$lib/view";
  import AudioHandler from "$lib/AudioHandler.svelte";
  import BottomDock from "$lib/ui/BottomDock.svelte";
  import { MathUtils, Mesh, Object3D } from "three";

  let audioHandler: AudioHandler;
  let entered = $state(false);
  let mounted = $state(false);

  let NumberFlowComponent = $state<Component | null>(null);
  let showButton = $state(false);

  const progress = new Tween(0, {
    duration: 800,
    easing: cubicOut,
  });

  $effect(() => {
    progress.set($loadingProgress);
  });

  $effect(() => {
    if (progress.current >= 0.999) {
      const timer = setTimeout(() => {
        showButton = true;
      }, 400);
      return () => clearTimeout(timer);
    } else {
      showButton = false;
    }
  });

  onMount(async () => {
    mounted = true;

    // Loaded client-side only — NumberFlow accesses DOM globals and crashes Cloudflare Workers SSR
    const mod = await import("@number-flow/svelte");
    NumberFlowComponent = mod.default as any;
  });

  const displayPercent = $derived(Math.round(progress.current * 100));

  const handleEnter = () => {
    entered = true;
    if (audioHandler) audioHandler.playAudio();
  };

  const target = new Object3D();
  target.position.set(0, -0.5, 0);
</script>

<AudioHandler bind:this={audioHandler} />

<div class="relative w-full h-screen bg-black select-none" id="main">
  {#if !entered}
    <div
      out:fade={{ duration: 600 }}
      class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white"
    >
      <div out:fade={{ duration: 200 }} class="flex flex-col items-center w-72">
        <div class="mb-4 text-center" in:fade={{ delay: 200, duration: 800 }}>
          <h1 class="text-xl tracking-[0.2em] uppercase font-light mb-2">
            Joseph Reece
          </h1>
          <p class="text-[10px] tracking-[0.2em] text-white/70 uppercase">
            Software Developer
          </p>

          <p class="mt-2 text-[10px] tracking-[0.2em] text-white/70 uppercase">
            This project is currently a work in progress
          </p>
        </div>
        <div class="h-6 flex items-center justify-between">
          {#if mounted}
            {#if showButton}
              <button
                in:fade={{ duration: 400 }}
                class="px-10 py-3 border border-white/20 hover:border-white hover:bg-white hover:text-black transition-all duration-500 uppercase tracking-[0.3em] text-[12px] font-light"
                onclick={handleEnter}
              >
                Enter Portfolio
              </button>
            {:else}
              <div
                class="flex items-baseline gap-2 text-white/40 font-light italic"
              >
                {#if NumberFlowComponent}
                  <NumberFlowComponent
                    value={displayPercent}
                    class="text-3xl font-sans"
                  />
                {/if}
                <span class="text-xs uppercase tracking-widest opacity-60"
                  >%</span
                >
              </div>
            {/if}
          {/if}
        </div>

        <div class="w-full h-[1px] bg-white/10 mt-6 overflow-hidden">
          <div
            class="h-full bg-white transition-opacity duration-500"
            style="width: {mounted ? displayPercent : 0}%"
          ></div>
        </div>
      </div>
    </div>
  {/if}

  <BottomDock />
  <ViewDropdown />

  <div class="w-full h-full">
    <Canvas shadows>
      <Scene />
      <Camera />
      <CustomRenderer />

      <!-- <T.PerspectiveCamera makeDefault position={[4, 3, 6]} fov={50}>
        <OrbitControls enableDamping dampingFactor={0.05} target={[0, 1, 0]} />
      </T.PerspectiveCamera> -->

      <T is={target} />

      <T.DirectionalLight
        castShadow
        position={[-1.4, 4.6, -8]}
        intensity={1.2}
        color={"#fff1dc"}
        {target}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0002}
        shadow-normalBias={0.02}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-camera-near={0.1}
        shadow-camera-far={20}
      />

      <T.HemisphereLight
        intensity={0.25}
        skyColor={"#ffe0b2"}
        groundColor={"#8a8a8a"}
      />

      <T.PointLight
        position={[-1.459, 1.6, 1.67]}
        color="#88aaff"
        intensity={0.6}
        distance={6}
        decay={0.05}
      />

      <Sky
        setEnvironment
        azimuth={180}
        elevation={30}
        exposure={0.65}
        mieCoefficient={0.002}
        mieDirectionalG={0.86}
        rayleigh={0.3}
        turbidity={4.78}
      />
    </Canvas>
  </div>
</div>

<style>
  :global(.number-flow) {
    --number-flow-char-duration: 0.8s;
    font-variant-numeric: tabular-nums;
  }
</style>
