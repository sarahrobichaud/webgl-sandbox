import type { EntityId } from "../../engine/contracts/branded-values";
import { DefaultWorld } from "../../engine/session/world/world";
import { ASSET_CATALOG } from "../assets/catalog";

export class LocalWorld extends DefaultWorld {
  constructor() {
    super();
  }

  override destroy(id: EntityId): void {
    super.destroy(id);
  }
}
