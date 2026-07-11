import type { GameWorld } from "../core/game-manager";
import type { Renderer } from "../graphics/2d-canvas-renderer";

export interface Component {
  enabled: boolean;
}

export interface RenderingComponent extends Component {
  draw(renderer: Renderer): void;
}

export interface LogicComponent extends Component {
  update(deltaTime: number): void;
}

export abstract class GameComponent<
  WorldStorage extends string,
> implements Component {
  #enabled: boolean;
  #world;

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

export function isRenderingComponent(
  component: Component,
): component is RenderingComponent {
  return "draw" in component;
}

export function isLogicComponent(
  component: Component,
): component is LogicComponent {
  return "update" in component;
}
