import { type LogicComponent, type LogicContext } from "../../engine/components/components";

export class MovementSystem implements LogicComponent {
  enabled = true;
  update({ world }: LogicContext) {
    for (const [
      entity,
    ] of world.movables) {
      const pos = world.positions.get(entity);
      const trans3d = world.transform3D.get(entity);
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
    }
  }
}
