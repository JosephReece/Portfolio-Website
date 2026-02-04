<script lang="ts">
  import { currentView } from "$lib/view";

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

  export function playAudio() {
    setupAudio();
    context?.resume();
    audio.play();
    gain?.gain.setTargetAtTime(0.5, context!.currentTime, VOLUME_TIME);
  }

  $effect(() => {
    const view = $currentView;

    if (context && filter) {
      const targetFrequency = view === "home" ? 22000 : 1000;
      filter.frequency.setTargetAtTime(
        targetFrequency,
        context.currentTime,
        FILTER_TIME,
      );
    }
  });
</script>

<audio bind:this={audio} src="/city-sounds.mp3" preload="metadata" loop></audio>
