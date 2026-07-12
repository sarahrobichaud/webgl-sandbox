import type { Renderer2D, Viewport } from "./types";

export class CanvasRenderer2D implements Renderer2D {
  #viewport: Viewport = { size: { height: 0, width: 0 } };
  #context: CanvasRenderingContext2D;
  #canvas: HTMLCanvasElement;

  constructor(parentElement: HTMLElement) {
    const { canvas } = this.bootstrap(parentElement);

    this.#context = canvas.getContext("2d")!;
    this.#canvas = canvas;

    this.handleResize();
  }

  get viewport() {
    return this.#viewport;
  }

  clear() {
    this.#context.clearRect(0, 0, this.#context.canvas.width, this.#context.canvas.height);
  }

  rectangle(x: number, y: number, width: number, height: number, color: string): void {
    this.setColor(color);
    this.#context.fillRect(x, y, width, height);
  }

  private setColor(color: string) {
    this.#context.fillStyle = color;
  }

  private bootstrap(element: HTMLElement) {
    const canvas = document.createElement("canvas");

    canvas.id = "game-view";

    this.setCanvasSize(canvas);
    element.appendChild(canvas);

    return { canvas };
  }

  private handleResize() {
    window.addEventListener("resize", this.setCanvasSize.bind(this, this.#canvas));
  }

  private setCanvasSize(canvas: HTMLCanvasElement) {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio;
    this.#viewport.size.height = window.innerHeight;
    this.#viewport.size.width = window.innerWidth;
    ctx?.scale(dpr, dpr);
  }
}
