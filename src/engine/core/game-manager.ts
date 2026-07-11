import {
  CanvasRenderer2D,
  type Renderer,
} from "../graphics/2d-canvas-renderer";
import type { RendererKind } from "../graphics/types";
import { MovementSystem } from "../systems/movement/movement-system";
import { RenderingSystem } from "../systems/rendering-system";
import type { Movable, Position, Drawables, Transform } from "./game-object";

export type EntityId = number;

/**
 * A game world, stores all data in the world
 */
export class GameWorld {
  #positions = new Map<EntityId, Position>();
  #transformable = new Map<EntityId, Transform>();
  #movables = new Map<EntityId, Movable>();
  #drawables = new Map<EntityId, Drawables>();

  constructor() {}

  #nextId: EntityId = 0;

  createEntity(): EntityId {
    return this.#nextId++;
  }

  get positions() {
    return this.#positions;
  }

  get transforms() {
    return this.#transformable;
  }

  get movables() {
    return this.#movables;
  }

  get drawables() {
    return this.#drawables;
  }
}

/**
 * Game Manager
 */

export interface GameManager {
  start(): void;
}

export interface GameManagerConfig {
  parentElement: HTMLElement;
  renderer: RendererKind;
}

export abstract class Game implements GameManager {
  #lastTime = 0;
  #renderer: Renderer;

  #parentElement;
  #world = new GameWorld();

  #renderingSystem: RenderingSystem;
  #movementSystem: MovementSystem;

  constructor(config: GameManagerConfig) {
    this.#parentElement = config.parentElement;
    this.#renderer = this.#setupRenderer(config.renderer);

    this.#renderingSystem = new RenderingSystem(this.#world);
    this.#movementSystem = new MovementSystem(this.#world);
  }

  get world() {
    return this.#world;
  }

  start(): void {
    this.#loop(0);
  }

  /**
   * Setups the renderer
   *
   *
   * Available options are:
   *  - Canvas 2D
   *
   * @param renderer
   * @returns
   */
  #setupRenderer(renderer: RendererKind) {
    if (renderer === "canvas-2d") {
      return new CanvasRenderer2D(this.#parentElement);
    }

    throw new Error("Only canvas-2d is supported");
  }

  /**
   * The Game loop
   * @param timeStamp - Time since last call
   */
  #loop(timeStamp: number) {
    const deltaTime = timeStamp - this.#lastTime;
    this.#lastTime = timeStamp;

    this.#renderer.clear();
    this.#update(deltaTime);
    this.#draw();

    window.requestAnimationFrame(this.#loop.bind(this));
  }

  /**
   * Executes the game logic
   * @param deltaTime
   */
  #update(deltaTime: number) {
    this.#movementSystem.update(deltaTime);
  }

  /**
   * Draws to the screen
   */
  #draw() {
    this.#renderingSystem.draw(this.#renderer);
  }
}
