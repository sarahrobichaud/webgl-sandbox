import type { CameraConfigurationKind } from "../../../engine/contracts/rendering/camera.contract";
import type { View, ViewContext } from "../../../engine/contracts/scene/scene.contract";
import type { Position } from "../../../engine/contracts/spatial/spatial.contract";
import { BasicCamera } from "../../../engine/runtime/rendering/camera/basic-camera";

export class DemoView implements View {
  #pos: Position = {
    x: 0,
    y: 0,
    z: 0,
  };

  setupCamera(): CameraConfigurationKind {
    return BasicCamera.config({
      perspective: "ortho",
      initialPlacement: {
        position: { x: 200, y: 0, z: 0 },
      },
    });
  }

  onUpdate({ camera, input }: ViewContext): void {
    if (input.isActive("ZOOM_IN")) {
    }
    this.#pos.x += 1;

    camera.setPosition(this.#pos);
  }
}
