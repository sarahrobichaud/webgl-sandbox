import type { Position, Transform3D } from "../core/primitives";
import type { Mesh } from "./webgl/webgl-lib/areo-types";

export type RendererKind = "web-gl";

export interface Viewport {
  size: { height: number; width: number };
}

export interface Renderer3D {
  clear(): void;
  render(mesh: Mesh, position: Position, transform: Transform3D): void;
  init(meshes: Mesh[]): void;
  setup(program: "basic"): void;
  renderGrid(): void;
}

export type Renderer = Renderer3D;
