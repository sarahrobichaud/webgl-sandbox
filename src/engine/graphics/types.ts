import type { Transform3D } from "../core/primitives";

export type RendererKind = "canvas-2d" | "web-gl";

export interface Viewport {
  size: { height: number; width: number };
}

export interface Renderer2D {
  viewport: Viewport;
  clear(): void;
}

export interface Renderer3D extends Renderer2D {
  cube(x: number, y: number, trans: Transform3D): void;
}

export type Renderer = Renderer2D | Renderer3D;
