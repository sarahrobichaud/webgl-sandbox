import type { EntityId } from "../../../contracts/branded-values";
import type { World } from "../../../contracts/data/world.contract";
import type { MotionData } from "../../../contracts/spatial/motion.contract";
import type { Position, SpacialData } from "../../../contracts/spatial/spatial.contract";
import { Store } from "../../../lib/store";

export class DefaultWorld implements World {
  #positions = new Store<Position>();
  #transforms = new Store<SpacialData>();
  #motions = new Store<MotionData>();

  get positions() {
    return this.#positions;
  }

  get transforms() {
    return this.#transforms;
  }

  get motions() {
    return this.#motions;
  }

  spawn(): EntityId {
    throw new Error("Method not implemented.");
  }

  destroy(id: EntityId): void {
    this.#positions.remove(id);
    this.#transforms.remove(id);
    this.#motions.remove(id);
  }
}
