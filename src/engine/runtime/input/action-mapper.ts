import type { ActionRegistry } from "../../contracts/input/actions.contract";
import { KeyboardButton, MouseButton } from "../../contracts/input/button.contract";

export type ActionDependency = "keyboard" | "mouse";
export class ActionMapper {
  #dependencies: Map<string, ActionDependency[]> = new Map();

  registerActions(registry: ActionRegistry) {
    this.#mapDependendencies(registry);
  }

  #mapDependendencies(registry: ActionRegistry) {
    const keyboardButtons = new Set([
      ...Object.values(KeyboardButton),
    ]);
    const mouseButtons = new Set([
      ...Object.values(MouseButton),
    ]);

    for (const [
      action, binding,
    ] of Object.entries(registry)) {
      const deps: ActionDependency[] = [];

      const key = binding.key;
      if (keyboardButtons.has(key as KeyboardButton)) {
        deps.push("keyboard");
      }
      if (mouseButtons.has(key as MouseButton)) {
        deps.push("mouse");
      }

      this.#dependencies.set(action, deps);
    }
  }
}
