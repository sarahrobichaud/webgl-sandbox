import { GameWorld } from "../engine/core/world";
import type { Grid } from "./grid/grid";

export type WorldStorage = "grids";

/**
 * A game world, stores all data in the world
 */
export class World extends GameWorld<WorldStorage> {
  constructor() {
    super();
    this.addStorage("grids");
  }

  get grids() {
    return this.getStorage<Grid>("grids");
  }
}
