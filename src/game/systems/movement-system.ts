import { GameComponent } from "../../engine/components/components";
import type { World, WorldStorage } from "../world";

export class MovementSystem extends GameComponent<WorldStorage> {
  #scale = 100;

  constructor(world: World) {
    super(world);
  }

  update() {
    for (const [
      entity, movables,
    ] of this.world.movables) {
      const pos = this.world.positions.get(entity);
      const trans = this.world.transforms2D.get(entity);
      const trans3d = this.world.transform3D.get(entity);
      if (pos) {
        // pos.x += movables.velocities[0];
        // pos.y += movables.velocities[1];
        // pos.z += movables.velocities[2];
      }

      if (trans3d) {
        // trans3d.rotateY += 0.2;
        // trans3d.rotateZ += 0.2;
        trans3d.rotateX += 1;
        trans3d.scaleX = 50;
        trans3d.scaleZ = 50;
        trans3d.scaleY = 50;
      }

      if (trans) {
        trans.rotateX += 1;
      }
    }
  }
}
