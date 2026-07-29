import type { GpuHandle } from "../../../contracts/internal";

export interface GpuAssetCache {
  get(key: string): GpuHandle;
  set(key: string, value: GpuHandle): void;
}

export class AssetCache implements GpuAssetCache {
  #entries: Map<string, GpuHandle> = new Map();
  get(key: string) {
    const hit = this.#entries.get(key);
    if (!hit) {
      throw new Error("No asset cached");
    }

    return hit;
  }

  set(key: string, value: GpuHandle) {
    this.#entries.set(key, value);
  }
}
