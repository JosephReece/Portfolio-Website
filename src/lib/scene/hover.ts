import type { MeshStandardMaterial } from "three";

export type HoverUniforms = {
  uHover: { value: number };
  uTime: { value: number };
};

export type HoverMaterial = MeshStandardMaterial & {
  userData: {
    hoverUniforms: HoverUniforms;
  };
};

export function addHoverShader(material: MeshStandardMaterial) {
  const uniforms: HoverUniforms = {
    uHover: { value: 0 },
    uTime: { value: 0 },
  };

  material.userData.hoverUniforms = uniforms;

  material.onBeforeCompile = (shader) => {
    // Attach uniforms
    shader.uniforms.uHover = uniforms.uHover;
    shader.uniforms.uTime = uniforms.uTime;

    // Declare uniforms
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <common>",
      `
      #include <common>
      uniform float uHover;
      uniform float uTime;
      `
    );

    // Inject effect before final output
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <dithering_fragment>",
      `
      // --- Hover Effect ---

      float hover = clamp(uHover, 0.0, 1.0);

      // View direction
      vec3 viewDir = normalize(vViewPosition);

      // Fresnel edge glow
      float fresnel = pow(
        1.0 - dot(normalize(normal), viewDir),
        3.0
      );

      // Animated pulse
      float pulse = sin(uTime * 6.0) * 0.5 + 0.5;

      // Energy ripple
      float ripple =
        sin((vViewPosition.y * 8.0) + uTime * 4.0) * 0.5 + 0.5;

      vec3 glowColor = vec3(1.0, 0.4, 0.15);

      // Apply glow
      gl_FragColor.rgb +=
        glowColor *
        fresnel *
        pulse *
        hover *
        0.1;

      // Subtle surface energy
      gl_FragColor.rgb +=
        glowColor *
        ripple *
        hover *
        0.15;

      // Gentle color boost (keeps textures)
      gl_FragColor.rgb *= 1.0 + hover * 0.25;

      #include <dithering_fragment>
      `
    );
  };

  material.needsUpdate = true;
}