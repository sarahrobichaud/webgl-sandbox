import type { Camera, CameraConfigurationKind } from "../../contracts/rendering/camera.contract";
import type { View } from "../../contracts/scene/scene.contract";
import { BasicCamera } from "../rendering/camera/basic-camera";
import type { Scene } from "./overlay";

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
  #views: Map<string, View> = new Map();
  #cameras: Map<string, Camera> = new Map();
  #activeView: string | null = null;

  #canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.#canvas = canvas;
  }

  loadFromScene(views: Map<string, View>) {
    this.#views = views;
    this.#buildCameras(views);
  }

  getActiveCamera() {
    if (!this.#activeView) {
      return null;
    }
    const camera = this.#cameras.get(this.#activeView);

    return camera ?? null;
  }

  #buildCameras(views: Map<string, View>) {
    this.#cameras = new Map();
    for (const [
      key, view,
    ] of views) {
      this.#cameras.set(key, createCamera(view.setupCamera(), this.#canvas));
      this.#activeView = key;
    }
  }
}
