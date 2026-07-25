import type { KeyboardInputReader } from "../contracts/input-manager.contract";
import type { KeyboardButton } from "../contracts/button.contract";

export class BrowserKeyboardInputs implements KeyboardInputReader {
  #down = new Set<KeyboardButton>();
  #prevDown = new Set<KeyboardButton>();
  #pressed = new Set<KeyboardButton>();
  #released = new Set<KeyboardButton>();
  #target: Window | HTMLElement | null = null;

  beginFrame() {
    this.#pressed.clear();
    this.#released.clear();

    for (const code of this.#down) {
      if (!this.#prevDown.has(code)) this.#pressed.add(code);
    }
    for (const code of this.#prevDown) {
      if (!this.#down.has(code)) this.#released.add(code);
    }

    this.#prevDown = new Set(this.#down);
  }

  isDown(code: KeyboardButton) {
    return this.#down.has(code);
  }
  wasPressed(code: KeyboardButton) {
    return this.#pressed.has(code);
  }
  wasReleased(code: KeyboardButton) {
    return this.#released.has(code);
  }

  attach(target: Window | HTMLElement = window) {
    this.detach();
    this.#target = target;
    target.addEventListener("keydown", this.#onDown);
    target.addEventListener("keyup", this.#onUp);
    window.addEventListener("blur", this.#onBlur);
  }

  detach() {
    this.#target?.removeEventListener("keydown", this.#onDown);
    this.#target?.removeEventListener("keyup", this.#onUp);
    window.removeEventListener("blur", this.#onBlur);
  }

  #onDown = (e: Event) => {
    if (!(e instanceof KeyboardEvent)) {
      throw new Error("Invalid Event!");
    }

    if (e.repeat) return;
    this.#down.add(e.code as KeyboardButton);
  };

  #onUp = (e: Event) => {
    if (!(e instanceof KeyboardEvent)) {
      throw new Error("Invalid Event!");
    }

    this.#down.delete(e.code as KeyboardButton);
  };

  #onBlur = () => {
    this.#down.clear();
  };
}
