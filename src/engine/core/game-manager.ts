import { isRenderingComponent, type LogicComponent, type RenderingComponent, isLogicComponent, type Component, InternalComponent, type RenderingPipelineComponent } from "../components/components";
import type { Renderer, RendererKind } from "../graphics/types";
import { WebGlRenderer } from "../graphics/webgl/web-gl-renderer";
import type { GameWorld } from "./world";

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

  #world: GameWorld<string> | null = null;

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

  protected loadWorld(gameWorld: GameWorld<string>) {
    this.#world = gameWorld;

    this.#initRenderer();
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
    if (renderer === "web-gl") {
      return new WebGlRenderer(this.#parentElement);
    }

    throw new Error("Only canvas-2d is supported");
  }

  #initRenderer() {
    if (!this.#world) {
      return;
    }

    // Upload every mesh in the catalog once (entities only store mesh ids).
    this.#renderer.init([
      ...this.#world.meshes.values(),
    ]);
  }

  /**
   * The Game loop
   * @param timeStamp - Time since last call
   */
  #loop(timeStamp: number) {
    const deltaTime = timeStamp - this.#lastTime;
    this.#lastTime = timeStamp;

    this.#renderer.clear();

    if (this.#world) {
      this.#update(deltaTime);
      this.#draw(this.#renderer);
    }

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
    if (!this.#world) {
      return;
    }

    renderer.setup("basic");

    for (const entity of this.#world.entities) {
      const def = this.#world.definitions.get(entity);

      if (def?.isHidden) {
        continue;
      }

      const pos = this.#world.positions.get(entity);
      const transform = this.#world.transform3D.get(entity);
      const meshId = this.#world.meshIds.get(entity);
      const mesh = meshId ? this.#world.meshes.get(meshId) : undefined;

      if (!pos || !transform || !mesh) {
        continue;
      }

      renderer.render(mesh, pos, transform);
    }
  }
}
