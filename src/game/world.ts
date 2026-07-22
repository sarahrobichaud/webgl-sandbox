import { GameWorld } from "../engine/core/world";

export type WorldStorage = "grids";

/**
 * A game world, stores all data in the world
 */
export class World extends GameWorld<WorldStorage> {
  constructor() {
    super();
  }
}
