import type { mat4 } from "gl-matrix";
import type { Simulation } from "../session/simulation";
import type { SceneId } from "./branded-values";
import type { World } from "./data/world.contract";
import type { Mesh } from "./geometry/geometry.contract";
import type { Camera } from "./rendering/camera.contract";
import type { MountedScene, Scene, SceneRenderContext } from "./scene/scene.contract";
import type { Position, SpacialData } from "./spatial/spatial.contract";

export interface SceneSchema {
  actions: string;
}

export interface System {
  start(): void;
}

export interface Session {
  activeWorld: World | null;
  simulations: Simulation[];
  loadWorld(world: World): void;
}

export interface Runtime {
  loop(lastTimeMs?: number): void;
  loadScenes(scenes: Scene[]): void;
  setActiveScene(id: SceneId): void;
  init(meshes: Mesh[]): void;
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
  loadAssets(meshes: Mesh[]): void;
  render(context: SceneRenderContext): void;
}

export interface RendererBackend {
  clear(): void;
  render(viewProjection: mat4, mesh: Mesh, position: Position, transform: SpacialData): void;
  init(meshes: Mesh[]): void;
  setup(program: "basic"): void;
  renderGrid(viewProjection: mat4): void;
}
