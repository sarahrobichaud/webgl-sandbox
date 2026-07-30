import type { ActionRegistry } from "../../contracts/input/actions.contract";
import { KeyboardButton, MouseButton } from "../../contracts/input/button.contract";

export type ActionDependency = "keyboard" | "mouse";
export class ActionMapper {
  #dependencies: Map<string, ActionDependency[]> = new Map();

  registerActions(registry: ActionRegistry) {}

  #mapDependendencies(registry: ActionRegistry) {}
}
