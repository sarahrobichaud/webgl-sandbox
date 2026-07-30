import { BindingController } from "./binding-controller";

/**
 * Allows querying user inputs by action names
 */
export class InputBridge {
  #bindingController = new BindingController();

  isActive(action: Action) {}
}
