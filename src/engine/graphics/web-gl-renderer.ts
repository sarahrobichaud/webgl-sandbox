import type { Renderer2D as Renderer3D, Viewport } from "./types";
import { CUBE_VERTICES, RECT_VERTICES } from "./shapes/vertices";
import { FRAGMENT_SHADER_SOURCE, VERTEX_SHADER_SOURCE } from "./shaders/shaders";
import { canvasToDisplaySizeMap, onResize } from "./canvas/canvas-utils";

function randomColor() {
  return [
    Math.random(), Math.random(), Math.random(),
  ];
}

function getColorData(vertices: number[]) {
  const len = vertices.length / 3;

  const colors = [];
  for (let i = 0; i < len; i++) {
    colors.push(...randomColor());
  }

  return colors;
}

export const ATTRIBUTE = {
  A_POSITION: "a_position",
};

export class WebGlRenderer implements Renderer3D {
  #viewport: Viewport = { size: { height: 0, width: 0 } };
  #ctx: WebGL2RenderingContext;
  #canvas: HTMLCanvasElement;

  #program: WebGLProgram;

  #attributes: Record<keyof typeof ATTRIBUTE, number>;
  #buffers: Record<string, WebGLBuffer>;

  #sizeObserver: ResizeObserver;

  clear(): void {}

  constructor(parentElement: HTMLElement) {
    const { canvas } = this.#bootstrap(parentElement);

    const gl = canvas.getContext("webgl2")!;

    this.#ctx = gl;

    this.#canvas = canvas;

    const vertexShader = this.#createShader(this.#ctx.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
    const fragmentShader = this.#createShader(this.#ctx.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);

    this.#program = this.#createProgram(vertexShader, fragmentShader);

    this.#attributes = {
      A_POSITION: this.#ctx.getAttribLocation(this.#program, ATTRIBUTE.A_POSITION),
    };

    this.#buffers = {
      positions: this.#ctx.createBuffer(),
    };

    const resizeCallback = (entries: ResizeObserverEntry[]) => {
      onResize(entries);
      this.#resizeCanvasToDisplaySize();
    };

    this.#sizeObserver = new ResizeObserver(resizeCallback);
    this.#handleResize();
  }

  get viewport() {
    return this.#viewport;
  }

  rectangle3D() {
    this.#ctx.bindBuffer(this.#ctx.ARRAY_BUFFER, this.#buffers.positions);
    this.#ctx.bufferData(this.#ctx.ARRAY_BUFFER, new Float32Array(CUBE_VERTICES), this.#ctx.STATIC_DRAW);

    const vao = this.#ctx.createVertexArray();
    this.#ctx.bindVertexArray(vao);

    this.#ctx.enableVertexAttribArray(this.#attributes.A_POSITION);

    const size = 3;
    const type = this.#ctx.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;

    this.#ctx.vertexAttribPointer(this.#attributes.A_POSITION, size, type, normalize, stride, offset);
  }

  rectangle() {}

  #bootstrap(element: HTMLElement) {
    const canvas = document.createElement("canvas");

    canvas.id = "game-view";

    element.appendChild(canvas);

    return { canvas };
  }

  #createShader(type: number, source: string) {
    const shader = this.#ctx.createShader(type)!;
    this.#ctx.shaderSource(shader, source);
    this.#ctx.compileShader(shader);

    const success = this.#ctx.getShaderParameter(shader, this.#ctx.COMPILE_STATUS);

    if (!success) {
      this.#ctx.deleteShader(shader);
      console.log(this.#ctx.getShaderInfoLog(shader));
    }

    return shader;
  }

  #createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    const program = this.#ctx.createProgram();
    this.#ctx.attachShader(program, vertexShader);
    this.#ctx.attachShader(program, fragmentShader);
    this.#ctx.linkProgram(program);

    const success = this.#ctx.getProgramParameter(program, this.#ctx.LINK_STATUS);

    if (!success) {
      this.#ctx.deleteProgram(program);
      console.log(this.#ctx.getProgramInfoLog(program));
    }

    return program;
  }

  #handleResize() {
    try {
      // only call us of the number of device pixels changed
      this.#sizeObserver.observe(this.#canvas, { box: "device-pixel-content-box" });
    } catch (ex) {
      // device-pixel-content-box is not supported so fallback to this
      this.#sizeObserver.observe(this.#canvas, { box: "content-box" });
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
