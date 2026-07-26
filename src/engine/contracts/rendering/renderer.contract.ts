import type { Mesh } from "../geometry/geometry.contract";

export type RendererType = "web-gl";

export interface Viewport {
  size: { height: number; width: number };
}

export interface MeshRenderHints {
  r_id: string;
  r_vao?: WebGLVertexArrayObject;
  r_programId?: string;
}

export type LoadedMesh = Required<Mesh>;

export interface Shaders {
  vertex: string;
  fragment: string;
}
