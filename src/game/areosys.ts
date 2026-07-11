import {
  Game,
  GameWorld,
  type EntityId,
  type GameManagerConfig,
} from "../engine/core/game-manager";
import { Vector2 } from "../engine/core/vector";

export interface AeroSysConfig {
  gameConfig: GameManagerConfig;
}

function createTile(world: GameWorld, x: number, y: number): EntityId {
  const id = world.createEntity();
  world.positions.set(id, { x, y });
  world.movables.set(id, { velocities: new Vector2(2, 1) });
  world.drawables.set(id, { w: 32, h: 32, color: "blue" });
  return id;
}

export class AeroSys extends Game {
  constructor(config: AeroSysConfig) {
    super(config.gameConfig);

    createTile(this.world, 0, 0);
  }
}
