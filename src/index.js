import "./style.css";
import { GameController } from "./modules/game-controller.js";

const button = document.querySelector("#start-button");
const gc = new GameController("#human", "#computer", "#game-text");

button.addEventListener("click", () => gc.startGame());
