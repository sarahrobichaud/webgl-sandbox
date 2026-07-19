import { isBuiltIn } from "../webgl-utils";
import type { AreoProgram, Mesh, ShaderPair } from "./areo-types";

const ACTIVE_ATTRIBUTES = 0x8b89;
const ACTIVE_UNIFORMS = 0x8b86;
const FLOAT = 0x1406;

export class AreoGL {
  #c: WebGL2RenderingContext;

  constructor(gl: WebGL2RenderingContext) {
    this.#c = gl;
  }

  /**
   * Creates a WebGL program
   * @param shaders - The shaders to link
   * @returns the program
   */
  createProgram(name: string, shaders: ShaderPair) {
    const vShader = this.#createShader(this.#c.VERTEX_SHADER, shaders.vertex);
    const fShader = this.#createShader(this.#c.FRAGMENT_SHADER, shaders.fragment);

    const program = this.#c.createProgram();
    this.#c.ACTIVE_UNIFORMS;
    this.#c.attachShader(program, vShader);
    this.#c.attachShader(program, fShader);
    this.#c.linkProgram(program);

    const success = this.#c.getProgramParameter(program, this.#c.LINK_STATUS);

    if (!success) {
      this.#c.deleteProgram(program);
      console.log(this.#c.getProgramInfoLog(program));
    }

    return this.#createProgramInfo(name, program);
  }

  loadGeometry(program: AreoProgram, meshes: Mesh[]) {
    for (const mesh of meshes) {
      const vao = this.#c.createVertexArray();

      this.#c.bindVertexArray(vao);

      this.#setupAttributes(program);
      this.#loadAttributeData(program, mesh);

      mesh.r_programId = "basic";
      mesh.r_vao = vao;
    }
  }

  /*
   * PRIVATE
   */
  #createProgramInfo(name: string, program: WebGLProgram): AreoProgram {
    const areoProgram = {
      name,
      program,
      attributes: this.#getActiveAttributesInfo(program),
      sharedUniforms: this.#getActiveUniforms(program),
    };

    this.#setupAttributes(areoProgram);

    return areoProgram;
  }

  #getActiveUniforms(program: WebGLProgram) {
    const uniforms = {} as Record<string, WebGLActiveInfo & { location: WebGLUniformLocation }>;

    for (let i = 0; i < this.#getActiveUniformsCount(program); i++) {
      const info = this.#c.getActiveUniform(program, i);

      if (!info) {
        throw new Error("Info should be defined, something is wrong");
      }

      if (isBuiltIn(info)) {
        continue;
      }

      const location = this.#c.getUniformLocation(program, info.name);

      if (!location) {
        throw new Error("location should exist, somehting is wrong");
      }

      uniforms[info.name] = {
        name: info.name,
        size: info.size,
        type: info.type,
        location: location,
      };
    }
    return uniforms;
  }

  #setupAttributes(program: AreoProgram) {
    for (const attribute of Object.values(program.attributes)) {
      this.#c.bindBuffer(this.#c.ARRAY_BUFFER, attribute.buffer);
      this.#c.enableVertexAttribArray(attribute.location);
      this.#c.vertexAttribPointer(attribute.location, 3, FLOAT, false, 0, 0);
    }
  }

  #loadAttributeData(program: AreoProgram, mesh: Mesh) {
    const positions = program.attributes.a_position;
    const normals = program.attributes.a_normal;

    this.#c.bindBuffer(this.#c.ARRAY_BUFFER, positions.buffer);
    this.#c.bufferData(this.#c.ARRAY_BUFFER, new Float32Array(mesh.vertices), this.#c.STATIC_DRAW);

    this.#c.bindBuffer(this.#c.ARRAY_BUFFER, normals.buffer);
    this.#c.bufferData(this.#c.ARRAY_BUFFER, new Float32Array(mesh.normals), this.#c.STATIC_DRAW);
  }

  #getActiveAttributesInfo(program: WebGLProgram) {
    const attributes = {} as Record<string, WebGLActiveInfo & { location: number; buffer: WebGLBuffer }>;

    for (let i = 0; i < this.#getActiveAttributesCount(program); i++) {
      const info = this.#c.getActiveAttrib(program, i);

      if (!info) {
        throw new Error("Info should be defined, something is wrong");
      }

      if (isBuiltIn(info)) {
        continue;
      }

      const location = this.#c.getAttribLocation(program, info.name);

      attributes[info.name] = {
        name: info.name,
        size: info.size,
        type: info.type,
        location: location,
        buffer: this.#c.createBuffer(),
      };
    }
    return attributes;
  }

  /**
   * Returns the number of active attributes in a program
   * @param program - The program
   * @returns - Number of active attributes
   */
  #getActiveAttributesCount(program: WebGLProgram) {
    return this.#c.getProgramParameter(program, ACTIVE_ATTRIBUTES);
  }
  #getActiveUniformsCount(program: WebGLProgram) {
    return this.#c.getProgramParameter(program, ACTIVE_UNIFORMS);
  }

  /**
   * Compiles a shader from source
   *
   * - Vertex or Fragment
   *
   * @param type - The type
   * @param source  - The source code
   * @returns - The shader
   */
  #createShader(type: number, source: string) {
    const shader = this.#c.createShader(type)!;
    this.#c.shaderSource(shader, source);
    this.#c.compileShader(shader);

    const success = this.#c.getShaderParameter(shader, this.#c.COMPILE_STATUS);

    if (!success) {
      this.#c.deleteShader(shader);
      console.log(this.#c.getShaderInfoLog(shader));
    }

    return shader;
  }
}
