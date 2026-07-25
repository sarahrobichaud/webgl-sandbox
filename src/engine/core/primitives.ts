import type { vec3 } from "gl-matrix";

export interface Definition {
  isHidden: boolean;
  tags: string[];
}

export interface Position {
  x: number;
  y: number;
  z: number;
}

export function position(x: number = 0, y: number = 0, z: number = 0) {
  return {
    x,
    y,
    z,
  };
}

export interface Rotation {
  rotateX: number;
  rotateY: number;
  rotateZ: number;
}

export interface Scale {
  scaleX: number;
  scaleY: number;
  scaleZ: number;
}

export interface Transform3D extends Position, Rotation, Scale {}

export function transform3D(x: number = 0, y: number = 0, z: number = 0, rotateX: number = 0, rotateY: number = 0, rotateZ: number = 0, scaleX = 0, scaleY = 0, scaleZ = 0) {
  return {
    x,
    y,
    z,
    rotateX,
    rotateY,
    rotateZ,
    scaleX,
    scaleY,
    scaleZ,
  };
}

export interface Movable {
  velocities: vec3;
}

export interface Drawable {
  color: string;
  h: number;
  w: number;
}
