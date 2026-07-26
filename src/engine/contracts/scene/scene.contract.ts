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
  setupCamera(): CameraConfigurationKind;
  onUpdate(context: ViewContext): void;
}

/**
 * Controller
 */

export interface ControllerContext {}

export interface SceneController {
  update(context: ControllerContext): void;
}

/**
 * Scene
 */

export interface Scene {
  id: SceneId;
  overlays: Map<string, Overlay>;
  views: Map<string, View>;
  controllers: Map<string, SceneController>;
  onLoad(): void;
}
