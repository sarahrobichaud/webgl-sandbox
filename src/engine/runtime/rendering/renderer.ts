import { mat4 } from "gl-matrix";
import type { RendererBackend, Renderer, FrameRenderingContext } from "../../contracts/internal";
import type { AssetRegistry } from "../assets/asset-manager";
import { GpuAssetStore } from "./webgl/gpu-asset-cache";
import type { RuntimeContext } from "../system-runtime";
import type { World } from "../../contracts/data/world.contract";

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

  render({ scene, world }: RuntimeContext): void {
    this.#ctx.viewProjection = scene.camera.getViewPerspective();
    this.#drawEnvironment();
    this.#drawWorld(world);
  }

  #drawEnvironment() {
    this.#backend.renderGrid(this.#ctx);
  }

  #drawWorld(world: World) {
    this.#backend.setup("basic");

    for (const [
      key, visible,
    ] of world.visibles.entries()) {
      const pos = world.positions.get(key);
      const trans = world.transforms.get(key);

      if (!pos || !trans) {
        return;
      }

      this.#backend.render(this.#ctx, visible.assetKey, pos, trans);
    }
  }
  #drawOverlays() {}
}
