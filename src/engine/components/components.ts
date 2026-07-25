import type { Camera } from "../contracts/camera.contract";
import type { InputManager } from "../contracts/input-manager.contract";
import type { Position, Transform3D } from "../core/primitives";
import type { EntityId } from "../core/types";
import type { GameWorld } from "../core/world";
import type { Renderer3D } from "../graphics/types";

export interface Component {
  enabled: boolean;
}

export interface RenderingComponent extends Component {
  draw(renderer: Renderer3D): void;
}

export interface LogicContext {
  deltaTime: number;
  world: GameWorld<string>;
  camera: Camera;
  input: InputManager;
}

export interface LogicComponent extends Component {
  update(context: LogicContext): void;
}

export interface CorePrimitivesStorage {
  positions: Map<EntityId, Position>;
  transforms3D: Map<EntityId, Transform3D>;
}

export abstract class InternalComponent implements Component {
  #enabled: boolean;

  constructor(enabled: boolean = true) {
    this.#enabled = enabled;
  }

  get enabled() {
    return this.#enabled;
  }
}

export function isRenderingComponent(component: Component): component is RenderingComponent {
  return "draw" in component;
}

export function isLogicComponent(component: Component): component is LogicComponent {
  return "update" in component;
}
