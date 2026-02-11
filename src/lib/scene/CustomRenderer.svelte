<script lang="ts">
  import {
    ACESFilmicToneMapping,
    SRGBColorSpace,
    PCFSoftShadowMap,
  } from "three";

  import { useTask, useThrelte } from "@threlte/core";

  import {
    EffectComposer,
    EffectPass,
    RenderPass,
    BloomEffect,
    ToneMappingEffect,
    ToneMappingMode,
  } from "postprocessing";

  const { scene, renderer, camera, size, autoRender, renderStage } =
    useThrelte();

  // Renderer

  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;

  // Composer

  const composer = new EffectComposer(renderer);

  const renderPass = new RenderPass(scene, camera.current);
  composer.addPass(renderPass);

  const bloom = new BloomEffect({
    intensity: 0.3,
    luminanceThreshold: 0.85,
    luminanceSmoothing: 0.4,
    mipmapBlur: true,
  });

  const effectPass = new EffectPass(
    camera.current,
    bloom,
  );
  composer.addPass(effectPass);

  $effect(() => {
    composer.setSize($size.width, $size.height);
  });

  $effect(() => {
    renderPass.mainCamera = $camera;
    effectPass.mainCamera = $camera;
  });

  $effect(() => {
    const last = autoRender.current;
    autoRender.set(false);
    return () => autoRender.set(last);
  });

  // Cleanup

  $effect(() => {
    return () => {
      composer.removeAllPasses();
      effectPass.dispose();
      renderPass.dispose();
      composer.dispose();
    };
  });

  useTask(
    (delta) => {
      composer.render(delta);
    },
    { stage: renderStage, autoInvalidate: false },
  );
</script>
