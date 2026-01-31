uniform sampler2D uTrailMask;
uniform sampler2D tDiffuse;
uniform float uTime;
uniform float uEnabled;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 fragColor) {
  if(uEnabled < 0.5) {
    fragColor = texture2D(tDiffuse, uv);
    return;
  }

  // 1. Sample the mask and calculate the surface normal (slope)
  float mask = texture2D(uTrailMask, uv).r;
  float texelSize = 0.002;

  float nx = texture2D(uTrailMask, uv + vec2(texelSize, 0.0)).r - texture2D(uTrailMask, uv - vec2(texelSize, 0.0)).r;
  float ny = texture2D(uTrailMask, uv + vec2(0.0, texelSize)).r - texture2D(uTrailMask, uv - vec2(0.0, texelSize)).r;
  vec2 normal = vec2(nx, ny);

  // 2. Chromatic Aberration Refraction
  float refractBase = 0.08 * mask;
  float aberration = 0.04 * mask;

  float r = texture2D(tDiffuse, uv + normal * (refractBase + aberration)).r;
  float g = texture2D(tDiffuse, uv + normal * (refractBase)).g;
  float b = texture2D(tDiffuse, uv + normal * (refractBase - aberration)).b;
  vec3 sceneColor = vec3(r, g, b);

  // 3. Edge Highlight (Fresnel-style)
  float edge = smoothstep(0.05, 0.5, length(normal)) * mask;

  // Final Composition
  vec3 finalColor = sceneColor;
  finalColor += edge * 0.2;
  finalColor = mix(finalColor, finalColor * 1.1, mask * 0.2);

  fragColor = vec4(finalColor, 1.0);
}