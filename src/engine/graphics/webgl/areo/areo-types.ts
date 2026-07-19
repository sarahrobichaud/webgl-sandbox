export interface AreoAttributeInfo {
  name: string;
  size: number;
  type: number;
  location: number;
  buffer: WebGLBuffer;
}

export interface AreoUniformInfo {
  name: string;
  size: number;
  type: number;
  location: WebGLUniformLocation;
}

export interface AreoProgram {
  name: string;
  program: WebGLProgram;
  attributes: Record<string, AreoAttributeInfo>;
  sharedUniforms: Record<string, AreoUniformInfo>;
}

export interface RendererHints {
  r_id: string;
  r_vao?: WebGLVertexArrayObject;
  r_programId?: string;
}

export interface Mesh extends RendererHints {
  vertices: number[];
  normals: number[];
}

export type LoadedMesh = Required<Mesh>;

export interface ShaderPair {
  vertex: string;
  fragment: string;
}
