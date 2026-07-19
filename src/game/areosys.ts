import { vec3 } from "gl-matrix";
import { Game, type GameManagerConfig } from "../engine/core/game-manager";
import type { EntityId } from "../engine/core/types";
import { MESHES, type MeshId } from "../engine/graphics/shapes/mesh";
import { MovementSystem } from "./systems/movement-system";
import { World } from "./world";

export interface AeroSysConfig {
  gameConfig: GameManagerConfig;
}

export class AeroSys extends Game {
  #world = new World();

  constructor(config: AeroSysConfig) {
    super(config.gameConfig);

    const components = [
      MovementSystem,
    ];

    for (const Component of components) {
      this.registerComponents(new Component(this.#world));
    }

    this.#registerMeshes(this.#world);
    this.#createTile(this.#world, 0, 0);
    this.#createTile(this.#world, -400, 0);
    this.#createTile(this.#world, -800, 0);

    this.loadWorld(this.#world);
  }

  #registerMeshes(world: World) {
    for (const mesh of Object.values(MESHES)) {
      world.meshes.set(mesh.r_id, mesh);
    }
  }

  #createTile(world: World, x: number, y: number, meshId: MeshId = "cube"): EntityId {
    const id = world.createEntity([
      "simple",
    ]);
    world.positions.set(id, { x, y, z: 0 });
    world.movables.set(id, { velocities: vec3.fromValues(1, 0, 0) });
    world.meshIds.set(id, meshId);
    world.transform3D.set(id, {
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      x: 0,
      y: 0,
      z: 0,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1,
    });
    world.drawables.set(id, { w: 32, h: 32, color: "blue" });
    return id;
  }
}
