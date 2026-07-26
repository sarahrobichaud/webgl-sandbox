import type { SceneId } from "./branded-values";
import type { Mesh } from "./geometry/geometry.contract";
import type { Camera } from "./rendering/camera.contract";
import type { Scene } from "./scene/scene.contract";
import type { Position, SpacialData } from "./spatial/spatial.contract";

export interface SceneSchema {
  actions: string;
}

export interface System {
  start(): void;
}

export interface Runtime {
  loop(lastTimeMs?: number): void;
  loadScenes(scenes: Scene[]): void;
}

export interface SceneManager {
  active: Scene;
  switchTo(id: SceneId): void;
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
  render(): void;
}

export interface RendererBackend {
  clear(): void;
  render(mesh: Mesh, position: Position, transform: SpacialData): void;
  init(meshes: Mesh[]): void;
  setCamera(camera: Camera): void;
  setup(program: "basic"): void;
  renderGrid(): void;
}
