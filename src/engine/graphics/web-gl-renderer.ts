import type { Renderer2D as Renderer3D, Viewport } from "./types";
import { CUBE_VERTICES, RECT_VERTICES } from "./shapes/vertices";

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

export class WebGlRenderer implements Renderer3D {
  #viewport: Viewport = { size: { height: 0, width: 0 } };
  #context: WebGL2RenderingContext;
  #canvas: HTMLCanvasElement;

  #rectColor = getColorData(RECT_VERTICES);
  #cubeColor = getColorData(CUBE_VERTICES);

  constructor(parentElement: HTMLElement) {
    const { canvas } = this.#bootstrap(parentElement);

    const gl = canvas.getContext("webgl2")!;

    this.#context = gl;

    this.#canvas = canvas;

    this.#handleResize();
  }

  get viewport() {
    return this.#viewport;
  }

  clear() {}

  flush() {}

  rectangle3D() {}

  rectangle() {}

  #bootstrap(element: HTMLElement) {
    const canvas = document.createElement("canvas");

    canvas.id = "game-view";

    this.#setCanvasSize(canvas);
    element.appendChild(canvas);

    return { canvas };
  }

  #handleResize() {
    window.addEventListener("resize", this.#setCanvasSize.bind(this, this.#canvas));
  }

  #setCanvasSize(canvas: HTMLCanvasElement) {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    this.#viewport.size.height = window.innerHeight;
    this.#viewport.size.width = window.innerWidth;
  }
}
