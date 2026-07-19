import type { MeshId } from "../../engine/graphics/shapes/mesh";
import { GameComponent } from "../../engine/components/components";
import type { World, WorldStorage } from "../world";

const MESH_CYCLE: MeshId[] = [
  "cube", "pyramid",
];

/**
 * Periodically swaps entity meshIds between registered meshes.
 */
export class MeshSwitchSystem extends GameComponent<WorldStorage> {
  #elapsed = 0;
  #intervalMs = 1500;
  #index = 0;

  constructor(world: World) {
    super(world);
  }

  update(deltaTime: number) {
    this.#elapsed += deltaTime;

    if (this.#elapsed < this.#intervalMs) {
      return;
    }

    this.#elapsed = 0;
    this.#index = (this.#index + 1) % MESH_CYCLE.length;
    const nextId = MESH_CYCLE[this.#index]!;

    for (const entity of this.world.meshIds.keys()) {
      this.world.meshIds.set(entity, nextId);
    }
  }
}
