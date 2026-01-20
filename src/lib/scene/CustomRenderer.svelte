<script lang="ts">
  import { Vector2 } from 'three';
  import { useTask, useThrelte } from '@threlte/core';
  import { BlendFunction, EffectComposer, EffectPass, OutlineEffect, RenderPass } from 'postprocessing';

  import { GlassEffect } from './effects/glass';

  const { scene, renderer, camera, size, autoRender, renderStage } = useThrelte()

  let mouse = new Vector2(0.5, 0.5)
  if (typeof window !== 'undefined') {
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX / window.innerWidth
      mouse.y = 1 - (e.clientY / window.innerHeight)
    })
  }

  const composer = new EffectComposer(renderer)
  const renderPass = new RenderPass(scene, $camera)
  
  const glassEffect = new GlassEffect()
  
  const outlineEffectOptions: ConstructorParameters<typeof OutlineEffect>[2] = {
    blendFunction: BlendFunction.SCREEN,
    edgeStrength: 10,
    pulseSpeed: 0.0,
    xRay: true,
    blur: true
  }
  const outlineEffect = new OutlineEffect(scene, $camera, outlineEffectOptions)

  // Add both effects to a single pass for efficiency
  const effectPass = new EffectPass($camera, outlineEffect, glassEffect)

  composer.addPass(renderPass)
  composer.addPass(effectPass)

  $effect(() => {
    composer.setSize($size.width, $size.height)
  })

  // Sync cameras
  $effect(() => {
    renderPass.mainCamera = $camera
    outlineEffect.mainCamera = $camera
    effectPass.mainCamera = $camera
  })

  $effect(() => {
    const last = autoRender.current
    autoRender.set(false)
    return () => {
      autoRender.set(last)
      composer.dispose()
    }
  })

  useTask((delta) => {
    // Update glass position
    glassEffect.uniforms.get('uCursor')!.value.copy(mouse)
    
    // Optional: Subtle "fluid" pulsing
    const pulse = Math.sin(performance.now() * 0.005) * 0.01
    glassEffect.uniforms.get('uRadius')!.value = 0.12 + pulse
    
    composer.render(delta)
  }, { stage: renderStage, autoInvalidate: false })
</script>