import type { View, ViewContext } from "../../../engine/contracts/scene/scene.contract";
import { BasicCamera } from "../../../engine/runtime/rendering/camera/basic-camera";
import type { DemoActions } from "./demo.scene";

type Actions = keyof typeof DemoActions;

export class DemoView implements View {
  #pos = { x: 0, y: 0, z: 0 };
  #rotation = { x: -80, y: 10, z: 10 };
  #zoom = 1;

  onUpdate({ camera }: ViewContext) {
    this.#zoom *= 1.0001;

    camera.setZoom(this.#zoom);
  }

  getCamera() {
    return BasicCamera.config({
      perspective: "ortho",
      initialPlacement: {
        position: this.#pos,
        rotation: this.#rotation,
      },
    });
  }
}
