import type { EntityId } from "../branded-values";
import type { MotionData } from "../spatial/motion.contract";
import type { Position, SpacialData } from "../spatial/spatial.contract";
import type { ComponentStorage } from "./store.contract";

interface BaseStorage {
  positions: ComponentStorage<Position>;
  transforms: ComponentStorage<SpacialData>;
  motions: ComponentStorage<MotionData>;
}

export interface World extends BaseStorage {
  spawn(): EntityId;
  destroy(id: EntityId): void;
}
