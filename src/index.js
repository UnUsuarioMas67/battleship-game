import "./style.css";
import { GameController } from "./modules/game-controller.js";

const startBtn = document.querySelector("#start-btn");
const resetBtn = document.querySelector("#reset-btn");
const gc = new GameController("#human", "#computer", "#game-text");

startBtn.addEventListener("click", () => {
  gc.startGame();
  startBtn.disabled = true;
  resetBtn.disabled = false;
});

resetBtn.addEventListener("click", () => {
  gc.reset();
  startBtn.disabled = false;
  resetBtn.disabled = true;
});
