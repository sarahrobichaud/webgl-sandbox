import { GameWorld } from "../engine/core/game-manager";

export type WorldStorage = "grids";
export interface Tile {
  color: string;
}

export interface Grid {
  x: number;
  y: number;
  tiles: Tile;
}

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
