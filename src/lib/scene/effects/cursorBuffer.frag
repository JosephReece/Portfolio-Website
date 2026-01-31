uniform sampler2D uPrevBuffer;
uniform vec2 uCursorHead;
uniform vec2 uCursorPrev;
uniform float uFade;
varying vec2 vUv;

float dfLine(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}

void main() {
  // Sample with a slight blur to make the "glass" look rounded
  vec2 texel = 1.0 / vec2(1920.0, 1080.0); // Ideally pass resolution as uniform
  float p = texture2D(uPrevBuffer, vUv).r;
  float p1 = texture2D(uPrevBuffer, vUv + vec2(texel.x, 0.0)).r;
  float p2 = texture2D(uPrevBuffer, vUv - vec2(0.0, texel.y)).r;
  
  float blurredPrev = (p + p1 + p2) * 0.333;

  float d = dfLine(vUv, uCursorPrev, uCursorHead);
  float current = smoothstep(0.04, 0.0, d); // Wider trail for glass
  
  float mask = max(blurredPrev * uFade, current);
  
  // Hard cutoff to prevent lingering ghosts
  if(mask < 0.001) mask = 0.0;
  
  gl_FragColor = vec4(vec3(mask), 1.0);
}