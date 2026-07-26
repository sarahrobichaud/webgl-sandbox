import type { Button } from "./button.contract";

interface ActionBinding {
  key: Button;
}

export type ActionRegistry = Record<string, ActionBinding>;
