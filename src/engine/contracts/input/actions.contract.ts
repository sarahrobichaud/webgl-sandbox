import type { Button } from "./button.contract";

export interface ActionBinding {
  key: Button;
}

export interface InputContext<TMappings extends Record<string, ActionBinding> = Record<string, ActionBinding>> {
  contextId: number;
  mappings: TMappings;
}

export type ActionRegistry = InputContext[];
