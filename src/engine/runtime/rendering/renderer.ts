import type { RendererBackend, Renderer } from "../../contracts/internal";

export class SceneRenderer implements Renderer {
  #backend: RendererBackend;

  constructor(backend: RendererBackend) {
    this.#backend = backend;
  }

  render(): void {}
}
