uniform sampler2D uScene;
uniform sampler2D uEnv;
uniform sampler2D uNormalMap;
uniform vec2 uResolution;
uniform float uRefraction;
uniform float uAberration;
uniform float uBlur;
uniform vec3 uTint;
uniform float grainAmount;
uniform float grainMix;
uniform float grainSize;
uniform float grainSeed;
varying vec3 vNormal;
varying vec3 vView;
varying vec3 vObjectPosition;

const int TAPS = 8;
const float PI = 3.14159265359;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * .1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec3 sampleEnv(vec3 direction) {
  vec2 uv = vec2(atan(direction.z, direction.x) / (2.0 * PI) + 0.5, asin(direction.y) / PI + 0.5);
  return min(texture2D(uEnv, uv).rgb, vec3(1.2));
}

void main(void)
    {
        vec3 view = normalize(vView);
        vec3 normal = faceforward(normalize(vNormal), -view, normalize(vNormal));

        // Faint surface unevenness on the flat faces only; side walls stay clean.
        float faceAmount = abs(normalize(vNormal).z);
        vec3 detail = texture2D(uNormalMap, vObjectPosition.xz * 7.0).xyz * 2.0 - 1.0;
        vec3 surface = normalize(normal + detail * 0.04 * faceAmount);

        vec2 screenUv = gl_FragCoord.xy / uResolution;
        // Lens-like shift across the logo, so the background visibly moves inside the glass.
        vec2 offset = surface.xy * uRefraction + vObjectPosition.xz * vec2(1.5, -1.5);
        vec3 color = vec3(0.0);

        for (int i = 0; i < TAPS; i++) {
            float angle = float(i) * 2.399963;
            float radius = sqrt((float(i) + 0.5) / float(TAPS)) * uBlur;
            vec2 blur = vec2(cos(angle), sin(angle)) * radius;
            color.r += texture2D(uScene, screenUv + offset * (1.0 - uAberration) + blur).r;
            color.g += texture2D(uScene, screenUv + offset + blur).g;
            color.b += texture2D(uScene, screenUv + offset * (1.0 + uAberration) + blur).b;
        }
        color = color / float(TAPS) * uTint;

        float fresnel = pow(1.0 - clamp(dot(surface, view), 0.0, 1.0), 3.0);
        vec3 reflection = sampleEnv(reflect(-view, surface));
        // Highlights brighten the refracted colour instead of adding white,
        // so the glass stays in the background's palette.
        float light = dot(reflection, vec3(0.2126, 0.7152, 0.0722));
        color *= 1.0 + light * (0.15 + fresnel * 1.4);
        // Bright bevel line where the side walls meet the camera-facing faces.
        color *= 1.0 + (1.0 - smoothstep(0.2, 0.9, faceAmount)) * 0.5;

        gl_FragColor = vec4(color, 1.0);
        #include <colorspace_fragment>
        vec2 grainCell = floor(gl_FragCoord.xy / grainSize);
        float grain = hash(grainCell + grainSeed * 17.0) - 0.5;
        float grainLayer = clamp(0.5 + grain * grainAmount * 10.0, 0.0, 1.0);
        vec3 base = clamp(gl_FragColor.rgb, 0.0, 1.0);
        vec3 overlay = mix(
          2.0 * base * grainLayer,
          1.0 - 2.0 * (1.0 - base) * (1.0 - grainLayer),
          step(0.5, base)
        );
        gl_FragColor.rgb = mix(base, overlay, grainMix);
    }
