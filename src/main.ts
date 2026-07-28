import { MESHES } from "./engine/runtime/rendering/geometry/mesh";
import { Instance } from "./engine/system";
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

const meshes = [
  MESHES.plane, MESHES.cube, MESHES.pyramid,
];

const instance = Instance.initialize(
  {
    renderer: "web-gl",
    parentElement: appElement,
  },
  scenes,
  simulations,
);

const world = new LocalWorld();

instance.registerMeshes([
  MESHES.plane, MESHES.cube, MESHES.pyramid,
]);

instance.session.loadWorld(world);

instance.runtime.setActiveScene(scenes[0].id);
console.log(instance.session.activeWorld);

instance.start();
