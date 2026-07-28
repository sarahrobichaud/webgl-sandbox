import { SceneId } from "../contracts/branded-values";
import type { Mesh } from "../contracts/geometry/geometry.contract";
import type { Renderer, Runtime, SceneManager, Session } from "../contracts/internal";
import type { Scene } from "../contracts/scene/scene.contract";
import { InternalSceneManager } from "./scenes/scene-manager";

export class SystemRuntime implements Runtime {
  #sceneManager: SceneManager;
  #renderer: Renderer;
  #session: Session;
  #canvas: HTMLCanvasElement;

  constructor(session: Session, renderer: Renderer, canvas: HTMLCanvasElement) {
    this.#session = session;
    this.#renderer = renderer;
    this.#sceneManager = new InternalSceneManager(canvas);
    this.#canvas = canvas;
  }

  setActiveScene(id: SceneId) {
    return this.#sceneManager.switchTo(id);
  }

  loadScenes(scenes: Scene[]): void {
    scenes.forEach((s) => this.#sceneManager.registerScene(s));
  }
  init(meshes: Mesh[]): void {
    this.#renderer.loadAssets(meshes);
  }

  loop(lastTimeMs: number = 0) {
    this.#update();
    this.#draw();
    window.requestAnimationFrame(this.loop.bind(this));
  }

  #update() {}

  #draw() {
    const active = this.#sceneManager.active;

    if (!this.#session.activeWorld || !active) {
      return;
    }

    this.#renderer.render(active.scene, this.#session.activeWorld, active.camera);
  }
}
