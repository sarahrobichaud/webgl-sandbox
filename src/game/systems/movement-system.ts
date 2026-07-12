import { mat4, vec3, vec4 } from "gl-matrix";
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
    }
  }
}
