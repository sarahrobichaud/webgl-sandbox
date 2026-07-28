import type { Camera, CameraConfigurationKind } from "../../contracts/rendering/camera.contract";
import type { View } from "../../contracts/scene/scene.contract";
import { BasicCamera } from "../rendering/camera/basic-camera";

function createCamera(config: CameraConfigurationKind, canvas: HTMLCanvasElement): Camera {
  switch (config.type) {
    case "basic":
      return new BasicCamera({
        canvas,
        perspective: config.perspective ?? "ortho",
        position: config.initialPlacement!.position!,
        rotation: config.initialPlacement!.rotation!,
      });
    default:
      throw new Error(`Unknown camera type: ${config.type}`);
  }
}

export class ViewManager {
  #camera: Camera | null = null;
  #canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.#canvas = canvas;
  }

  get camera() {
    if (!this.#camera) {
      throw new Error("No view loaded");
    }

    return this.#camera;
  }

  loadFromScene(view: View) {
    this.#camera = createCamera(view.getCamera(), this.#canvas);
  }
}
