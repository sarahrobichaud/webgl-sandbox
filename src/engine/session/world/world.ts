import { EntityId } from "../../contracts/branded-values";
import type { World } from "../../contracts/data/world.contract";
import type { Visible } from "../../contracts/rendering/visible.contract";
import type { MotionData } from "../../contracts/spatial/motion.contract";
import type { Position, SpacialData } from "../../contracts/spatial/spatial.contract";
import { Store } from "../../lib/store";

export class DefaultWorld implements World {
  #positions = new Store<Position>();
  #transforms = new Store<SpacialData>();
  #motions = new Store<MotionData>();
  #visibles = new Store<Visible>();

  #nextId = 1;

  get positions() {
    return this.#positions;
  }

  get visibles() {
    return this.#visibles;
  }

  get transforms() {
    return this.#transforms;
  }

  get motions() {
    return this.#motions;
  }

  spawn(): EntityId {
    return EntityId(this.#nextId++);
  }

  destroy(id: EntityId): void {
    this.#positions.remove(id);
    this.#transforms.remove(id);
    this.#motions.remove(id);
    this.#visibles.remove(id);
  }
}
