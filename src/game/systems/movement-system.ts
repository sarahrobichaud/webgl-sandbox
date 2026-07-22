import { GameComponent } from "../../engine/components/components";
import type { World, WorldStorage } from "../world";

export class MovementSystem extends GameComponent<WorldStorage> {
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
        trans3d.rotateY += 0.2;
        // trans3d.rotateZ += 0.2;
        // trans3d.rotateX += 1;
        // Don't override scale here — unit meshes use whatever scale the entity was spawned with
        // (1 = one tile; ~100 if you're still matching pixel-sized ortho).
      }

      if (trans) {
        trans.rotateX += 1;
      }
    }
  }
}
