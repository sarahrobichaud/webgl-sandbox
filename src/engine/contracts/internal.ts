import type { mat4 } from "gl-matrix";
import type { Simulation } from "../session/simulation";
import type { SceneId } from "./branded-values";
import type { World } from "./data/world.contract";
import type { Mesh } from "./geometry/geometry.contract";
import type { MountedScene, Scene, SceneRenderContext } from "./scene/scene.contract";
import type { Position, SpacialData } from "./spatial/spatial.contract";
import type { AssetCatalog, MeshAssetDescription } from "./assets/assets.contract";
import type { GpuAssetCache } from "../runtime/rendering/webgl/gpu-asset-cache";

export interface SceneSchema {
  actions: string;
}

export interface System {}

export interface Session {
  activeWorld: World | null;
  simulations: Simulation[];
  loadWorld(world: World): void;
}

export interface Runtime {
  loadAssets(catalog: AssetCatalog): void;
  loop(lastTimeMs?: number): void;
  loadScenes(scenes: Scene[]): void;
  setActiveScene(id: SceneId): void;
}

export interface SceneManager {
  current: MountedScene | null;
  mount(id: SceneId): void;
  registerScene(scene: Scene): void;
}

export interface InputMonitor {
  beginFrame(): void;
  attach(target?: Window | HTMLElement): void;
  detach(): void;
}

export interface InputReader<Button extends string | number> extends InputMonitor {
  isPressed(button: Button): boolean;
  wasPressed(button: Button): boolean;
  wasReleased(button: Button): boolean;
}

export interface InputManager<Action extends string> extends InputMonitor {
  isActive(action: Action): boolean;
  wasActive(action: Action): boolean;
  wasReleased(action: Action): boolean;
}

export interface Scheduler {}

export interface Renderer {
  startFrame(): void;
  prepareAssets(): void;
  render(context: SceneRenderContext): void;
}

export interface VertexLayout {
  POSITION: number;
  NORMAL: number;
}

export interface GpuHandle {
  key: string;
  vao: WebGLVertexArrayObject;
}

export interface AssetIntake {
  loadMesh(key: string, description: MeshAssetDescription): GpuHandle;
}

export interface FrameRenderingContext {
  assets: GpuAssetCache;
  viewProjection: mat4;
}

export interface RendererBackend extends AssetIntake {
  clear(): void;
  render(context: FrameRenderingContext, mesh: string, position: Position, transform: SpacialData): void;
  setup(program: "basic"): void;
  renderGrid(context: FrameRenderingContext): void;
}
