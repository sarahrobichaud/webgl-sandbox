import type { ActionRegistry } from "../engine/contracts/input/actions.contract";
import { KeyboardButton } from "../engine/contracts/input/button.contract";

export const Action = {
  ZOOM_IN: {
    key: KeyboardButton.KeyE,
  },
  ZOOM_OUT: {
    key: KeyboardButton.KeyQ,
  },
} satisfies ActionRegistry;

export type ActionCodes = keyof typeof Action;
