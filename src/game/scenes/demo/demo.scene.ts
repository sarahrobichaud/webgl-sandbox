import { SceneId } from "../../../engine/contracts/branded-values";
import type { ActionRegistry } from "../../../engine/contracts/input/actions.contract";
import { KeyboardButton } from "../../../engine/contracts/input/button.contract";
import type { Scene } from "../../../engine/contracts/scene/scene.contract";
import { DemoView } from "./demo-view";

export const DemoActions = {
  global: {
    ZOOM_IN: { key: KeyboardButton.KeyE },
    ZOOM_OUT: { key: KeyboardButton.KeyQ },
  },
} satisfies ActionRegistry;

export function buildDemoScene(): Scene {
  const view = new DemoView();

  return {
    id: SceneId(1),
    view: view,
  };
}
