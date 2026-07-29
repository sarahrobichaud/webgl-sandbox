import { mat4 } from "gl-matrix";
import type { RendererBackend, Renderer, FrameRenderingContext } from "../../contracts/internal";
import type { SceneRenderContext } from "../../contracts/scene/scene.contract";
import type { AssetRegistry } from "../assets/asset-manager";
import { AssetCache, type GpuAssetCache } from "./webgl/gpu-asset-cache";

export class SceneRenderer implements Renderer {
  #backend: RendererBackend;
  #assets: AssetRegistry;
  #assetCache: GpuAssetCache;
  #ctx: FrameRenderingContext;

  constructor(backend: RendererBackend, assets: AssetRegistry) {
    this.#backend = backend;
    this.#assets = assets;
    this.#assetCache = new AssetCache();

    this.#ctx = {
      assets: this.#assetCache,
      viewProjection: mat4.create(),
    };
  }

  prepareAssets() {
    const pendingAssets = this.#assets.getPending();

    for (const entry of pendingAssets) {
      console.log(`Loading: ${entry.key}`);
      const handle = this.#backend.loadMesh(entry.key, entry.description);
      this.#assets.markAvailable(entry.key);
      this.#assetCache.set(entry.key, handle);
    }
  }

  startFrame() {
    this.#backend.clear();
  }

  render({ camera }: SceneRenderContext): void {
    this.#ctx.viewProjection = camera.getViewPerspective();

    this.#backend.renderGrid(this.#ctx);
    this.#backend.setup("basic");
  }
}
