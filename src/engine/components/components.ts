import type { Position, Transform2D, Transform3D } from "../core/primitives";
import type { EntityId } from "../core/types";
import type { GameWorld } from "../core/world";
import type { Renderer2D } from "../graphics/types";
import type { RenderMatrix } from "../graphics/render-matrix";

export interface Component {
  enabled: boolean;
}

export interface RenderingComponent extends Component {
  draw(renderer: Renderer2D): void;
}

export interface LogicComponent extends Component {
  update(deltaTime: number): void;
}

export interface CorePrimitivesStorage {
  positions: Map<EntityId, Position>;
  transforms2D: Map<EntityId, Transform2D>;
  transforms3D: Map<EntityId, Transform3D>;
}

export interface RenderingPipelineComponent extends Component {
  update(entities: Iterable<EntityId>, storage: CorePrimitivesStorage, matrices: Map<EntityId, RenderMatrix>): void;
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

export abstract class GameComponent<WorldStorage extends string> implements Component {
  #enabled: boolean;
  #world: GameWorld<WorldStorage>;

  constructor(world: GameWorld<WorldStorage>, enabled: boolean = true) {
    this.#enabled = enabled;
    this.#world = world;
  }

  get enabled() {
    return this.#enabled;
  }

  get world() {
    return this.#world;
  }
}

export function isRenderingComponent(component: Component): component is RenderingComponent {
  return "draw" in component;
}

export function isLogicComponent(component: Component): component is LogicComponent {
  return "update" in component;
}
