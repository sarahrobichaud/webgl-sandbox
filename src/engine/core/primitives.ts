import type { vec3 } from "gl-matrix";

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

interface Tranform {
  isDirty: boolean;
}

export interface Transform2D extends Tranform {
  x: number;
  y: number;
  rotateX: number;
  rotateY: number;
}

export function transform2D(x: number = 0, y: number = 0, rotateX: number = 0, rotateY: number = 0) {
  return {
    x,
    y,
    rotateX,
    rotateY,
  };
}

export interface Transform3D extends Transform2D {
  z: number;
  rotateZ: number;
}
export function transform3D(x: number = 0, y: number = 0, z: number = 0, rotateX: number = 0, rotateY: number = 0, rotateZ: number = 0) {
  return {
    x,
    y,
    z,
    rotateX,
    rotateY,
    rotateZ,
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
