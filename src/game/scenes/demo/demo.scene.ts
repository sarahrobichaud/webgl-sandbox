import { SceneId } from "../../../engine/contracts/branded-values";
import type { Scene } from "../../../engine/contracts/scene/scene.contract";
import { DemoView } from "./demo-view";

export function buildDemoScene(): Scene {
  const view = new DemoView();

  return {
    id: SceneId(1),
    view: view,
  };
}
