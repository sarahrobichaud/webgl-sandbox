import type { Button } from "./button.contract";

interface ActionBinding {
  key: Button;
}

export interface ActionRegistry {
  global: Record<string, ActionBinding>;
  [scope: string]: Record<string, ActionBinding>;
}
