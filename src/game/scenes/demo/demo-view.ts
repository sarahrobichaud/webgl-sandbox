import type { View, ViewContext } from "../../../engine/contracts/scene/scene.contract";
import { BasicCamera } from "../../../engine/runtime/rendering/camera/basic-camera";

export class DemoView implements View {
  #pos = { x: 0, y: 0, z: 0 };
  #rotation = { x: -85, y: 0, z: 0 };
  #zoom = 1;

  #speed = 0.1;

  onUpdate({ camera, input }: ViewContext) {
    if (input.isActive("PAN_DOWN")) {
      this.#pos.z += this.#speed;
    }

    if (input.isActive("PAN_UP")) {
      this.#pos.z -= this.#speed;
    }
    if (input.isActive("PAN_RIGHT")) {
      this.#pos.x -= this.#speed;
    }
    if (input.isActive("PAN_LEFT")) {
      this.#pos.x += this.#speed;
    }

    if (input.isActive("ZOOM_IN") && this.#zoom < 3) {
      this.#zoom *= 1.01;
    }

    if (input.isActive("ZOOM_OUT") && this.#zoom > 0.5) {
      this.#zoom /= 1.01;
    }

    camera.setZoom(this.#zoom);
    camera.setPosition(this.#pos);
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
