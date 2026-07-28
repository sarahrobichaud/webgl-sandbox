import type { CameraConfigurationKind } from "../../../engine/contracts/rendering/camera.contract";
import type { View, ViewContext } from "../../../engine/contracts/scene/scene.contract";
import { BasicCamera } from "../../../engine/runtime/rendering/camera/basic-camera";

export class DemoView implements View {
  onInit(): void {}

  setupCamera(): CameraConfigurationKind {
    return BasicCamera.config({
      perspective: "ortho",
      initialPlacement: {
        position: { x: 0, y: 10, z: 0 },
        rotation: { x: -50, y: 30, z: 50 },
      },
    });
  }

  onUpdate({ camera, input }: ViewContext): void {}
}
