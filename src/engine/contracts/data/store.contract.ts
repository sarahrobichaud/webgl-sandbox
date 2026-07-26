import type { EntityId } from "../branded-values";

export interface ComponentStorage<T> {
  size: number;
  has(id: EntityId): boolean;
  get(id: EntityId): T | undefined;

  set(id: EntityId, value: T): void;
  remove(id: EntityId): void;
  entries(): IterableIterator<
    [
      EntityId, T,
    ]
  >;
}
