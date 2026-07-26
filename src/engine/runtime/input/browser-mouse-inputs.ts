import type { MouseButton } from "../../contracts/input/button.contract";
import type { InputReader } from "../../contracts/internal";

export class BrowserMouseInputs implements InputReader<MouseButton> {
  #down = new Set<MouseButton>();
  #prevDown = new Set<MouseButton>();
  #pressed = new Set<MouseButton>();
  #released = new Set<MouseButton>();
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

  isPressed(button: MouseButton) {
    return this.#down.has(button);
  }
  wasPressed(button: MouseButton) {
    return this.#pressed.has(button);
  }
  wasReleased(button: MouseButton) {
    return this.#released.has(button);
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
    if (!(e instanceof MouseEvent)) {
      throw new Error("Invalid Event!");
    }

    this.#down.add(e.button);
  };

  #onUp = (e: Event) => {
    if (!(e instanceof MouseEvent)) {
      throw new Error("Invalid Event!");
    }

    this.#down.delete(e.button);
  };

  #onBlur = () => {
    this.#down.clear();
  };
}
