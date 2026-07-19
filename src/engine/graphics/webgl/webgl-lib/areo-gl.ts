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
   * Public
   */

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

  /**
   * Uploads geometry data to a buffer and assigns a VAO to a mesh
   * @param program - The program
   * @param meshes - All meshes
   */
  loadGeometry(program: AreoProgram, meshes: Mesh[]) {
    for (const mesh of meshes) {
      const vao = this.#c.createVertexArray();
      this.#c.bindVertexArray(vao);

      this.#uploadAttribute(program.attributes.a_position.location, mesh.vertices);
      this.#uploadAttribute(program.attributes.a_normal.location, mesh.normals);

      this.#c.bindVertexArray(null);

      mesh.r_programId = program.name;
      mesh.r_vao = vao;
    }
  }

  /*
   * PRIVATE
   */
  #createProgramInfo(name: string, program: WebGLProgram): AreoProgram {
    return {
      name,
      program,
      attributes: this.#getActiveAttributesInfo(program),
      sharedUniforms: this.#getActiveUniforms(program),
    };
  }

  /**
   * Stores attribute data in a buffer, enables and configure the VAA and VAP
   * @param location - Attribute Location
   * @param data - The data
   */
  #uploadAttribute(location: number, data: number[]) {
    const buffer = this.#c.createBuffer();
    this.#c.bindBuffer(this.#c.ARRAY_BUFFER, buffer);
    this.#c.bufferData(this.#c.ARRAY_BUFFER, new Float32Array(data), this.#c.STATIC_DRAW);
    this.#c.enableVertexAttribArray(location);
    this.#c.vertexAttribPointer(location, 3, FLOAT, false, 0, 0);
  }

  /**
   *
   * @param program
   * @returns
   */
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

  /**
   * Gets all active attributes of a program and their information
   * @param program - The program
   * @returns - Attribute object map
   */
  #getActiveAttributesInfo(program: WebGLProgram) {
    const attributes = {} as Record<string, WebGLActiveInfo & { location: number }>;

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

  /**
   * Returns the number of active uniforms in a a program
   * @param program  - The program
   * @returns - Number of active uniforms
   */
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
