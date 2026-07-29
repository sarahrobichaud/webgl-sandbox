import type { AssetCatalog } from "../../engine/contracts/assets/assets.contract";
import { MESHES } from "./geometry/mesh";

export const ASSET_CATALOG = {
  cube: {
    type: "mesh",
    data: MESHES.cube,
  },
  plane: {
    type: "mesh",
    data: MESHES.plane,
  },
} satisfies AssetCatalog;

export type CatalogKey = keyof typeof ASSET_CATALOG;
