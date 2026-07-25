import type { LogicComponent, LogicContext } from "../../engine/components/components";
import type { MeshId } from "../../engine/graphics/shapes/mesh";

const MESH_CYCLE: MeshId[] = [
  "cube", "pyramid",
];

/**
 * Periodically swaps entity meshIds between registered meshes.
 */
export class MeshSwitchSystem implements LogicComponent {
  #elapsed = 0;
  #intervalMs = 1500;
  #index = 0;

  enabled: boolean = true;

  update({ deltaTime, world }: LogicContext) {
    this.#elapsed += deltaTime;

    if (this.#elapsed < this.#intervalMs) {
      return;
    }

    this.#elapsed = 0;
    this.#index = (this.#index + 1) % MESH_CYCLE.length;
    const nextId = MESH_CYCLE[this.#index]!;

    for (const entity of world.meshIds.keys()) {
      world.meshIds.set(entity, nextId);
    }
  }
}
