import type { ActionBinding, ActionRegistry, InputContext } from "../../contracts/input/actions.contract";
import type { BindingMapper } from "./binding-mapper";

export interface RegisteredActionBinding extends ActionBinding {
  isPressed(): boolean;
}

export class InputBridge {
  #bindingMapper: BindingMapper;

  #scopes = new Map<number, ActionRegistry>();
  #availableActions = new Map<number, string[]>();
  #bindings = new Map<string, RegisteredActionBinding>();

  #scope: number = 0;

  constructor(bindingMapper: BindingMapper) {
    this.#bindingMapper = bindingMapper;
  }

  set scope(value: number) {
    this.#scope = value;
  }

  registerActions(scopeId: number, registry: ActionRegistry) {
    for (const ctx of registry) {
      const resolved = this.#bindingMapper.register(ctx.mappings);
      ctx.mappings = resolved;

      for (const [
        key, binding,
      ] of Object.entries(resolved)) {
        this.#bindings.set(key, binding);
      }

      const actions = Object.keys(ctx.mappings);

      let existing = this.#availableActions.get(scopeId);

      console.log({ actions, existing });
      if (!existing) {
        existing = [
          ...actions,
        ];
      } else {
        existing.push(...actions);
      }

      this.#availableActions.set(scopeId, existing);
    }

    this.#scopes.set(scopeId, registry);

    console.log(this.#availableActions);
  }

  isActive(action: string) {
    const actions = this.#availableActions.get(this.#scope);

    if (!actions || !actions.includes(action)) {
      return false;
    }

    const binding = this.#bindings.get(action);

    return binding?.isPressed();
  }
}
