<script lang="ts">
  import { 
    Vector2, WebGLRenderTarget, Mesh, PlaneGeometry, 
    ShaderMaterial, OrthographicCamera, LinearFilter 
  } from 'three'
  import { useTask, useThrelte } from '@threlte/core'
  import { EffectComposer, EffectPass, RenderPass } from 'postprocessing'
  import { CursorEffect } from './effects/cursor'
  import cursorBufferFrag from './effects/cursorBuffer.frag?raw'

  const { renderer, scene, camera, size, autoRender, renderStage } = useThrelte()

  // 1. Setup Ping-Pong Targets
  const createTarget = () => new WebGLRenderTarget($size.width, $size.height, {
    minFilter: LinearFilter,
    magFilter: LinearFilter
  })

  let targetA = createTarget()
  let targetB = createTarget()

  // 2. Buffer Logic
  const bufferMat = new ShaderMaterial({
    uniforms: {
      uPrevBuffer: { value: null },
      uCursorHead: { value: new Vector2(0.5, 0.5) },
      uCursorPrev: { value: new Vector2(0.5, 0.5) },
      uFade: { value: 0.97 }
    },
    vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xyz, 1.0); }`,
    fragmentShader: cursorBufferFrag
  })
  const bufferMesh = new Mesh(new PlaneGeometry(2, 2), bufferMat)
  const bufferCam = new OrthographicCamera(-1, 1, 1, -1, 0, 1)

  // 3. Post Processing Setup
  const composer = new EffectComposer(renderer)
  const cursorEffect = new CursorEffect()
  
  composer.addPass(new RenderPass(scene, $camera))
  composer.addPass(new EffectPass($camera, cursorEffect))

  const mouse = new Vector2(0.5, 0.5)
  const lastMouse = new Vector2(0.5, 0.5)

  if (typeof window !== 'undefined') {
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX / window.innerWidth
      mouse.y = 1.0 - e.clientY / window.innerHeight
    })
  }

  $effect(() => {
    composer.setSize($size.width, $size.height)
    targetA.setSize($size.width, $size.height)
    targetB.setSize($size.width, $size.height)
  })

  $effect(() => {
    autoRender.set(false)
    return () => autoRender.set(true)
  })

  useTask((delta) => {
    // Set uniforms for the logic pass
    bufferMat.uniforms.uCursorHead.value.copy(mouse)
    bufferMat.uniforms.uCursorPrev.value.copy(lastMouse)
    bufferMat.uniforms.uPrevBuffer.value = targetA.texture
    
    // Render the logic into targetB
    renderer.setRenderTarget(targetB)
    renderer.render(bufferMesh, bufferCam)

    // Pass the result to the post-processing effect
    const maskUniform = cursorEffect.uniforms.get('uTrailMask')
    if (maskUniform) maskUniform.value = targetB.texture
    
    const timeUniform = cursorEffect.uniforms.get('uTime')
    if (timeUniform) timeUniform.value += delta

    // Render final scene
    renderer.setRenderTarget(null)
    composer.render(delta)

    // SWAP: Current targetB becomes the "Previous" for next frame
    const temp = targetA
    targetA = targetB
    targetB = temp

    // Update lastMouse AFTER the render so the next frame connects
    lastMouse.copy(mouse)
  }, { stage: renderStage, autoInvalidate: false })
</script>