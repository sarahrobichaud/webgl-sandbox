import { mat4 } from "gl-matrix";

export interface RenderMatrix {
  matrix: mat4;
}

export function renderMatrix() {
  return { matrix: mat4.create() };
}
