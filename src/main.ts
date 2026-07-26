import { Instance } from "./engine/system";
import { buildDemoScene } from "./game/scenes/demo/demo.scene";
import "./styles/main.css";

const appElement = document.querySelector("#game-view");

if (!appElement || !(appElement instanceof HTMLCanvasElement)) {
  throw new Error("No app found");
}
const scenes = [
  buildDemoScene(),
];

const game = Instance.initialize(
  {
    renderer: "web-gl",
    parentElement: appElement,
  },
  scenes,
);

game.start();
