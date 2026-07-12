import { CanvasRenderer2D } from "../graphics/2d-canvas-renderer";
import type { Renderer, RendererKind } from "../graphics/types";
import { isRenderingComponent, type LogicComponent, type RenderingComponent, isLogicComponent, type Component, InternalComponent, type RenderingPipelineComponent } from "../components/components";
import { WebGlRenderer } from "../graphics/web-gl-renderer";
import { Transformer } from "../graphics/render/render-transforms";
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

  #renderingPipeline = [
    Transformer,
  ];
  #internalRenderingComponents: RenderingPipelineComponent[] = [];

  #world: GameWorld<string> | null = null;

  constructor(config: GameManagerConfig) {
    this.#parentElement = config.parentElement;
    this.#renderer = this.#setupRenderer(config.renderer);

    for (const Component of this.#renderingPipeline) {
      this.#internalRenderingComponents.push(new Component());
    }
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
    console.log(this);
    if (renderer === "canvas-2d") {
      return new CanvasRenderer2D(this.#parentElement);
    }

    if (renderer === "web-gl") {
      return new WebGlRenderer(this.#parentElement);
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

    for (const internalSystem of this.#internalRenderingComponents) {
      internalSystem.update(this.#world.entities.values(), this.#world.primitives, this.#world.renderMatrices);
    }

    for (const renderSystem of this.#renderingComponents) {
      renderSystem.draw(renderer);
    }
  }
}
