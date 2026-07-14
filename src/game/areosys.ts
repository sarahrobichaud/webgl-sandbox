import { vec3 } from "gl-matrix";
import { Game, type GameManagerConfig } from "../engine/core/game-manager";
import type { EntityId } from "../engine/core/types";
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

    const components = [
      MovementSystem, RenderingSystem,
    ];

    for (const Component of components) {
      this.registerComponents(new Component(this.#world));
    }

    this.#createTile(this.#world, 0, 0);
    this.loadWorld(this.#world);
  }

  #createTile(world: World, x: number, y: number): EntityId {
    const id = world.createEntity();
    world.positions.set(id, { x, y, z: 0 });
    world.movables.set(id, { velocities: vec3.fromValues(2, 1, 0) });
    world.transforms2D.set(id, {
      rotateX: 0,
      rotateY: 0,
      x: 0,
      y: 0,
      isDirty: false,
    });
    world.drawables.set(id, { w: 32, h: 32, color: "blue" });
    return id;
  }
}
