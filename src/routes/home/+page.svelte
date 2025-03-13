<script lang="ts">
  import { onMount } from "svelte";
  import { Canvas } from "@threlte/core";
  import { OrbitControls } from "@threlte/extras";
  import { T } from "@threlte/core";
  import HomeScene from "$lib/HomeScene.svelte";

</script>

<div class="container">
  <div class="canvas-container">
    <Canvas>
      <T.PerspectiveCamera makeDefault position={[0, 1, 2.5]}>
        <OrbitControls enabled={false} />
      </T.PerspectiveCamera>

      <T.AmbientLight intensity={0.5} />
      <T.DirectionalLight position={[3, 3, 3]} intensity={0.5} />

      <HomeScene />
    </Canvas>
  </div>
  <p class="text">This Project is Currently Under Construction</p>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: #1a1a1a;
    color: white;
    font-family: Arial, sans-serif;
    text-align: center;
  }
  .canvas-container {
    width: 100%;
    height: 350px;
  }
  .text {
    margin-top: 20px;
    font-size: 2.5rem;
    max-width: 50vw;
  }
</style>
