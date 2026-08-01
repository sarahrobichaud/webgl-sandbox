import type { AssetCatalog, AssetDescription } from "../../contracts/assets/assets.contract";

export interface AssetRegistry {
  getPending(): AssetEntry[];
  markAvailable(key: string): void;
}

export type AssetGroup = "global";
export type AssetStatus = "loaded" | "pending";

export interface AssetEntry {
  key: string;
  group: AssetGroup;
  status: AssetStatus;
  description: AssetDescription;
}

/**
 * A super basic asset manager
 */
export class AssetStore implements AssetRegistry {
  #geometry: Map<string, AssetEntry> = new Map();

  markAvailable(key: string): void {
    const original = this.#geometry.get(key);

    if (!original) {
      return;
    }

    const update = {
      ...original,
      status: "loaded",
    } satisfies AssetEntry;

    this.#geometry.set(key, update);
  }

  getPending(): AssetEntry[] {
    const pending = [];

    for (const [
      _key, value,
    ] of this.#geometry) {
      if (value.status === "pending") {
        pending.push(value);
      }
    }

    return pending;
  }

  load(catalog: AssetCatalog) {
    for (const [
      key, description,
    ] of Object.entries(catalog)) {
      if (description.type === "mesh") {
        this.#geometry.set(key, { status: "pending", group: "global", description, key });
      }
    }
  }
}
