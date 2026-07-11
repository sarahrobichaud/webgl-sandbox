import { GameComponent } from "../../engine/components/components";
import type { World, WorldStorage } from "../world";

export class MovementSystem extends GameComponent<WorldStorage> {
  constructor(world: World) {
    super(world);
  }

  update(deltaTime: number) {
    for (const [entity, movables] of this.world.movables) {
      const position = this.world.positions.get(entity);

      if (position) {
        position.x += movables.velocities.x;
        position.y += movables.velocities.y;
      }
    }
  }
}
