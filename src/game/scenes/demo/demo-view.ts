import type { CameraConfigurationKind } from "../../../engine/contracts/rendering/camera.contract";
import type { View, ViewContext } from "../../../engine/contracts/scene/scene.contract";
import { BasicCamera } from "../../../engine/runtime/rendering/camera/basic-camera";

export class DemoView implements View {
  #pos = { x: 0, y: 0, z: 0 };
  #rotation = { x: -50, y: 30, z: 50 };

  getCamera(): CameraConfigurationKind {
    return BasicCamera.config({
      perspective: "ortho",
      initialPlacement: {
        position: this.#pos,
        rotation: this.#rotation,
      },
    });
  }

  onUpdate({ camera, input }: ViewContext): void {
    // this.#pos.y += 0.005;
    // this.#rotation.y -= 0.05;

    camera.setPosition(this.#pos);
    camera.setRotation(this.#rotation);
  }
}
