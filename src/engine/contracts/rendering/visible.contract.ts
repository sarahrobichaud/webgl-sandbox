export type VisibleType = "3D" | "2D";

export interface Visible {
  hidden: boolean;
  type: VisibleType;
  assetKey: string;
}
