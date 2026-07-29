import { SceneId } from "./engine/contracts/branded-values";
import { AeroSystem } from "./engine/system";
import { ASSET_CATALOG } from "./game/assets/catalog";
import { buildDemoScene } from "./game/scenes/demo/demo.scene";
import { DemoSimulation } from "./game/simulation/demo-simulation";
import { LocalWorld } from "./game/world/game-world";
import "./styles/main.css";

const appElement = document.querySelector("#game-view");

if (!appElement || !(appElement instanceof HTMLCanvasElement)) {
  throw new Error("No app found");
}
const scenes = [
  buildDemoScene(),
];

const simulations = [
  new DemoSimulation(),
];

const instance = AeroSystem.initialize(
  {
    renderer: "web-gl",
    parentElement: appElement,
  },
  scenes,
  simulations,
);

const world = new LocalWorld();

instance.session.loadWorld(world);

instance.runtime.loadAssets(ASSET_CATALOG);
instance.runtime.setActiveScene(SceneId(1));
instance.runtime.loop();
