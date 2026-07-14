import type { World, WorldStorage } from "../world";
import { GameComponent } from "../../engine/components/components";
import type { Renderer3D } from "../../engine/graphics/types";

export class RenderingSystem extends GameComponent<WorldStorage> {
  constructor(world: World) {
    super(world);
  }

  draw(renderer: Renderer3D) {
    for (const [
      entity,
    ] of this.world.drawables) {
      const position = this.world.positions.get(entity);
      const trans = this.world.transforms2D.get(entity);

      if (position && trans) {
        renderer.rectangle3D(position.x, position.y, trans.rotateX);
      }
    }
  }
}
