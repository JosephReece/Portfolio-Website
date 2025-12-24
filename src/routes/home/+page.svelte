<script lang="ts">
  import { Canvas, T } from "@threlte/core";

  import { currentView } from "$lib/view";
  import Scene from "$lib/scene/Scene.svelte";
  import Camera from "$lib/Camera.svelte";

  let audio: HTMLAudioElement;
  let context: AudioContext | undefined;
  let filter: BiquadFilterNode | undefined;
  let gain: GainNode | undefined;

  const VOLUME_TIME = 2;
  const FILTER_TIME = 0.2;

  function setupAudio() {
    if (context) return;

    context = new AudioContext();

    const source = context.createMediaElementSource(audio);

    filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 300;

    gain = context.createGain();
    gain.gain.value = 0;

    // source → filter → gain → output
    source.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
  }

  function play() {
    setupAudio();
    context?.resume();
    audio.play();

    // fade in volume
    gain?.gain.setTargetAtTime(
      0.2,
      context!.currentTime,
      VOLUME_TIME
    );
  }

  // React to view changes
  $: if (context && filter) {
    const targetFrequency =
      $currentView === "home" ? 22050 : 1000;

    filter.frequency.setTargetAtTime(
      targetFrequency,
      context.currentTime,
      FILTER_TIME
    );
  }
</script>

<audio
  bind:this={audio}
  src="/city-sounds.mp3"
  preload="metadata"
></audio>

<div class="scene-container" onpointerdown={play}>
  <Canvas shadows>
  <Camera />

  <T.AmbientLight intensity={0.15} />

  <!-- Ceiling / room bounce -->
  <T.HemisphereLight
    skyColor="#ffffff"
    groundColor="#d6d0c8"
    intensity={0.6}
  />

  <!-- Key light (main direction) -->
  <T.DirectionalLight
    position={[6, 8, 4]}
    intensity={0.7}
    castShadow
    shadow-mapSize-width={1024}
    shadow-mapSize-height={1024}
  />

  <!-- Fill light (softens shadows) -->
  <T.DirectionalLight
    position={[-4, 6, -4]}
    intensity={0.3}
  />
  <Scene />
</Canvas>
</div>

<style>
  .scene-container {
    width: 100%;
    height: 100vh;
  }
</style>