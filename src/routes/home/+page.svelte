<script lang="ts">
  import { Canvas, T } from "@threlte/core";
  import Scene from "$lib/Scene.svelte";
  import Camera from "$lib/Camera.svelte";
  import { OrbitControls } from "@threlte/extras";
</script>

<div class="scene-container">
  <Canvas>
    <!-- <T.PerspectiveCamera
      makeDefault
      enableDamping
      enableZoom
      position={[0, 0, 10]}
    >
      <OrbitControls />
    </T.PerspectiveCamera> -->

    <Camera />

    <T.AmbientLight intensity={0.5} color={"#ffdca8"} />

    <Scene />
  </Canvas>
</div>

<style>
  .scene-container {
    width: 100%;
    height: 100vh;
    /* padding: 12px; */
  }
</style>
