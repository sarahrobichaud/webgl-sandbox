import type { ActionRegistry } from "../../contracts/input/actions.contract";
import type { InputManager } from "../../contracts/internal";
import { ActionMapper } from "./action-mapper";
import { BrowserKeyboardInputs } from "./browser-keyboard-inputs";
import { BrowserMouseInputs } from "./browser-mouse-inputs";

export class ActionMonitor<Action extends string> {
  #keyboard: BrowserKeyboardInputs;
  #mouse: BrowserMouseInputs;

  #activeScopes: number[] = [];

  constructor() {
    this.#keyboard = new BrowserKeyboardInputs();
    this.#mouse = new BrowserMouseInputs();
  }

  isActive(action: Action): boolean {}
  wasActive(action: Action): boolean {}
  wasReleased(action: Action): boolean {}

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
