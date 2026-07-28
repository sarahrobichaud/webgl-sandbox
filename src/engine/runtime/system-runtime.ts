import { SceneId } from "../contracts/branded-values";
import type { Mesh } from "../contracts/geometry/geometry.contract";
import type { Renderer, Runtime, SceneManager, Session } from "../contracts/internal";
import type { MountedScene, Scene } from "../contracts/scene/scene.contract";
import { InputHub } from "./input/input-manager";
import { Presenter } from "./scenes/presenter";

export class SystemRuntime implements Runtime {
  #presenter: SceneManager;
  #renderer: Renderer;
  #session: Session;
  #suspend = false;

  constructor(session: Session, renderer: Renderer, canvas: HTMLCanvasElement) {
    this.#session = session;
    this.#renderer = renderer;
    this.#presenter = new Presenter(canvas);
  }

  setActiveScene(id: SceneId) {
    this.#presenter.mount(id);
    this.#suspend = false;
  }

  loadScenes(scenes: Scene[]): void {
    scenes.forEach((s) => this.#presenter.registerScene(s));
  }
  init(meshes: Mesh[]): void {
    this.#renderer.loadAssets(meshes);
  }

  #getLoadedScene() {
    const currentScene = this.#presenter.current;

    if (!this.#session.activeWorld) {
      throw new Error("No world loaded!");
    }

    if (!currentScene) {
      throw new Error("No scene loaded!");
    }
    return currentScene;
  }

  loop(lastTimeMs: number = 0) {
    this.#renderer.startFrame();
    if (this.#suspend) {
      window.requestAnimationFrame(this.loop.bind(this));
      return;
    }

    try {
      const currentScene = this.#getLoadedScene();
      this.#update(currentScene);
      this.#draw(currentScene);
    } catch (e) {
      console.warn(e);
      this.#suspend = true;
    }

    window.requestAnimationFrame(this.loop.bind(this));
  }

  #update(scene: MountedScene) {
    scene.updateView({ input: new InputHub(), camera: scene.camera });
  }

  #draw(scene: MountedScene) {
    this.#renderer.render(scene);
  }
}
