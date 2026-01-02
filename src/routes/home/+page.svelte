<script lang="ts">
  import { Canvas, T } from "@threlte/core";

  import Scene from "$lib/scene/Scene.svelte";
  import Camera from "$lib/Camera.svelte";
  import ViewDropdown from "$lib/ui/ViewDropdown.svelte";

  import { currentView } from "$lib/view";
    import { Sky } from "@threlte/extras";

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
    gain?.gain.setTargetAtTime(1, context!.currentTime, VOLUME_TIME);
  }

  // React to view changes
  $: {
    if (context && filter) {
      const targetFrequency = $currentView === "home" ? 22050 : 1000;

      filter.frequency.setTargetAtTime(
        targetFrequency,
        context.currentTime,
        FILTER_TIME,
      );
    }
  }
</script>

<audio bind:this={audio} src="/city-sounds.mp3" preload="metadata" loop></audio>

<div class="scene-container" onpointerdown={play}>
  <!-- View Selector -->
  <div class="fixed top-4 right-4 z-10 select-none">
    <ViewDropdown />
  </div>

  <Canvas shadows>
    <Camera />
    <Scene />

    <Sky
      setEnvironment={true}
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

<style>
  .scene-container {
    width: 100%;
    height: 100vh;
    position: relative;
  }
</style>
