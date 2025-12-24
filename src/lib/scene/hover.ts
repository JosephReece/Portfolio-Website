// hover.ts
import { ShaderMaterial } from "three";

export const hoverShader = new ShaderMaterial({
  uniforms: {
    uHover: { value: 0 },
    uTime: { value: 0 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uHover;
    varying vec2 vUv;

    void main() {
      vec3 base = vec3(0.9);
      vec3 hover = vec3(0.3, 0.6, 1.0);
      vec3 color = mix(base, hover, uHover);
      gl_FragColor = vec4(color, 1.0);
    }
  `
});