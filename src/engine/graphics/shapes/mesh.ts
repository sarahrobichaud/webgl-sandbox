import type { Mesh } from "../webgl/webgl-lib/areo-types";

// prettier-ignore
export const RECT_VERTICES = [
  0, 0, 
  500, 200, 
  200, 500,
  200, 500, 
  500, 200, 
  500, 500
];
const CUBE_NORMALS = [
  // Front (+Z)
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  // Back (-Z)
  0, 0, -1,
  0, 0, -1,
  0, 0, -1,
  0, 0, -1,
  0, 0, -1,
  0, 0, -1,
  // Top (+Y)
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  // Bottom (-Y)
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,
  // Right (+X)
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  // Left (-X)
  -1, 0, 0,
  -1, 0, 0,
  -1, 0, 0,
  -1, 0, 0,
  -1, 0, 0,
  -1, 0, 0,
];
// Unit cube [-1, 1]. Each face is two triangles, wound CCW when viewed from outside.
// prettier-ignore
const CUBE_VERTICES = [
  // Front (+Z)
  -1, -1,  1,
   1, -1,  1,
   1,  1,  1,
  -1, -1,  1,
   1,  1,  1,
  -1,  1,  1,

  // Back (-Z)
   1, -1, -1,
  -1, -1, -1,
  -1,  1, -1,
   1, -1, -1,
  -1,  1, -1,
   1,  1, -1,

  // Top (+Y)
  -1,  1, -1,
  -1,  1,  1,
   1,  1,  1,
  -1,  1, -1,
   1,  1,  1,
   1,  1, -1,

  // Bottom (-Y)
  -1, -1, -1,
   1, -1, -1,
   1, -1,  1,
  -1, -1, -1,
   1, -1,  1,
  -1, -1,  1,

  // Right (+X)
   1, -1, -1,
   1,  1, -1,
   1,  1,  1,
   1, -1, -1,
   1,  1,  1,
   1, -1,  1,

  // Left (-X)
  -1, -1, -1,
  -1, -1,  1,
  -1,  1,  1,
  -1, -1, -1,
  -1,  1,  1,
  -1,  1, -1,
];

export const CUBE_MESH: Mesh = {
  r_id: "cube",
  vertices: CUBE_VERTICES,
  normals: CUBE_NORMALS,
};

// Square pyramid: apex (0,1,0), base y=-1. Flat normals per face.
// prettier-ignore
const PYRAMID_VERTICES = [
  // Front
   0,  1,  0,
  -1, -1,  1,
   1, -1,  1,
  // Right
   0,  1,  0,
   1, -1,  1,
   1, -1, -1,
  // Back
   0,  1,  0,
   1, -1, -1,
  -1, -1, -1,
  // Left
   0,  1,  0,
  -1, -1, -1,
  -1, -1,  1,
  // Base
  -1, -1, -1,
   1, -1, -1,
   1, -1,  1,
  -1, -1, -1,
   1, -1,  1,
  -1, -1,  1,
];

const PYRAMID_NORMALS = [
  // Front
  0, 0.447, 0.894,
  0, 0.447, 0.894,
  0, 0.447, 0.894,
  // Right
  0.894, 0.447, 0,
  0.894, 0.447, 0,
  0.894, 0.447, 0,
  // Back
  0, 0.447, -0.894,
  0, 0.447, -0.894,
  0, 0.447, -0.894,
  // Left
  -0.894, 0.447, 0,
  -0.894, 0.447, 0,
  -0.894, 0.447, 0,
  // Base
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,
];

export const PYRAMID_MESH: Mesh = {
  r_id: "pyramid",
  vertices: PYRAMID_VERTICES,
  normals: PYRAMID_NORMALS,
};

export const MESHES = {
  cube: CUBE_MESH,
  pyramid: PYRAMID_MESH,
} as const;

export type MeshId = keyof typeof MESHES;
