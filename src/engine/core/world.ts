import type { Mesh } from "../graphics/webgl/webgl-lib/areo-types";
import type { Definition, Drawable, Movable, Position, Transform2D, Transform3D } from "./primitives";
import type { EntityId } from "./types";

/**
 * A game world, stores all data in the world
 */
export class GameWorld<StorageKey extends string> {
  #components = new Map<StorageKey, Map<EntityId, any>>();

  #nextId = 0;

  #entities = new Set<EntityId>();

  #storage = {
    definitions: new Map<EntityId, Definition>(),
    positions: new Map<EntityId, Position>(),

    meshes: new Map<string, Mesh>(),
    meshIds: new Map<EntityId, string>(),

    transforms2D: new Map<EntityId, Transform2D>(),
    transforms3D: new Map<EntityId, Transform3D>(),

    movables: new Map<EntityId, Movable>(),
    drawables: new Map<EntityId, Drawable>(),
  };

  constructor() {}

  createEntity(tags: string[] = []) {
    const id = this.#nextId++;
    this.#entities.add(id);
    this.#storage.definitions.set(id, {
      isHidden: false,
      tags: tags,
    });
    return id;
  }

  /** Mesh asset catalog (id → mesh). */
  get meshes() {
    return this.#storage.meshes;
  }

  /** Entity → mesh id. */
  get meshIds() {
    return this.#storage.meshIds;
  }

  get definitions() {
    return this.#storage.definitions;
  }

  get positions() {
    return this.#storage.positions;
  }

  get transforms2D() {
    return this.#storage.transforms2D;
  }

  get transform3D() {
    return this.#storage.transforms3D;
  }

  get movables() {
    return this.#storage.movables;
  }

  get drawables() {
    return this.#storage.drawables;
  }

  get primitives() {
    return this.#storage;
  }

  get entities() {
    return this.#entities;
  }

  protected addStorage<T>(name: StorageKey) {
    this.#components.set(name, new Map<EntityId, T>());
  }
  protected getStorage<T>(name: StorageKey) {
    return this.#components.get(name) as Map<EntityId, T>;
  }
}
