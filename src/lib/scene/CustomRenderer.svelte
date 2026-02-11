<script lang="ts">
  import {
    ACESFilmicToneMapping,
    SRGBColorSpace,
    PCFSoftShadowMap,
    Mesh,
  } from "three";

  import { useTask, useThrelte } from "@threlte/core";

  import {
    EffectComposer,
    EffectPass,
    RenderPass,
    BloomEffect,
    ToneMappingEffect,
    ToneMappingMode,
    GodRaysEffect,
  } from "postprocessing";

  const { scene, renderer, camera, size, autoRender, renderStage } =
    useThrelte();

  // Sun mesh passed from parent
  let { sunMesh } = $props();

  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.6;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;

  /* -------------------- Composer Setup -------------------- */

  const composer = new EffectComposer(renderer);

  const renderPass = new RenderPass(scene, camera.current);
  composer.addPass(renderPass);

  const bloom = new BloomEffect({
    intensity: 0.4,
    luminanceThreshold: 0.8,
    luminanceSmoothing: 0.3,
    mipmapBlur: true,
  });

  const toneMapping = new ToneMappingEffect({
    mode: ToneMappingMode.ACES_FILMIC,
  });

  /* -------------------- Godrays Reactive Setup -------------------- */

  let godrays: GodRaysEffect | null = null;
  let effectPass: EffectPass | null = null;

  $effect(() => {
    if (!sunMesh || !camera.current) return;

    // Remove old pass if re-running
    if (effectPass) {
      composer.removePass(effectPass);
      effectPass.dispose();
      godrays?.dispose();
      effectPass = null;
      godrays = null;
    }

    godrays = new GodRaysEffect(camera.current, sunMesh, {
      resolutionScale: 1,
      density: 0.97,
      decay: 0.95,
      weight: 0.6,
      exposure: 0.75,
      samples: 80,
      clampMax: 1,
    });

    effectPass = new EffectPass(
      camera.current,
      godrays,
      bloom,
      toneMapping
    );

    composer.addPass(effectPass);

    return () => {
      if (effectPass) {
        composer.removePass(effectPass);
        effectPass.dispose();
      }
      godrays?.dispose();
      effectPass = null;
      godrays = null;
    };
  });

  /* -------------------- Resize Handling -------------------- */

  $effect(() => {
    composer.setSize($size.width, $size.height);
  });

  $effect(() => {
    renderPass.mainCamera = $camera;
    if (effectPass) {
      effectPass.mainCamera = $camera;
    }
  });

  /* -------------------- Disable Threlte Auto Render -------------------- */

  $effect(() => {
    const previous = autoRender.current;
    autoRender.set(false);
    return () => autoRender.set(previous);
  });

  /* -------------------- Cleanup -------------------- */

  $effect(() => {
    return () => {
      composer.removeAllPasses();
      effectPass?.dispose();
      renderPass.dispose();
      composer.dispose();
    };
  });

  /* -------------------- Render Loop -------------------- */

  useTask(
    (delta) => {
      composer.render(delta);
    },
    { stage: renderStage, autoInvalidate: false }
  );
</script>
