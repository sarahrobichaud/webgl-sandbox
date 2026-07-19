import { GameComponent } from "../../engine/components/components";
import type { World, WorldStorage } from "../world";

export class MovementSystem extends GameComponent<WorldStorage> {
  #last = 0;
  #scale = 100;
  #int = 1000;
  #op = "plus";
  constructor(world: World) {
    super(world);
  }

  update(deltaTime: number) {
    for (const [
      entity, movables,
    ] of this.world.movables) {
      const pos = this.world.positions.get(entity);
      const trans = this.world.transforms2D.get(entity);
      const trans3d = this.world.transform3D.get(entity);
      if (pos) {
        pos.x += movables.velocities[0];
        // pos.y += movables.velocities[1];
      }

      if (this.#scale)
        if (trans3d) {
          trans3d.rotateY += 0.2;
          trans3d.rotateZ += 0.2;
          // if (this.#last > this.#int) {
          //   const random = Math.max(0, Math.min(300, Math.random() * 100));

          //   this.#scale = random;
          //   this.#last = 0;
          // } else {
          //   this.#last += deltaTime;
          // }
          trans3d.scaleX = this.#scale;
          trans3d.scaleZ = this.#scale;
          trans3d.scaleY = this.#scale;

          // trans3d.rotateZ += 0.5;
        }

      if (trans) {
        trans.rotateX += 1;
      }
    }
  }
}
