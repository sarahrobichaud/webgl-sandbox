import type { World } from "../../contracts/data/world.contract";
import type { Mesh } from "../../contracts/geometry/geometry.contract";
import type { RendererBackend, Renderer } from "../../contracts/internal";
import type { Camera } from "../../contracts/rendering/camera.contract";
import type { Scene } from "../../contracts/scene/scene.contract";

export class SceneRenderer implements Renderer {
  #backend: RendererBackend;

  constructor(backend: RendererBackend) {
    this.#backend = backend;
  }

  loadAssets(meshes: Mesh[]) {
    this.#backend.init(meshes);
  }

  render(scene: Scene, world: World, camera: Camera): void {
    this.#backend.renderGrid(camera.getViewPerspective());
    this.#backend.setup("basic");
  }
}
