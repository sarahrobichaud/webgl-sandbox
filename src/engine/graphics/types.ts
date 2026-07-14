export type RendererKind = "canvas-2d" | "web-gl";

export interface Viewport {
  size: { height: number; width: number };
}

export interface Renderer2D {
  viewport: Viewport;
  rectangle(x: number, y: number, width: number, height: number, color: string): void;
  clear(): void;
}

export interface Renderer3D extends Renderer2D {
  rectangle3D(x: number, y: number, rotation: number): void;
}

export type Renderer = Renderer2D | Renderer3D;
