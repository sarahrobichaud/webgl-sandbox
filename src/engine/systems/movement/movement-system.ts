import type { GameWorld } from "../../core/game-manager";

export class MovementSystem {
  #world;
  constructor(world: GameWorld) {
    this.#world = world;
  }

  update(dt: number) {
    for (const [entity, movables] of this.#world.movables) {
      const position = this.#world.positions.get(entity);

      if (position) {
        position.x += movables.velocities.x;
        position.y += movables.velocities.y;
      }
    }
  }
}
