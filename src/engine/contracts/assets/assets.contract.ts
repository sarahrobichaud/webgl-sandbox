export type AssetType = "mesh";

export interface MeshDescription {
  vertices: number[];
  normals: number[];
  origin?: [
    number, number, number,
  ];
}

export interface MeshAssetDescription {
  type: "mesh";
  data: MeshDescription;
}

export type AssetDescription = MeshAssetDescription;

export type AssetCatalog = Record<string, AssetDescription>;

export interface GpuAssetCache {}
