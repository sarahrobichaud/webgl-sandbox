import type { mat4 } from "gl-matrix";
import type { BasicCameraOptions } from "../../runtime/rendering/camera/basic-camera";
import type { Position, Rotation } from "../spatial/spatial.contract";

export type PerspectiveKind = "ortho" | "perspective";
export type CameraKind = "basic";

export interface CameraPlacement {
  position: Position;
  rotation: Rotation;
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
