import type { SceneId } from "../branded-values";
import type { InputManager, SceneSchema } from "../internal";
import type { Camera, CameraConfigurationKind } from "../rendering/camera.contract";

export interface Overlay {
  isActive: boolean;
}

/**
 * View
 */

export interface ViewContext {
  camera: Camera;
  input: InputManager<string>;
}

export interface View {
  getCamera(): CameraConfigurationKind;
  onUpdate(context: ViewContext): void;
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
}

export interface MountedScene {
  updateView({ camera, input }: ViewContext): void;
  camera: Camera;
}
