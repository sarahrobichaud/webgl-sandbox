import type { GameWorld } from "../core/game-manager";
import type { Renderer } from "../graphics/2d-canvas-renderer";

export class RenderingSystem {
  #world: GameWorld;

  constructor(world: GameWorld) {
    this.#world = world;
  }

  draw(renderer: Renderer) {
    for (const [entity, drawable] of this.#world.drawables) {
      const position = this.#world.positions.get(entity);

      if (position) {
        renderer.rectangle(
          position.x,
          position.y,
          drawable.w,
          drawable.h,
          drawable.color,
        );
      }
    }
  }
}
