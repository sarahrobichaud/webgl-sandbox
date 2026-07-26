import type { MeshId } from "../../../graphics/shapes/mesh";
import type { Mesh } from "../../../graphics/webgl/webgl-lib/areo-types";
import type { Position, Transform3D } from "../../primitives";
import type { EntityId } from "../../types";

export interface SceneDefinition {
  actions: string;
  storage: string;
}

export interface SceneManager {
  registerScene(scene: SceneHandle): void;
  setActive(id: string): void;
}

export interface SceneHandle {
  id: string;
  onEnter(): void;
  onExit(): void;
}

export class Scene<S extends SceneDefinition> implements SceneHandle {
  #id: string;
  #storage: SceneStorage;

  constructor(id: string) {
    this.#id = id;
  }

  get id() {
    return this.#id;
  }

  onEnter(): void {
    throw new Error("Method not implemented.");
  }
  onExit(): void {
    throw new Error("Method not implemented.");
  }
}

export class SceneStorage {
  #meshes: Map<MeshId, Mesh> = new Map();
  #positions: Map<EntityId, Position> = new Map();
  #transforms: Map<EntityId, Transform3D> = new Map();

  constructor() {}

  get positions() {
    return this.#positions;
  }

  get transforms() {
    return this.#transforms;
  }
}
