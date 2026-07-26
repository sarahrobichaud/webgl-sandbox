export type SceneId = number & { readonly __brand: "SceneId" };

export function SceneId(value: number): SceneId {
  return value as SceneId;
}

export type EntityId = number & { readonly __brand: "EntityId" };

export function EntityId(value: number): EntityId {
  return value as EntityId;
}
