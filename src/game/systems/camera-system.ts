import { type LogicComponent, type LogicContext } from "../../engine/components/components";
import { KeyboardButton } from "../../engine/contracts/button.contract";
import type { Position, Rotation } from "../../engine/core/primitives";

const position: Position = {
  x: 0,
  y: 0,
  z: 0,
};

const rot: Rotation = {
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
};

let zoom = 1;
const speed = 0.1;

function handleWasd(keyboard: LogicContext["keyboard"]) {
  if (keyboard.isDown(KeyboardButton.KeyW)) {
    position.x += speed;
  }
  if (keyboard.isDown(KeyboardButton.KeyS)) {
    position.x -= speed;
  }
  if (keyboard.isDown(KeyboardButton.KeyA)) {
    position.z += speed;
  }
  if (keyboard.isDown(KeyboardButton.KeyD)) {
    position.z -= speed;
  }
}

export class CameraSystem implements LogicComponent {
  enabled: boolean = true;

  update({ camera, keyboard }: LogicContext): void {
    handleWasd(keyboard);
    if (keyboard.isDown(KeyboardButton.KeyE)) {
      zoom += 0.01;
    }

    if (keyboard.isDown(KeyboardButton.KeyQ)) {
      zoom -= 0.01;
    }

    camera.setPosition(position);
    camera.setZoom(zoom);
  }
}
