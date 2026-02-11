<script lang="ts">
  import { T, useTask } from '@threlte/core';
  import { CylinderGeometry, ShaderMaterial, DoubleSide, Vector3 } from 'three';

  export let position: [number, number, number] = [0, 0, 0];
  export const target: [number, number, number] = [0, 0, 0];
  export const color = "#ffb74d";
  export let opacity = 0.5;

  // Simple Volumetric Shader
  const material = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    uniforms: {
      uColor: { value: new Vector3(1, 0.7, 0.3) },
      uOpacity: { value: opacity }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      uniform vec3 uColor;
      uniform float uOpacity;
      void main() {
        // Fresnel-like effect to make the edges soft
        float intensity = pow(0.5 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
        gl_FragColor = vec4(uColor, intensity * uOpacity);
      }
    `
  });
</script>

<T.Mesh {position} {material} scale={[1, 10, 1]}>
  <T.CylinderGeometry args={[0.1, 2, 1, 32, 1, true]} />
</T.Mesh>