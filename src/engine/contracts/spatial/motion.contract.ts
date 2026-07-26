import type { AxisData } from "./dimensions.contract";

export interface AngularVelocity extends AxisData {}
export interface Velocity extends AxisData {}

export interface MotionData {
  velocity: Velocity;
  angularVelocity?: AngularVelocity;
}
