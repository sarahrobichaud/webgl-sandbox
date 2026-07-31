import type { ActionBinding, ActionRegistry, InputContext } from "../../contracts/input/actions.contract";
import type { BindingMapper } from "./binding-mapper";

export interface RegisteredActionBinding extends ActionBinding {
  isPressed(): boolean;
}

function createScopeKey(scope: number, contextId: string) {
  return `${scope}_${contextId}`;
}

export class InputBridge {
  #bindingMapper: BindingMapper;

  #scopes = new Map<number, ActionRegistry>();
  #availableActions = new Map<string, string[]>();

  constructor(bindingMapper: BindingMapper) {
    this.#bindingMapper = bindingMapper;
  }

  registerActions(scopeId: number, registry: ActionRegistry) {
    for (const ctx of registry) {
      const resolved = this.#bindingMapper.register(ctx.mappings);
      ctx.mappings = resolved;

      const actions = Object.keys(ctx.mappings);
    }

    this.#scopes.set(scopeId, registry);

    console.log(this.#scopes);
  }

  isActive(action: string) {
    // What scene are we in?
    // What internal scene context are we in?
    //
  }
}
