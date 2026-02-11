<script lang="ts">
  import { T } from "@threlte/core";
  import { useGltf, interactivity, useProgress } from "@threlte/extras";
  import { MathUtils, type Object3D } from "three";

  import { loadingProgress } from "$lib/view";

  import Projects from "./groups/Projects.svelte";
  import Careers from "./groups/Careers.svelte";
  import Hobbies from "./groups/Hobbies.svelte";
  import Education from "./groups/Education.svelte";
  import Contact from "./groups/Contact.svelte";
  import Walls from "./groups/Walls.svelte";

  interactivity();

  const { progress } = useProgress();
  progress.subscribe((progress) => loadingProgress.set(progress));
</script>

<T.Group rotation.y={MathUtils.DEG2RAD * 180}>
  {#await useGltf("scene.glb") then gltf}
    {@const scene = gltf.scene.clone(true) as Object3D}
    <T is={scene as Object3D}>
      <Projects {scene} />
      <Education {scene} />
      <Contact {scene} />
      <Careers {scene} />
      <Hobbies {scene} />

      <Walls {scene} />
    </T>
  {/await}
</T.Group>
