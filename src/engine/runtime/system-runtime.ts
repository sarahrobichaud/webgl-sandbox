import type { AssetCatalog } from "../contracts/assets/assets.contract";
import { SceneId } from "../contracts/branded-values";
import type { Renderer, Runtime, SceneManager, Session } from "../contracts/internal";
import type { MountedScene, Scene } from "../contracts/scene/scene.contract";
import { AssetStore } from "./assets/asset-manager";
import type { InputBridge } from "./input/input-bridge";
import { Presenter } from "./scenes/presenter";

export class SystemRuntime implements Runtime {
  #presenter: SceneManager;
  #renderer: Renderer;
  #session: Session;
  #assets: AssetStore;
  #input: InputBridge;
  #suspend = false;

  constructor(session: Session, renderer: Renderer, assets: AssetStore, inputBridge: InputBridge, canvas: HTMLCanvasElement) {
    this.#session = session;
    this.#renderer = renderer;
    this.#presenter = new Presenter(canvas);
    this.#assets = assets;
    this.#input = inputBridge;
  }

  setActiveScene(id: SceneId) {
    this.#presenter.mount(id);
    this.#suspend = false;
  }

  loadAssets(catalog: AssetCatalog): void {
    this.#assets.load(catalog);
    this.#renderer.prepareAssets();
  }

  loadScenes(scenes: Scene[]): void {
    scenes.forEach((s) => {
      this.#presenter.registerScene(s);

      if (s.actions) {
        this.#input.registerActions(s.id, s.actions);
      }
    });
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
    scene.updateView({ camera: scene.camera });
  }

  #draw(scene: MountedScene) {
    this.#renderer.render(scene);
  }
}
