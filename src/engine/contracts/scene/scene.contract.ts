import type { SceneId } from "../branded-values";
import type { ActionRegistry } from "../input/actions.contract";
import type { InputManager } from "../internal";
import type { Camera, CameraConfigurationKind } from "../rendering/camera.contract";

export interface Overlay {
  isActive: boolean;
}

/**
 * View
 */

export interface ViewContext<A extends string = string> {
  camera: Camera;
  input: InputManager<A>;
}

export interface View<A extends string = string> {
  getCamera(): CameraConfigurationKind;
  onUpdate(context: ViewContext<A>): void;
}

/**
 * Controller
 */

export interface ControllerContext {}

export interface SceneController {
  update(context: ControllerContext): void;
}

export interface SceneRenderContext {
  camera: Camera;
}

/**
 * Scene
 */

export interface Scene {
  id: SceneId;
  view: View;
  actions?: ActionRegistry;
}

export interface MountedScene {
  updateView({ camera, input }: ViewContext): void;
  camera: Camera;
}
