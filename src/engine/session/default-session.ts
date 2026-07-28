import type { World } from "../contracts/data/world.contract";
import type { Session } from "../contracts/internal";
import type { Simulation } from "./simulation";

export class DefaultSession implements Session {
  #world: World | null = null;
  #simulations: Simulation[];

  constructor(simulations: Simulation[]) {
    this.#simulations = simulations;
  }

  loadWorld(world: World) {
    this.#world = world;
  }

  get simulations() {
    return this.#simulations;
  }

  get activeWorld() {
    return this.#world;
  }
}
