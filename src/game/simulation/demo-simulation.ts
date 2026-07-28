import type { Simulation } from "../../engine/session/simulation";

export class DemoSimulation implements Simulation {
  #money = 0;
  update(step: number): void {
    this.#money += 1;
  }
}
