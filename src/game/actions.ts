import { KeyboardButton } from "../engine/contracts/button.contract";
import type { ActionRegistry } from "../engine/input/action-mapper";

export const Action = {
  ZOOM_IN: {
    key: KeyboardButton.KeyE,
  },
  ZOOM_OUT: {
    key: KeyboardButton.KeyQ,
  },
} satisfies ActionRegistry;

export type ActionCodes = keyof typeof Action;
