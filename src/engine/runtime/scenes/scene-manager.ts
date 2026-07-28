import type { SceneId } from "../../contracts/branded-values";
import type { SceneManager } from "../../contracts/internal";
import type { Scene } from "../../contracts/scene/scene.contract";
import { ViewManager } from "./view-manager";

export class InternalSceneManager implements SceneManager {
  #active: SceneId | null = null;
  #scenes: Map<SceneId, Scene> = new Map();
  #views: ViewManager;

  constructor(canvas: HTMLCanvasElement) {
    this.#views = new ViewManager(canvas);
  }

  get active() {
    const scene = this.#scenes.get(this.#active!);

    const camera = this.#views.getActiveCamera();

    if (!scene || !camera) {
      return null;
    }

    return { scene, camera };
  }

  switchTo(id: SceneId): void {
    const scene = this.#scenes.get(id);
    if (!scene) {
      throw new Error("Invalid Scene ID!");
    }

    this.#views.loadFromScene(scene.views);
    this.#active = id;
  }

  registerScene(scene: Scene): void {
    this.#scenes.set(scene.id, scene);
  }
}
