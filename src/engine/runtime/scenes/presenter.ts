import type { SceneId } from "../../contracts/branded-values";
import type { SceneManager } from "../../contracts/internal";
import type { MountedScene, Scene } from "../../contracts/scene/scene.contract";
import { ViewManager } from "./view-manager";

export class Presenter implements SceneManager {
  #current: MountedScene | null = null;
  #scenes: Map<SceneId, Scene> = new Map();
  #view: ViewManager;

  constructor(canvas: HTMLCanvasElement) {
    this.#view = new ViewManager(canvas);
  }

  get current() {
    return this.#current;
  }

  mount(id: SceneId): void {
    const scene = this.#scenes.get(id);

    if (!scene) {
      this.#current = null;
      return;
    }

    this.#view.loadFromScene(scene.view);
    this.#current = { camera: this.#view.camera, updateView: scene.view.onUpdate.bind(scene.view) };
  }

  registerScene(scene: Scene): void {
    this.#scenes.set(scene.id, scene);
  }
}
