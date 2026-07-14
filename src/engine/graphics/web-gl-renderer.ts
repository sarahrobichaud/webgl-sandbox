import type { Renderer2D as Renderer3D, Viewport } from "./types";
import { CUBE_VERTICES, RECT_VERTICES } from "./shapes/vertices";
import { FRAGMENT_SHADER_SOURCE, VERTEX_SHADER_SOURCE } from "./shaders/shaders";
import { canvasToDisplaySizeMap, measureElement } from "./canvas/canvas-utils";

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

export const UNI = {
  U_TRANSLATION: "u_translation",
  U_RESOLUTION: "u_resolution",
  U_ROTATION: "u_rotation",
};

export class WebGlRenderer implements Renderer3D {
  #viewport: Viewport = { size: { height: 0, width: 0 } };
  #gl: WebGL2RenderingContext;
  #canvas: HTMLCanvasElement;

  #program: WebGLProgram;

  #attributes: Record<keyof typeof ATTRIBUTE, number>;
  #uniforms: Record<keyof typeof UNI, WebGLUniformLocation>;
  #buffers: Record<string, WebGLBuffer>;

  #vShader: WebGLShader;
  #fShader: WebGLShader;

  constructor(parentElement: HTMLElement) {
    const { canvas } = this.#bootstrap(parentElement);

    this.#gl = canvas.getContext("webgl2")!;
    this.#canvas = canvas;

    this.#vShader = this.#createShader(this.#gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
    this.#fShader = this.#createShader(this.#gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);

    this.#program = this.#createProgram(this.#vShader, this.#fShader);

    this.#attributes = {
      A_POSITION: this.#gl.getAttribLocation(this.#program, ATTRIBUTE.A_POSITION),
    };

    this.#uniforms = {
      U_TRANSLATION: this.#gl.getUniformLocation(this.#program, UNI.U_TRANSLATION)!,
      U_RESOLUTION: this.#gl.getUniformLocation(this.#program, UNI.U_RESOLUTION)!,
      U_ROTATION: this.#gl.getUniformLocation(this.#program, UNI.U_ROTATION)!,
    };

    this.#buffers = {
      positions: this.#gl.createBuffer(),
    };

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
    this.#gl.clearColor(0, 0, 0, 0);
    this.#gl.clear(this.#gl.COLOR_BUFFER_BIT);
  }

  rectangle3D(x: number, y: number, rotation: number) {
    this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, this.#buffers.positions);
    this.#gl.bufferData(this.#gl.ARRAY_BUFFER, new Float32Array(RECT_VERTICES), this.#gl.STATIC_DRAW);

    const vao = this.#gl.createVertexArray();
    this.#gl.bindVertexArray(vao);

    this.#gl.enableVertexAttribArray(this.#attributes.A_POSITION);

    const size = 2;
    const type = this.#gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;

    this.#gl.vertexAttribPointer(this.#attributes.A_POSITION, size, type, normalize, stride, offset);

    this.#gl.useProgram(this.#program);

    this.#gl.uniform2f(this.#uniforms.U_RESOLUTION, this.#gl.canvas.width, this.#gl.canvas.height);
    this.#gl.uniform2fv(
      this.#uniforms.U_TRANSLATION,
      [
        500, 400,
      ],
    );

    const angle = (rotation * Math.PI) / 180;
    this.#gl.uniform2fv(this.#uniforms.U_ROTATION, [
      Math.sin(angle), Math.cos(angle),
    ]);

    this.#gl.drawArrays(this.#gl.TRIANGLES, 0, 6);
  }

  rectangle() {}

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
