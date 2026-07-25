import { AeroSys } from "./game/areosys";
import "./styles/main.css";

const appElement = document.querySelector("#game-view");

console.log(appElement);
if (!appElement || !(appElement instanceof HTMLCanvasElement)) {
  throw new Error("No app found");
}

const game = new AeroSys({
  gameConfig: {
    renderer: "web-gl",
    parentElement: appElement,
    camera: {
      type: "basic",
      initialPlacement: {
        position: { x: 0, y: 0, z: 0 },
        rotation: { rotateX: -80, rotateY: 10, rotateZ: 50 },
      },
    },
  },
});

game.start();
