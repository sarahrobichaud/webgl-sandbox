import type { Renderer } from "../../engine/graphics/2d-canvas-renderer";
import type { World, WorldStorage } from "../world";
import { GameComponent } from "../../engine/components/components";

export class RenderingSystem extends GameComponent<WorldStorage> {
  constructor(world: World) {
    super(world);
  }

  draw(renderer: Renderer) {
    for (const [entity, drawable] of this.world.drawables) {
      const position = this.world.positions.get(entity);

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
