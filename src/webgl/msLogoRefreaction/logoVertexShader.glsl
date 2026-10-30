varying vec3 vNormal;
varying vec3 vView;
varying vec3 vObjectPosition;

void main() {
  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vView = normalize(-viewPosition.xyz);
  vObjectPosition = position;
  gl_Position = projectionMatrix * viewPosition;
}
