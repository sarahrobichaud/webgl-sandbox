import {
  Game,
  type EntityId,
  type GameManagerConfig,
} from "../engine/core/game-manager";
import { Vector2 } from "../engine/core/vector";
import { MovementSystem } from "./systems/movement-system";
import { RenderingSystem } from "./systems/rendering-system";
import { World } from "./world";

export interface AeroSysConfig {
  gameConfig: GameManagerConfig;
}

export class AeroSys extends Game {
  #world = new World();

  constructor(config: AeroSysConfig) {
    super(config.gameConfig);

    const components = [MovementSystem, RenderingSystem];

    for (const Component of components) {
      this.registerComponents(new Component(this.#world));
    }

    const tile1 = this.#createTile(this.#world, 0, 0);
  }

  #createTile(world: World, x: number, y: number): EntityId {
    const id = world.createEntity();
    world.positions.set(id, { x, y });
    world.movables.set(id, { velocities: new Vector2(1, 1) });
    world.drawables.set(id, { w: 32, h: 32, color: "blue" });
    return id;
  }
}
