<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { Tween } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { Canvas } from "@threlte/core";
  import { Sky } from "@threlte/extras";
  import NumberFlow from "@number-flow/svelte";

  import Scene from "$lib/scene/Scene.svelte";
  import CustomRenderer from "$lib/scene/CustomRenderer.svelte";
  import Camera from "$lib/scene/Camera.svelte";
  import ViewDropdown from "$lib/ui/ViewDropdown.svelte";

  import { loadingProgress } from "$lib/view";
  import AudioHandler from "$lib/AudioHandler.svelte";

  let audioHandler: AudioHandler;
  let entered = $state(false);
  let mounted = $state(false);

  // This controls the button appearance specifically
  let showButton = $state(false);

  const progress = new Tween(0, {
    duration: 800,
    easing: cubicOut,
  });

  $effect(() => {
    progress.set($loadingProgress);
  });

  // Watch for the specific moment progress reaches 100%
  $effect(() => {
    if (progress.current >= 0.999) {
      // The 200ms pause you requested
      const timer = setTimeout(() => {
        showButton = true;
      }, 400);
      return () => clearTimeout(timer);
    } else {
      showButton = false;
    }
  });

  onMount(() => {
    mounted = true;
  });

  const displayPercent = $derived(Math.round(progress.current * 100));

  const handleEnter = () => {
    entered = true;
    if (audioHandler) audioHandler.playAudio();
  };
</script>

<AudioHandler bind:this={audioHandler} />

<div class="relative w-full h-screen bg-black select-none">
  {#if !entered}
    <div
      out:fade={{ duration: 600 }}
      class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white"
    >
      <div
        out:fade={{ duration: 200 }}
        class="flex flex-col items-center justify-end h-40 w-72"
      >
        <div class="mb-4 text-center" in:fade={{ delay: 200, duration: 800 }}>
          <h1 class="text-xl tracking-[0.2em] uppercase font-light mb-2">
            Joseph Reece
          </h1>
          <p class="text-[10px] tracking-[0.2em] text-white/40 uppercase">
            Software Developer
          </p>
        </div>
        <div class="h-20 flex items-center justify-center">
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
                <NumberFlow value={displayPercent} class="text-3xl font-sans" />
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

  <div class="fixed top-4 right-4 z-10 select-none">
    <ViewDropdown />
  </div>

  <div class="w-full h-full" onpointerdown={() => audioHandler?.playAudio()}>
    <Canvas>
      <Camera />
      <Scene />
      <CustomRenderer />
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
