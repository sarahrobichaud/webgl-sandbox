import type { AxisData } from "./dimensions.contract";

export interface Position extends AxisData {}
export interface Rotation extends AxisData {}
export interface Scale extends AxisData {}

export interface SpacialData {
  position: Position;
  rotation: Rotation;
  scale: Scale;
}
