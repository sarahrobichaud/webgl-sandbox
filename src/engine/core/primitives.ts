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

interface Tranform {}

export interface Transform2D extends Tranform {
  x: number;
  y: number;
  rotateX: number;
  rotateY: number;
  scaleX: number;
  scaleY: number;
}

export function transform2D(x: number = 0, y: number = 0, rotateX: number = 0, rotateY: number = 0, scaleX = 0, scaleY = 0) {
  return {
    x,
    y,
    rotateX,
    rotateY,
    scaleX,
    scaleY,
  };
}

export interface Transform3D extends Transform2D {
  z: number;
  rotateZ: number;
  scaleZ: number;
}
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
