import { SceneId } from "../../../engine/contracts/branded-values";
import type { InputContext } from "../../../engine/contracts/input/actions.contract";
import { KeyboardButton } from "../../../engine/contracts/input/button.contract";
import type { Scene } from "../../../engine/contracts/scene/scene.contract";
import { DemoView } from "./demo-view";

const zoomContext = {
  contextId: 1,
  mappings: {
    ZOOM_IN: { key: KeyboardButton.KeyE },
    ZOOM_OUT: { key: KeyboardButton.KeyQ },
  },
} satisfies InputContext;

const panContext = {
  contextId: 2,
  mappings: {
    PAN_UP: { key: KeyboardButton.KeyW },
    PAN_DOWN: { key: KeyboardButton.KeyS },
    PAN_LEFT: { key: KeyboardButton.KeyD },
    PAN_RIGHT: { key: KeyboardButton.KeyA },
  },
} satisfies InputContext;

const demoActions = [
  zoomContext, panContext,
];

export type DemoActions = keyof typeof zoomContext.mappings | keyof typeof panContext.mappings;

export function buildDemoScene(): Scene {
  const view = new DemoView();

  return {
    id: SceneId(1),
    actions: demoActions,
    view: view,
  };
}
