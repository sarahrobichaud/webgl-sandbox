import type { mat4 } from "gl-matrix";
import type { Position, Rotation } from "../core/primitives";
import type { BasicCameraOptions } from "../camera/basic-camera";

export type PerspectiveKind = "ortho" | "perspective";
export type CameraKind = "basic";

export interface CameraPlacement {
  position: Position;
  rotation: Rotation;
}

export interface CameraRuntime {
  canvas: HTMLCanvasElement;
}

export interface CameraConfiguration {
  type: CameraKind;
  initialPlacement?: Partial<CameraPlacement>;
}

export type CameraConfigurationKind = BasicCameraOptions;

export interface Camera {
  readonly position: Position;
  readonly perspective: PerspectiveKind;

  setZoom(amount: number): void;
  setPosition(position: Position): void;
  setRotation(rotation: Rotation): void;

  getViewPerspective(): mat4;
}
