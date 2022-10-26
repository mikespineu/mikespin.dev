export const vertexShader: string = `
uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
uniform vec2 pixels;
float PI = 3.14159265359;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;
