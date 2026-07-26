import type { RendererBackend, Runtime, System } from "./contracts/internal";
import type { RendererType } from "./contracts/rendering/renderer.contract";
import type { Scene } from "./contracts/scene/scene.contract";
import { SystemDomain } from "./domain/system-domain";
import { SceneRenderer } from "./runtime/rendering/renderer";
import { WebGlRenderer } from "./runtime/rendering/webgl/web-gl-renderer";
import { SystemRuntime } from "./runtime/system-runtime";

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

function createRenderer(backend: RendererBackend) {
  return new SceneRenderer(backend);
}

export class Instance implements System {
  #domain: SystemDomain;
  #runtime: Runtime;

  constructor(domain: SystemDomain, runtime: Runtime, scenes: Scene[]) {
    this.#domain = domain;
    this.#runtime = runtime;

    this.#runtime.loadScenes(scenes);
  }

  static initialize(config: InstanceConfiguration, scenes: Scene[]) {
    const backend = createRendererBackend(config.renderer, config.parentElement);

    const domain = new SystemDomain();
    const renderer = createRenderer(backend);
    const runtime = new SystemRuntime(renderer);

    return new Instance(domain, runtime, scenes);
  }

  start(): void {
    this.#runtime.loop();
  }
}
