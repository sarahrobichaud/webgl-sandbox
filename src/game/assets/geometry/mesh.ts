/**
 * Mesh convention (see docs/grid-system.md):
 * - Local space is unit-sized: each mesh fits in a 1×1×1 box centered on the origin.
 * - Extent is [-0.5, 0.5] on each axis used by the shape.
 * - At transform scale = 1, the mesh is 1 world unit across (= 1 gameplay tile).
 * - Size in the world comes only from the entity/floor transform scale.
 */

import type { Mesh } from "../../../engine/contracts/geometry/geometry.contract";

// prettier-ignore
const CUBE_VERTICES = [
  // Front (+Z)
  -0.5, -0.5,  0.5,
   0.5, -0.5,  0.5,
   0.5,  0.5,  0.5,
  -0.5, -0.5,  0.5,
   0.5,  0.5,  0.5,
  -0.5,  0.5,  0.5,

  // Back (-Z)
   0.5, -0.5, -0.5,
  -0.5, -0.5, -0.5,
  -0.5,  0.5, -0.5,
   0.5, -0.5, -0.5,
  -0.5,  0.5, -0.5,
   0.5,  0.5, -0.5,

  // Top (+Y)
  -0.5,  0.5, -0.5,
  -0.5,  0.5,  0.5,
   0.5,  0.5,  0.5,
  -0.5,  0.5, -0.5,
   0.5,  0.5,  0.5,
   0.5,  0.5, -0.5,

  // Bottom (-Y)
  -0.5, -0.5, -0.5,
   0.5, -0.5, -0.5,
   0.5, -0.5,  0.5,
  -0.5, -0.5, -0.5,
   0.5, -0.5,  0.5,
  -0.5, -0.5,  0.5,

  // Right (+X)
   0.5, -0.5, -0.5,
   0.5,  0.5, -0.5,
   0.5,  0.5,  0.5,
   0.5, -0.5, -0.5,
   0.5,  0.5,  0.5,
   0.5, -0.5,  0.5,

  // Left (-X)
  -0.5, -0.5, -0.5,
  -0.5, -0.5,  0.5,
  -0.5,  0.5,  0.5,
  -0.5, -0.5, -0.5,
  -0.5,  0.5,  0.5,
  -0.5,  0.5, -0.5,
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

export const CUBE_MESH: Mesh = {
  vertices: CUBE_VERTICES,
  normals: CUBE_NORMALS,
  origin: [
    0, -0.5, 0,
  ],
};

// Unit pyramid: apex (0, 0.5, 0), base y = -0.5, base XY extent [-0.5, 0.5]. Flat normals.
// prettier-ignore
const PYRAMID_VERTICES = [
  // Front
   0,  0.5,  0,
  -0.5, -0.5,  0.5,
   0.5, -0.5,  0.5,
  // Right
   0,  0.5,  0,
   0.5, -0.5,  0.5,
   0.5, -0.5, -0.5,
  // Back
   0,  0.5,  0,
   0.5, -0.5, -0.5,
  -0.5, -0.5, -0.5,
  // Left
   0,  0.5,  0,
  -0.5, -0.5, -0.5,
  -0.5, -0.5,  0.5,
  // Base
  -0.5, -0.5, -0.5,
   0.5, -0.5, -0.5,
   0.5, -0.5,  0.5,
  -0.5, -0.5, -0.5,
   0.5, -0.5,  0.5,
  -0.5, -0.5,  0.5,
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
  vertices: PYRAMID_VERTICES,
  normals: PYRAMID_NORMALS,
  origin: [
    0, -0.5, 0,
  ],
};

// Unit ground plane on XZ (y = 0), extent [-0.5, 0.5] → 1×1 tile at scale 1.
// Normal +Y. Wound CCW when viewed from above. Scale X/Z for size; no rotate needed.
// prettier-ignore
const PLANE_VERTICES = [
  -0.5, 0, -0.5,
  -0.5, 0,  0.5,
   0.5, 0,  0.5,
  -0.5, 0, -0.5,
   0.5, 0,  0.5,
   0.5, 0, -0.5,
];

const PLANE_NORMALS = [
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
];

export const PLANE_MESH: Mesh = {
  vertices: PLANE_VERTICES,
  normals: PLANE_NORMALS,
};

export const MESHES = {
  cube: CUBE_MESH,
  pyramid: PYRAMID_MESH,
  plane: PLANE_MESH,
} as const;

export type MeshId = keyof typeof MESHES;
