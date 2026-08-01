import type { InputContextManager } from "../../runtime/input/input-bridge";
import type { SceneId } from "../branded-values";
import type { ActionRegistry } from "../input/actions.contract";
import type { Camera, CameraConfigurationKind } from "../rendering/camera.contract";

export interface Overlay {
  isActive: boolean;
}

/**
 * View
 */

export interface ViewContext<Actions extends string = string> {
  camera: Camera;
  input: InputContextManager<Actions>;
}

export interface View<Actions extends string = string> {
  getCamera(): CameraConfigurationKind;
  onUpdate(context: ViewContext<Actions>): void;
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

export interface Scene<TActions extends ActionRegistry = ActionRegistry> {
  id: SceneId;
  view: View;
  actions: TActions;
}

export interface MountedScene {
  updateView({ camera }: ViewContext): void;
  camera: Camera;
}
