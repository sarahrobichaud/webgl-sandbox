import { AeroSys } from "./game/areosys";
import "./styles/main.css";

const appElement = document.querySelector("#app");

if (!appElement || !(appElement instanceof HTMLElement)) {
  throw new Error("No app found");
}

const game = new AeroSys({
  gameConfig: {
    renderer: "canvas-2d",
    parentElement: appElement,
  },
});

game.start();
