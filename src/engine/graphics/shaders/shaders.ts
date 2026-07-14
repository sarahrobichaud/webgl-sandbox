export const VERTEX_SHADER_SOURCE = `#version 300 es

in vec4 a_position;

void main() {
    gl_Position = a_position;
}

`

export const FRAGMENT_SHADER_SOURCE = `#version 300 es

out vec4 outColor;

void main() {
    outColor = vec4(1, 0, 0.5, 1);
}

`