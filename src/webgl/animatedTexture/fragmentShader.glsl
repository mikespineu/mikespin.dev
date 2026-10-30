uniform float uTime;
varying vec2 vUv;
uniform sampler2D uTexture;

void main(void) {
    float time = uTime;

    vec2 uv = vUv;
    vec2 repeat = vec2(8.0, 4.0);
    uv = fract(uv * repeat + vec2(sin(time), cos(time)));

    // pochylenie
    uv.x += sin(uv.y) * 0.05;

    vec4 color = texture2D(uTexture, uv);
    gl_FragColor = color;
}
