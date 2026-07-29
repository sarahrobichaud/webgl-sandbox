import type { RendererBackend, Runtime, Session, System } from "./contracts/internal";
import type { RendererType } from "./contracts/rendering/renderer.contract";
import type { Scene } from "./contracts/scene/scene.contract";
import { AssetStore, type AssetRegistry } from "./runtime/assets/asset-manager";
import { SceneRenderer } from "./runtime/rendering/renderer";
import { WebGlRenderer } from "./runtime/rendering/webgl/web-gl-renderer";
import { SystemRuntime } from "./runtime/system-runtime";
import { DefaultSession } from "./session/default-session";
import type { Simulation } from "./session/simulation";

export interface InstanceConfiguration {
  parentElement: HTMLCanvasElement;
  renderer: RendererType;
}

function createRendererBackend(type: RendererType, canvas: HTMLCanvasElement): RendererBackend {
  switch (type) {
    case "web-gl":
      return new WebGlRenderer(canvas);
    default:
      throw new Error("Unsupported Renderer");
  }
}

function createRenderer(backend: RendererBackend, assetRegistry: AssetRegistry) {
  return new SceneRenderer(backend, assetRegistry);
}

export class AeroSystem implements System {
  #session: Session;
  #runtime: Runtime;

  constructor(session: Session, runtime: Runtime, scenes: Scene[]) {
    this.#session = session;
    this.#runtime = runtime;

    this.#runtime.loadScenes(scenes);
  }

  static initialize(config: InstanceConfiguration, scenes: Scene[], simulations: Simulation[]) {
    const backend = createRendererBackend(config.renderer, config.parentElement);

    const session = new DefaultSession(simulations);
    const assetRegistry = new AssetStore();
    const renderer = createRenderer(backend, assetRegistry);
    const runtime = new SystemRuntime(session, renderer, assetRegistry, config.parentElement);

    return new AeroSystem(session, runtime, scenes);
  }

  get runtime() {
    return this.#runtime;
  }

  get session() {
    return this.#session;
  }
}
