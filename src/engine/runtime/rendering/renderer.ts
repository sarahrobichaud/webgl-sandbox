import type { Mesh } from "../../contracts/geometry/geometry.contract";
import type { RendererBackend, Renderer } from "../../contracts/internal";
import type { SceneRenderContext } from "../../contracts/scene/scene.contract";

export class SceneRenderer implements Renderer {
  #backend: RendererBackend;

  constructor(backend: RendererBackend) {
    this.#backend = backend;
  }

  loadAssets(meshes: Mesh[]) {
    this.#backend.init(meshes);
  }

  startFrame() {
    this.#backend.clear();
  }

  render({ camera }: SceneRenderContext): void {
    this.#backend.renderGrid(camera.getViewPerspective());
    this.#backend.setup("basic");
  }
}
