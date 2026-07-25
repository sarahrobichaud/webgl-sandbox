import type { ActionRegistry } from "../input/action-mapper";
import type { KeyboardButton, MouseButton } from "./button.contract";

export interface Listener {
  beginFrame(): void;
  attach(target?: Window | HTMLElement): void;
  detach(): void;
}

export interface withButtonInputs<Code extends string | number> {
  isDown(code: Code): boolean;
  wasPressed(code: Code): boolean;
  wasReleased(code: Code): boolean;
}

export interface MouseInputReader extends withButtonInputs<MouseButton>, Listener {}
export interface KeyboardInputReader extends withButtonInputs<KeyboardButton>, Listener {}

export interface InputManager<Action extends string> extends Listener {
  setBindings(actions: ActionRegistry): void;

  isDown(code: Action): boolean;

  wasPressed(code: Action): boolean;
  wasReleased(code: Action): boolean;

  beginFrame(): void;
  attach(target?: Window | HTMLElement): void;
  detach(): void;
}
