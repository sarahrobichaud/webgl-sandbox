import {
  CanvasRenderer2D,
  type Renderer,
} from "../graphics/2d-canvas-renderer";
import type { RendererKind } from "../graphics/types";
import {
  isRenderingComponent,
  type LogicComponent,
  type GameComponent,
  type RenderingComponent,
  isLogicComponent,
  type Component,
} from "../components/components";
import type { Movable, Position, Drawable, Transform } from "./game-object";

export type EntityId = number;
export type WorldStorageId = number;

/**
 * A game world, stores all data in the world
 */
export class GameWorld<StorageKey extends string> {
  #components = new Map<StorageKey, Map<EntityId, any>>();

  #positions = new Map<EntityId, Position>();
  #movables = new Map<EntityId, Movable>();
  #drawables = new Map<EntityId, Drawable>();

  #nextId = 0;

  constructor() {}

  createEntity() {
    return this.#nextId++;
  }

  get positions() {
    return this.#positions;
  }

  get movables() {
    return this.#movables;
  }

  get drawables() {
    return this.#drawables;
  }

  protected addStorage<T>(name: StorageKey) {
    this.#components.set(name, new Map<EntityId, T>());
  }
  protected getStorage<T>(name: StorageKey) {
    return this.#components.get(name) as Map<EntityId, T>;
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

  #renderingComponents: RenderingComponent[] = [];
  #logicComponents: LogicComponent[] = [];

  constructor(config: GameManagerConfig) {
    this.#parentElement = config.parentElement;
    this.#renderer = this.#setupRenderer(config.renderer);
  }

  start(): void {
    this.#loop(0);
  }

  protected registerComponents(component: Component) {
    if (isLogicComponent(component)) {
      this.#logicComponents.push(component);
    }

    if (isRenderingComponent(component)) {
      this.#renderingComponents.push(component);
    }
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
    this.#draw(this.#renderer);

    window.requestAnimationFrame(this.#loop.bind(this));
  }

  /**
   * Executes the game logic
   * @param deltaTime
   */
  #update(deltaTime: number) {
    for (const logic of this.#logicComponents) {
      logic.update(deltaTime);
    }
  }

  /**
   * Draws to the screen
   */
  #draw(renderer: Renderer) {
    for (const renderSystem of this.#renderingComponents) {
      renderSystem.draw(renderer);
    }
  }
}
