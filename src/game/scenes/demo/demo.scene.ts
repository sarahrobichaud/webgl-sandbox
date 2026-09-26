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
    PAN_LEFT: { key: KeyboardButton.KeyA },
    PAN_RIGHT: { key: KeyboardButton.KeyD },
  },
} satisfies InputContext;

const rotateContext = {
  contextId: 3,
  mappings: {
    ROTATE_X: { key: KeyboardButton.KeyX },
    ROTATE_Y: { key: KeyboardButton.KeyY },
    ROTATE_Z: { key: KeyboardButton.KeyZ },
  },
} satisfies InputContext;

const demoActions = [
  zoomContext, panContext, rotateContext,
];

export type DemoActions = keyof typeof zoomContext.mappings | keyof typeof panContext.mappings | keyof typeof rotateContext.mappings;

export function buildDemoScene(): Scene {
  const view = new DemoView();

  return {
    id: SceneId(1),
    actions: demoActions,
    view: view,
  };
}
