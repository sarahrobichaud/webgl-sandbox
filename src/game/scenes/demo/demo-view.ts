import type { View, ViewContext } from "../../../engine/contracts/scene/scene.contract";
import { BasicCamera } from "../../../engine/runtime/rendering/camera/basic-camera";
import { type DemoActions } from "./demo.scene";

export type Context = ViewContext<DemoActions>;

export class DemoView implements View<DemoActions> {
  #pos = { x: 0, y: 0, z: 0 };
  #rotation = { x: -80, y: 5, z: -5 };
  #zoom = 1;

  #speed = 0.1;

  onUpdate(ctx: Context) {
    this.#handlePan(ctx);
    this.#handleZoom(ctx);
    this.#handleRotate(ctx);
  }

  #handleZoom({ camera, input }: Context) {
    if (input.isActive("ZOOM_IN") && this.#zoom < 10) {
      this.#zoom *= 1.01;
    }

    if (input.isActive("ZOOM_OUT") && this.#zoom > 0.1) {
      this.#zoom /= 1.01;
    }

    camera.setZoom(this.#zoom);
  }

  #handleRotate({ camera, input }: Context) {
    if (input.isActive("ROTATE_X")) {
      this.#rotation.x += 0.1;
    }
    if (input.isActive("ROTATE_Y")) {
      this.#rotation.y += 0.1;
    }
    if (input.isActive("ROTATE_Z")) {
      this.#rotation.z += 0.1;
    }

    camera.setRotation(this.#rotation);
  }

  #handlePan({ camera, input }: Context) {
    if (input.isActive("PAN_DOWN")) {
      this.#pos.z += this.#speed;
    }

    if (input.isActive("PAN_UP")) {
      this.#pos.z -= this.#speed;
    }
    if (input.isActive("PAN_RIGHT")) {
      this.#pos.x += this.#speed;
    }

    if (input.isActive("PAN_LEFT")) {
      this.#pos.x -= this.#speed;
    }

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
