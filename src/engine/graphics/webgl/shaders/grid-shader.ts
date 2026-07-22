import type { ShaderPair } from "../webgl-lib/areo-types";

const vertex = `#version 300 es

in vec4 a_position;
in vec3 a_normal;

uniform mat4 u_worldViewProjection;
uniform mat4 u_world;

out vec3 v_normal;
out vec3 v_worldPos;

void main(){
    gl_Position = u_worldViewProjection * a_position;
    v_normal = mat3(u_world) * a_normal;
    vec4 world = u_world * a_position;
    v_worldPos = world.xyz;
}

`;
const fragment = `#version 300 es

precision highp float;

in vec3 v_worldPos;
out vec4 outColor;

void main(){
    float tileSize = 1.0;
    // What is this?
    float thickness = 0.05;

    float cell = v_worldPos.x / tileSize;
    float f = fract(v_worldPos.x / tileSize);
    float onLine = f < thickness ? 1.0 : 0.0;
    float halfWidth = 0.005; // tweak: smaller = thinner lines

    float fx = fract(v_worldPos.x / tileSize + 0.5);
    float fz = fract(v_worldPos.z / tileSize + 0.5);

    float distX = min(fx, 1.0 - fx);
    float aaX= fwidth(v_worldPos.x / tileSize);
    float lx = 1.0 - smoothstep(halfWidth, halfWidth + aaX, distX);

    float distZ = min(fz, 1.0 - fz);
    float aaZ = fwidth(v_worldPos.z / tileSize);
    float lz = 1.0 - smoothstep(halfWidth, halfWidth + aaZ, distZ);

    float grid = max(lx, lz);

    vec3 color = mix(vec3(0,0,0), vec3(0.2,0.1,0.2), grid);
    outColor = vec4(color, 1.0);
}

`;

export const gridShaders: ShaderPair = {
  vertex,
  fragment,
};
