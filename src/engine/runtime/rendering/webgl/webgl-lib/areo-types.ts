export interface RendererHints {
  r_id: string;
  r_vao?: WebGLVertexArrayObject;
  r_programId?: string;
}

export interface Mesh extends RendererHints {
  vertices: number[];
  normals: number[];
  origin?: [
    number, number, number,
  ];
}

export type LoadedMesh = Required<Mesh>;

export interface ShaderPair {
  vertex: string;
  fragment: string;
}
