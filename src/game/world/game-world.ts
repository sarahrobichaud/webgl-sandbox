import type { EntityId } from "../../engine/contracts/branded-values";
import { DefaultWorld } from "../../engine/session/world/world";
import { Store } from "../../engine/lib/store";

export class LocalWorld extends DefaultWorld {
  #test = new Store<{ test: number }>();

  override destroy(id: EntityId): void {
    this.#test.remove(id);
    super.destroy(id);
  }
}
