precision highp float;

uniform vec2 uResolution;
uniform vec2 uCursorHead; // leading edge (normalized 0–1)
uniform vec2 uCursorTail; // trailing edge (normalized 0–1)
uniform float uTime;

// Signed distance to a capsule (line with rounded ends)
float sdCapsule(vec2 p, vec2 a, vec2 b, float r) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - r;
}

// Smooth blob falloff
float blob(float d, float softness) {
  return smoothstep(softness, 0.0, d);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  // Normalized UV
  vec2 uv = fragCoord / uResolution;

  // Aspect-corrected space
  float aspect = uResolution.x / uResolution.y;
  vec2 p = uv;
  p.x *= aspect;

  // Cursor positions (aspect corrected)
  vec2 head = uCursorHead;
  vec2 tail = uCursorTail;
  head.x *= aspect;
  tail.x *= aspect;

  // Motion vector
  vec2 dir = head - tail;
  float speed = length(dir);

  // Blob parameters
  float baseRadius = 0.03;
  float stretch = clamp(speed * 2.5, 0.0, 0.08);
  float radius = baseRadius + stretch;
  float softness = radius * 1.5;

  // Capsule blob between tail and head
  float d = sdCapsule(p, tail, head, radius);
  float shape = blob(d, softness);

  // Extra metaball at head for gooey feel
  float headBlob = blob(length(p - head) - radius * 1.2, softness);

  // Combine
  float alpha = max(shape, headBlob);

  // Subtle pulse (optional)
  alpha *= 0.85 + 0.15 * sin(uTime * 6.0);

  vec3 color = vec3(1.0);

  fragColor = vec4(color, alpha);
}