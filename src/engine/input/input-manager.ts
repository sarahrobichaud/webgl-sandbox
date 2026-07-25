import type { KeyboardButton } from "../contracts/button.contract";
import type { InputManager, KeyboardInputReader, MouseInputReader } from "../contracts/input-manager.contract";
import { ActionMapper, type ActionRegistry } from "./action-mapper";
import { BrowserKeyboardInputs } from "./browser-keyboard-inputs";
import { BrowserMouseInputs } from "./browser-mouse-inputs";

export class InputHub<Action extends string> implements InputManager<Action> {
  #keyboard: KeyboardInputReader;
  #mouse: MouseInputReader;
  #bindings: ActionMapper;

  constructor() {
    this.#keyboard = new BrowserKeyboardInputs();
    this.#mouse = new BrowserMouseInputs();
    this.#bindings = new ActionMapper();
  }

  setBindings(actions: ActionRegistry): void {
    this.#bindings.registerActions(actions);
  }

  isDown(action: Action): boolean {
    throw new Error("Method not implemented.");
  }
  wasPressed(action: Action): boolean {
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
