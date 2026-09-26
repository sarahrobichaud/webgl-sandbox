import type { EntityId } from "../../engine/contracts/branded-values";
import { DefaultWorld } from "../../engine/session/world/world";

export class LocalWorld extends DefaultWorld {
  constructor() {
    super();

    this.#spawnCube(1, 1);
    this.#spawnCube(0, 0);
    this.#spawnCube(-1, -4);
  }

  #spawnCube(x: number, z: number) {
    const id = this.spawn();
    this.visibles.set(id, { hidden: false, assetKey: "cube", type: "3D" });
    this.positions.set(id, { x: x, y: 0, z: z });
    this.motions.set(id, { angularVelocity: { x: 0, y: 1, z: 0 }, velocity: { x: 0, y: 0, z: 0 } });
    this.transforms.set(id, { rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, position: { x: 0, y: 0, z: 0 } });
  }

  override destroy(id: EntityId): void {
    super.destroy(id);
  }
}
