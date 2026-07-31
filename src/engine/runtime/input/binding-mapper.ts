import type { ActionBinding, ActionRegistry, InputContext } from "../../contracts/input/actions.contract";
import { Button, KeyboardButton, MouseButton } from "../../contracts/input/button.contract";
import type { InputReader } from "../../contracts/internal";
import type { RegisteredActionBinding } from "./input-bridge";
import type { InputManager } from "./input-manager";

export class BindingMapper {
  #inputs: InputManager;

  constructor(inputs: InputManager) {
    this.#inputs = inputs;
    this.#inputs.enable();
  }

  register(mappings: InputContext["mappings"]) {
    const resolved: Record<string, RegisteredActionBinding> = {};

    for (const [
      key, mapping,
    ] of Object.entries(mappings)) {
      resolved[key] = {
        ...mapping,
        isPressed: this.#getResolver(mapping),
      };
    }

    return resolved;
  }

  #getResolver(mapping: ActionBinding) {
    const deps: InputReader<Button>[] = [];

    if (Object.values(KeyboardButton).includes(mapping.key as unknown as KeyboardButton)) {
      deps.push(this.#inputs.keyboard);
    }
    if (Object.values(MouseButton).includes(mapping.key as unknown as MouseButton)) {
      deps.push(this.#inputs.mouse);
    }

    return () => deps.some((device) => device.isPressed(mapping.key));
  }
}
