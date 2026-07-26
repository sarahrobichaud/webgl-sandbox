import { SceneId } from "../contracts/branded-values";
import type { Renderer, Runtime, SceneManager } from "../contracts/internal";
import type { Scene } from "../contracts/scene/scene.contract";
import { InternalSceneManager } from "./scenes/scene-manager";

export class SystemRuntime implements Runtime {
  #sceneManager: SceneManager;
  #renderer: Renderer;

  constructor(renderer: Renderer) {
    this.#renderer = renderer;
    this.#sceneManager = new InternalSceneManager();
  }

  loadScenes(scenes: Scene[]): void {
    scenes.forEach((scene) => this.#sceneManager.registerScene(scene));
    this.#sceneManager.switchTo(SceneId(1));
  }

  loop(lastTimeMs: number = 0) {
    this.#update();
    this.#draw();
    window.requestAnimationFrame(this.loop.bind(this));
  }

  #update() {}

  #draw() {
    this.#renderer.render();
  }
}
