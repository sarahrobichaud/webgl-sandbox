import { GameComponent } from "../../engine/components/components";
import type { World, WorldStorage } from "../world";

export class MovementSystem extends GameComponent<WorldStorage> {
  constructor(world: World) {
    super(world);
  }

  update(deltaTime: number) {
    for (const [
      entity, movables,
    ] of this.world.movables) {
      const pos = this.world.positions.get(entity);
      const trans = this.world.transforms2D.get(entity);
      if (pos) {
        pos.x += movables.velocities[0];
        pos.y += movables.velocities[1];
      }

      if (trans) {
        trans.rotateX += 1;
      }
    }
  }
}
