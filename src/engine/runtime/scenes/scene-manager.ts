import type { SceneId } from "../../contracts/branded-values";
import type { SceneManager } from "../../contracts/internal";
import type { Scene } from "../../contracts/scene/scene.contract";

export class InternalSceneManager implements SceneManager {
  #active: SceneId | null = null;
  #scenes: Map<SceneId, Scene> = new Map();

  get active() {
    return this.#scenes.get(this.#active!)!;
  }

  switchTo(id: SceneId): void {
    if (!this.#scenes.has(id)) {
      throw new Error("Invalid Scene ID!");
    }

    this.#active = id;
  }

  registerScene(scene: Scene): void {
    this.#scenes.set(scene.id, scene);
  }
}
