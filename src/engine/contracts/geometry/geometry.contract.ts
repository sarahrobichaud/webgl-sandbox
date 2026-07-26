import type { MeshRenderHints } from "../rendering/renderer.contract";

export interface Mesh extends MeshRenderHints {
  vertices: number[];
  normals: number[];
  origin?: [
    number, number, number,
  ];
}
