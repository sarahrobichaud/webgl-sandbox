import { mat4 } from "gl-matrix";
import type { RendererBackend, Renderer, FrameRenderingContext } from "../../contracts/internal";
import type { SceneRenderContext } from "../../contracts/scene/scene.contract";
import type { AssetRegistry } from "../assets/asset-manager";
import { GpuAssetStore } from "./webgl/gpu-asset-cache";

export class SceneRenderer implements Renderer {
  #backend: RendererBackend;
  #assets: AssetRegistry;
  #gpuCache: GpuAssetStore;
  #ctx: FrameRenderingContext;

  constructor(backend: RendererBackend, assets: AssetRegistry) {
    this.#backend = backend;
    this.#assets = assets;
    this.#gpuCache = new GpuAssetStore();

    this.#ctx = {
      assets: this.#gpuCache,
      viewProjection: mat4.create(),
    };
  }

  prepareAssets() {
    const pendingAssets = this.#assets.getPending();

    for (const entry of pendingAssets) {
      const handle = this.#backend.loadMesh(entry.key, entry.description);
      this.#assets.markAvailable(entry.key);
      this.#gpuCache.set(entry.key, handle);
      console.log(`Loaded asset: ${entry.key}`);
    }
  }

  startFrame() {
    this.#backend.clear();
  }

  render({ camera }: SceneRenderContext): void {
    this.#ctx.viewProjection = camera.getViewPerspective();
    this.#drawEnvironment();
  }

  #drawEnvironment() {
    this.#backend.renderGrid(this.#ctx);
  }

  #drawWorld() {
    this.#backend.setup("basic");
  }
  #drawOverlays() {}
}
