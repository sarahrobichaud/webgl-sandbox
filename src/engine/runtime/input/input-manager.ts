import type { ActionRegistry } from "../../contracts/input/actions.contract";
import type { InputManager } from "../../contracts/internal";
import { ActionMapper } from "./action-mapper";
import { BrowserKeyboardInputs } from "./browser-keyboard-inputs";
import { BrowserMouseInputs } from "./browser-mouse-inputs";

export class InputHub<Action extends string> implements InputManager<Action> {
  #keyboard: BrowserKeyboardInputs;
  #mouse: BrowserMouseInputs;
  #bindings: ActionMapper;

  constructor() {
    this.#keyboard = new BrowserKeyboardInputs();
    this.#mouse = new BrowserMouseInputs();
    this.#bindings = new ActionMapper();
  }

  setBindings(actions: ActionRegistry): void {
    this.#bindings.registerActions(actions);
  }

  isActive(action: Action): boolean {
    throw new Error("Method not implemented.");
  }

  wasActive(action: Action): boolean {
    throw new Error("Method not implemented.");
  }
  wasReleased(action: Action): boolean {
    throw new Error("Method not implemented.");
  }

  beginFrame(): void {
    throw new Error("Method not implemented.");
  }

  attach(target: Window | HTMLElement = window) {
    this.detach();

    this.#keyboard.attach(target);
    this.#mouse.attach(target);
  }

  detach() {
    this.#keyboard.detach();
    this.#mouse.detach();
  }
}
