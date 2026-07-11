import type { Vector2 } from "./vector";

export interface Position {
  x: number;
  y: number;
}

export interface Transform {
  tX: number;
  tY: number;
  tRotation: number;
  tScale: number;
}

export interface Movable {
  velocities: Vector2;
}

export interface Drawable {
  color: string;
  h: number;
  w: number;
}
