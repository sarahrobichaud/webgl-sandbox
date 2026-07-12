import { AeroSys } from "./game/areosys";
import "./styles/main.css";

const appElement = document.querySelector("#app");

if (!appElement || !(appElement instanceof HTMLElement)) {
  throw new Error("No app found");
}

const game = new AeroSys({
  gameConfig: {
    renderer: "web-gl",
    parentElement: appElement,
  },
});

game.start();
