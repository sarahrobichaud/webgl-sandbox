import { World } from "../../game/world";
import { BasicCamera } from "../camera/basic-camera";
import { isRenderingComponent, type LogicComponent, type RenderingComponent, isLogicComponent, type Component, type LogicContext } from "../components/components";
import type { Camera, CameraConfiguration, CameraConfigurationKind } from "../contracts/camera.contract";
import type { InputManager } from "../contracts/input-manager.contract";
import type { Renderer, RendererKind } from "../graphics/types";
import { WebGlRenderer } from "../graphics/webgl/web-gl-renderer";
import { BrowserKeyboardInputs } from "../input/browser-keyboard-inputs";
import type { GameWorld } from "./world";

/**
 * Game Manager
 */

export interface GameManager {
  start(): void;
}

export interface GameManagerConfig {
  parentElement: HTMLCanvasElement;
  renderer: RendererKind;
  camera: CameraConfigurationKind;
}

export abstract class Game implements GameManager {
  #lastTime = 0;
  #renderer: Renderer;
  #parentElement;

  #camera: Camera;

  #logicContext: LogicContext;

  #renderingComponents: RenderingComponent[] = [];
  #logicComponents: LogicComponent[] = [];
  #keyboardInputs: InputManager = new BrowserKeyboardInputs();

  #world: GameWorld<string>;

  constructor(config: GameManagerConfig) {
    this.#parentElement = config.parentElement;
    this.#renderer = this.#setupRenderer(config.renderer);
    this.#camera = this.#setupCamera(config.camera);

    this.#world = new World();
    this.#keyboardInputs.attach();

    this.#logicContext = {
      deltaTime: 0,
      camera: this.#camera,
      world: this.#world,
      keyboard: this.#keyboardInputs,
    };
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

  #setupCamera(config: CameraConfiguration) {
    if (config.type === "basic") {
      return BasicCamera.create(
        {
          type: config.type,
          initialPlacement: config.initialPlacement,
        },
        { canvas: this.#parentElement },
      );
    }

    throw new Error("Unsupported camera");
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

    throw new Error("Unsupported renderer");
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
    this.#logicContext.deltaTime = deltaTime;
    this.#keyboardInputs.beginFrame();
    for (const logic of this.#logicComponents) {
      logic.update(this.#logicContext);
    }
  }

  /**
   * Draws to the screen
   */
  #draw(renderer: Renderer) {
    if (!this.#world) {
      return;
    }

    renderer.setCamera(this.#camera);
    renderer.renderGrid();

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
