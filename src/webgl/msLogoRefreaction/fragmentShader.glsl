uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
uniform vec2 pixels;
uniform sampler2D uShadow;
uniform vec2 uResolution;
uniform float grainAmount;
uniform float grainMix;
uniform float grainSize;
uniform float grainSeed;
varying vec3 vColor;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * .1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main(void)
    {
//        gl_FragColor = vec4(vUv.x * cos(time), vUv.y * sin(time), 1.0 * -sin(time), 1.0);
        vec2 shadowUv = gl_FragCoord.xy / uResolution + vec2(0.006, -0.014);
        float shadow = 0.0;
        for (int i = 0; i < 12; i++) {
            float angle = float(i) * 2.399963;
            float radius = sqrt((float(i) + 0.5) / 12.0) * 0.022;
            shadow += texture2D(uShadow, shadowUv + vec2(cos(angle), sin(angle)) * radius).r;
        }
        // Darken towards a deeper shade of the same hue rather than towards black.
        gl_FragColor = vec4(mix(vColor, vColor * vColor, shadow / 12.0 * 0.5), 1.0);
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

