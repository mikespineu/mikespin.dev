uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
uniform vec2 pixels;
varying vec3 vColor;

void main(void)
    {
        gl_FragColor = vec4(vUv, 0.0, 1.0);
//        gl_FragColor = vec4(vColor, 1.0);
    }

