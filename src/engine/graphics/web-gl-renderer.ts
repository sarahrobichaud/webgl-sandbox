import type { Renderer2D as Renderer3D, Viewport } from "./types";
import { CUBE_MESH } from "./shapes/mesh";
import { canvasToDisplaySizeMap, measureElement } from "./canvas/canvas-utils";
import { SIMPLE_F_SHADER, SIMPLE_V_SHADER } from "./shaders/shaders";
import { mat4, vec3 } from "gl-matrix";
import type { Transform3D } from "../core/primitives";

function randomColor() {
  return [
    Math.random(), Math.random(), Math.random(),
  ];
}

function getColorData(vertices: number[]) {
  const len = vertices.length / 3;

  const colors = [];
  for (let i = 0; i < len / 3; i++) {
    const random = randomColor();
    colors.push(...random);
    colors.push(...random);
    colors.push(...random);
  }

  return colors;
}

export const ATTRIBUTE = {
  A_POSITION: "a_position",
  A_NORMAL: "a_normal",
};

export const UNI = {
  U_WORLD: "u_world",
  U_WORLD_VIEW_PROJECTION: "u_worldViewProjection",
  U_COLOR: "u_color",
  U_REV_LIGHT_DIRECTION: "u_reverseLightDirection",
};

export class WebGlRenderer implements Renderer3D {
  #viewport: Viewport = { size: { height: 0, width: 0 } };
  #gl: WebGL2RenderingContext;
  #canvas: HTMLCanvasElement;

  #program: WebGLProgram;

  #attributes: Record<keyof typeof ATTRIBUTE, number>;
  #uniforms: Partial<Record<keyof typeof UNI, WebGLUniformLocation>>;
  #buffers: Record<string, WebGLBuffer>;

  #vShader: WebGLShader;
  #fShader: WebGLShader;

  #cubeColors: number[];

  constructor(parentElement: HTMLElement) {
    const { canvas } = this.#bootstrap(parentElement);

    this.#gl = canvas.getContext("webgl2")!;
    this.#canvas = canvas;

    this.#vShader = this.#createShader(this.#gl.VERTEX_SHADER, SIMPLE_V_SHADER);
    this.#fShader = this.#createShader(this.#gl.FRAGMENT_SHADER, SIMPLE_F_SHADER);

    this.#cubeColors = getColorData(CUBE_MESH.VERTICES);
    this.#program = this.#createProgram(this.#vShader, this.#fShader);

    this.#gl.enable(this.#gl.CULL_FACE);
    this.#gl.frontFace(this.#gl.CW);

    this.#attributes = {
      A_POSITION: this.#gl.getAttribLocation(this.#program, ATTRIBUTE.A_POSITION),
      A_NORMAL: this.#gl.getAttribLocation(this.#program, ATTRIBUTE.A_NORMAL),
    };

    this.#uniforms = {
      U_WORLD: this.#gl.getUniformLocation(this.#program, UNI.U_WORLD)!,
      U_WORLD_VIEW_PROJECTION: this.#gl.getUniformLocation(this.#program, UNI.U_WORLD_VIEW_PROJECTION)!,
      U_REV_LIGHT_DIRECTION: this.#gl.getUniformLocation(this.#program, UNI.U_REV_LIGHT_DIRECTION)!,
      U_COLOR: this.#gl.getUniformLocation(this.#program, UNI.U_COLOR)!,
    };

    this.#buffers = {
      positions: this.#gl.createBuffer(),
      normals: this.#gl.createBuffer(),
    };
    console.log(this.#buffers, this.#uniforms);

    const resizeCallback = (entries: ResizeObserverEntry[]) => {
      measureElement(entries);
      this.#resizeCanvasToDisplaySize();
      this.#gl.viewport(0, 0, this.#gl.canvas.width, this.#gl.canvas.height);
    };

    const observer = new ResizeObserver(resizeCallback);
    this.#watchResize(observer);
  }

  get viewport() {
    return this.#viewport;
  }

  clear() {
    this.#gl.enable(this.#gl.DEPTH_TEST);
    this.#gl.clearColor(0, 0, 0, 0);
    this.#gl.clear(this.#gl.COLOR_BUFFER_BIT | this.#gl.DEPTH_BUFFER_BIT);
  }

  cube(x: number, y: number, trans: Transform3D): void {
    const vao = this.#gl.createVertexArray();
    this.#gl.bindVertexArray(vao);

    this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, this.#buffers.positions);

    this.#setGeometry("cube");

    this.#gl.enableVertexAttribArray(this.#attributes.A_POSITION);
    this.#gl.vertexAttribPointer(this.#attributes.A_POSITION, 3, this.#gl.FLOAT, false, 0, 0);

    this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, this.#buffers.normals);
    this.#gl.bufferData(this.#gl.ARRAY_BUFFER, new Float32Array(CUBE_MESH.NORMALS), this.#gl.STATIC_DRAW);
    this.#gl.enableVertexAttribArray(this.#attributes.A_NORMAL);
    this.#gl.vertexAttribPointer(this.#attributes.A_NORMAL, 3, this.#gl.FLOAT, false, 0, 0);

    this.#gl.useProgram(this.#program);

    const [
      world, worldViewProjection,
    ] = this.#applyTransforms(x, 500, 0, trans);

    this.#gl.uniformMatrix4fv(this.#uniforms.U_WORLD_VIEW_PROJECTION!, false, worldViewProjection);
    this.#gl.uniformMatrix4fv(this.#uniforms.U_WORLD!, false, world);

    this.#gl.uniform4fv(
      this.#uniforms.U_COLOR!,
      [
        1, 1, 0.2,
        1,
      ],
    );

    const lightDir = vec3.fromValues(100, -100, 200);
    this.#gl.uniform3fv(this.#uniforms.U_REV_LIGHT_DIRECTION!, vec3.normalize(lightDir, lightDir));

    this.#gl.drawArrays(this.#gl.TRIANGLES, 0, 36);
  }

  #applyTransforms(x: number, y: number, z: number, trans: Transform3D) {
    const depth = 1000;

    const projection = mat4.ortho(mat4.create(), 0, this.#canvas.clientWidth, this.#canvas.clientHeight, 0, -depth, depth);

    const camera = mat4.create();
    mat4.rotateX(camera, camera, (20 * Math.PI) / 180);
    mat4.translate(camera, camera, vec3.fromValues(0, -600, 0));

    const view = mat4.invert(mat4.create(), camera)!;
    const viewProjection = mat4.multiply(mat4.create(), projection, view);

    // World
    const world = mat4.create();

    // world transforms
    mat4.translate(world, world, vec3.fromValues(x, 0, z));
    mat4.rotateX(world, world, (trans.rotateX * Math.PI) / 180);
    mat4.rotateY(world, world, (trans.rotateY * Math.PI) / 180);
    mat4.rotateZ(world, world, (trans.rotateZ * Math.PI) / 180);
    mat4.scale(world, world, [
      trans.scaleX, trans.scaleY, trans.scaleZ,
    ]);

    const worldViewProjection = mat4.multiply(mat4.create(), viewProjection, world);

    const worldInverse = mat4.invert(mat4.create(), world)!;
    const worldInverseTranspose = mat4.transpose(mat4.create(), worldInverse);

    return [
      worldInverseTranspose, worldViewProjection,
    ];
  }

  #setGeometry(mesh: "cube" | "rectangle") {
    switch (mesh) {
      case "cube":
        this.#gl.bufferData(this.#gl.ARRAY_BUFFER, new Float32Array(CUBE_MESH.VERTICES), this.#gl.STATIC_DRAW);
    }
  }

  #bootstrap(element: HTMLElement) {
    const canvas = document.createElement("canvas");

    canvas.id = "game-view";

    element.appendChild(canvas);

    return { canvas };
  }

  #createShader(type: number, source: string) {
    const shader = this.#gl.createShader(type)!;
    this.#gl.shaderSource(shader, source);
    this.#gl.compileShader(shader);

    const success = this.#gl.getShaderParameter(shader, this.#gl.COMPILE_STATUS);

    if (!success) {
      this.#gl.deleteShader(shader);
      console.log(this.#gl.getShaderInfoLog(shader));
    }

    return shader;
  }

  #createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    const program = this.#gl.createProgram();
    this.#gl.attachShader(program, vertexShader);
    this.#gl.attachShader(program, fragmentShader);
    this.#gl.linkProgram(program);

    const success = this.#gl.getProgramParameter(program, this.#gl.LINK_STATUS);

    if (!success) {
      this.#gl.deleteProgram(program);
      console.log(this.#gl.getProgramInfoLog(program));
    }

    return program;
  }

  #watchResize(observer: ResizeObserver) {
    try {
      // only call us of the number of device pixels changed
      observer.observe(this.#canvas, { box: "device-pixel-content-box" });
    } catch (ex) {
      // device-pixel-content-box is not supported so fallback to this
      observer.observe(this.#canvas, { box: "content-box" });
    }
  }

  #resizeCanvasToDisplaySize() {
    // Get the size the browser is displaying the canvas in device pixels.
    const [
      displayWidth, displayHeight,
    ] = canvasToDisplaySizeMap.get(this.#canvas)!;

    // Check if the canvas is not the same size.
    const needResize = this.#canvas.width !== displayWidth || this.#canvas.height !== displayHeight;

    if (needResize) {
      // Make the canvas the same size
      this.#canvas.width = displayWidth;
      this.#canvas.height = displayHeight;
    }

    return needResize;
  }
}
