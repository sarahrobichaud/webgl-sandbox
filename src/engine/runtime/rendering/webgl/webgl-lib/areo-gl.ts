import type { Mesh } from "../../../../contracts/geometry/geometry.contract";
import type { VertexLayout } from "../../../../contracts/internal";
import type { Program, Shaders } from "../../../../contracts/rendering/renderer.contract";
import { isBuiltIn } from "../webgl-utils";

const ACTIVE_ATTRIBUTES = 0x8b89;
const ACTIVE_UNIFORMS = 0x8b86;
const FLOAT = 0x1406;

export class AreoGL {
  #ctx: WebGL2RenderingContext;

  constructor(gl: WebGL2RenderingContext) {
    this.#ctx = gl;
  }
  /**
   * Public
   */

  /**
   * Creates a WebGL program
   * @param shaders - The shaders to link
   * @returns the program
   */
  createProgram(name: string, shaders: Shaders) {
    const vShader = this.#createShader(this.#ctx.VERTEX_SHADER, shaders.vertex);
    const fShader = this.#createShader(this.#ctx.FRAGMENT_SHADER, shaders.fragment);

    const program = this.#ctx.createProgram();
    this.#ctx.ACTIVE_UNIFORMS;
    this.#ctx.attachShader(program, vShader);
    this.#ctx.attachShader(program, fShader);
    this.#ctx.linkProgram(program);

    const success = this.#ctx.getProgramParameter(program, this.#ctx.LINK_STATUS);

    if (!success) {
      const log = this.#ctx.getProgramInfoLog(program);
      this.#ctx.deleteProgram(program);
      throw new Error(`Program link failed (${name}): ${log}`);
    }

    return this.#createProgramInfo(name, program);
  }

  /**
   * Uploads geometry data to a buffer and assigns a VAO to a mesh
   * @param program - The program
   * @param meshes - All meshes
   */
  loadGeometry(layout: VertexLayout, data: Mesh) {
    const vao = this.#ctx.createVertexArray();
    this.#ctx.bindVertexArray(vao);

    this.#uploadAttribute(layout.POSITION, data.vertices);
    this.#uploadAttribute(layout.NORMAL, data.normals);

    this.#ctx.bindVertexArray(null);

    return vao;
  }

  /*
   * PRIVATE
   */
  #createProgramInfo(name: string, program: WebGLProgram): Program {
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
    const buffer = this.#ctx.createBuffer();
    this.#ctx.bindBuffer(this.#ctx.ARRAY_BUFFER, buffer);
    this.#ctx.bufferData(this.#ctx.ARRAY_BUFFER, new Float32Array(data), this.#ctx.STATIC_DRAW);
    this.#ctx.enableVertexAttribArray(location);
    this.#ctx.vertexAttribPointer(location, 3, FLOAT, false, 0, 0);
  }

  /**
   *
   * @param program
   * @returns
   */
  #getActiveUniforms(program: WebGLProgram) {
    const uniforms = {} as Record<string, WebGLActiveInfo & { location: WebGLUniformLocation }>;

    for (let i = 0; i < this.#getActiveUniformsCount(program); i++) {
      const info = this.#ctx.getActiveUniform(program, i);

      if (!info) {
        throw new Error("Info should be defined, something is wrong");
      }

      if (isBuiltIn(info)) {
        continue;
      }

      const location = this.#ctx.getUniformLocation(program, info.name);

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
   * Gets all active attributes of a program and its information
   * @param program - The program
   * @returns - Attribute object map
   */
  #getActiveAttributesInfo(program: WebGLProgram) {
    const attributes = {} as Record<string, WebGLActiveInfo & { location: number }>;

    for (let i = 0; i < this.#getActiveAttributesCount(program); i++) {
      const info = this.#ctx.getActiveAttrib(program, i);

      if (!info) {
        throw new Error("Info should be defined, something is wrong");
      }

      if (isBuiltIn(info)) {
        continue;
      }

      const location = this.#ctx.getAttribLocation(program, info.name);

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
    return this.#ctx.getProgramParameter(program, ACTIVE_ATTRIBUTES);
  }

  /**
   * Returns the number of active uniforms in a a program
   * @param program  - The program
   * @returns - Number of active uniforms
   */
  #getActiveUniformsCount(program: WebGLProgram) {
    return this.#ctx.getProgramParameter(program, ACTIVE_UNIFORMS);
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
    const shader = this.#ctx.createShader(type)!;
    this.#ctx.shaderSource(shader, source);
    this.#ctx.compileShader(shader);

    const success = this.#ctx.getShaderParameter(shader, this.#ctx.COMPILE_STATUS);

    if (!success) {
      const log = this.#ctx.getShaderInfoLog(shader);
      this.#ctx.deleteShader(shader);
      const kind = type === this.#ctx.VERTEX_SHADER ? "vertex" : "fragment";
      throw new Error(`Shader compile failed (${kind}): ${log}`);
    }

    return shader;
  }
}
