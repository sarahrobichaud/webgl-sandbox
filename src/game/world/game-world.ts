import type { EntityId } from "../../engine/contracts/branded-values";
import { DefaultWorld } from "../../engine/session/world/world";
import { ASSET_CATALOG, type CatalogKey } from "../assets/catalog";

export class LocalWorld extends DefaultWorld {
  constructor() {
    super();
    const id = this.spawn();

    this.visibles.set(id, {
      isVisible: true,
      assetKey: ASSET_CATALOG.cube,
    });
  }

  override destroy(id: EntityId): void {
    super.destroy(id);
  }
}
