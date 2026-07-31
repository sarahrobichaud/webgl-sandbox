import { BrowserKeyboardInputs } from "./browser-keyboard-inputs";
import { BrowserMouseInputs } from "./browser-mouse-inputs";

export class InputManager {
  #keyboard = new BrowserKeyboardInputs();
  #mouse = new BrowserMouseInputs();

  #target?: HTMLElement;

  constructor(target?: HTMLElement) {
    this.#target = target;
  }

  get mouse() {
    return this.#mouse;
  }

  get keyboard() {
    return this.#keyboard;
  }

  enable() {
    this.#attach();
  }

  disable() {
    this.#detach();
  }

  #attach() {
    this.#mouse.attach(this.#target);
    this.#keyboard.attach(this.#target);
  }

  #detach() {
    this.#mouse.detach();
    this.#keyboard.detach();
  }
}
