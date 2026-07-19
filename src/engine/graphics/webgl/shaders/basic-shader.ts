import type { ShaderPair } from "../webgl-lib/areo-types";

const vertex = `#version 300 es

in vec4 a_position;
in vec3 a_normal;

uniform mat4 u_worldViewProjection;
uniform mat4 u_world;

out vec3 v_normal;

void main() {
  gl_Position = u_worldViewProjection * a_position;
  v_normal = mat3(u_world) * a_normal;
}
`;

const fragment = `#version 300 es

precision highp float;

in vec3 v_normal;

uniform vec3 u_reverseLightDirection;
uniform vec4 u_color;

out vec4 outColor;

void main() {

  vec3 normal = normalize(v_normal);

  float light = dot(normal, u_reverseLightDirection);

  outColor = u_color;

  outColor.rgb *= light;
}
`;

export const shaders: ShaderPair = {
  vertex,
  fragment,
};
