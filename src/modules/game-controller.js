import { Player } from "./player.js";

export class GameController {
  constructor(humanSelector, computerSelector, gameTextSelector) {
    this.humanElem = document.querySelector(humanSelector);
    this.computerElem = document.querySelector(computerSelector);

    const gameTextElem = document.querySelector(gameTextSelector);
    this.turnIndicator = gameTextElem.querySelector(".current-turn");
    this.statusText = gameTextElem.querySelector(".status");

    this.turnIndicator.textContent = "";
    this.statusText.textContent = "";

    this.domManager = new DOMHelper();
    this.human = new Player();
    this.computer = new Player();

    this.#updateGameboard();
  }

  startGame() {
    this.human.placeShipsRandom();
    this.computer.placeShipsRandom();
    this.#updateGameboard();
  }

  #updateGameboard() {
    this.domManager.renderBoard(this.human, this.humanElem);
    this.domManager.renderBoard(this.computer, this.computerElem);
  }
}

class DOMHelper {
  renderBoard(player, playerElem) {
    const gameboard = playerElem.querySelector(`.gameboard`);
    const boardMap = player.getBoardMap();

    gameboard.textContent = "";

    for (let [key, value] of boardMap.entries()) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      if (value.ship) cell.classList.add("occupied");
      if (value.isShot) cell.classList.add("attacked");

      cell.dataset.coords = key;

      gameboard.append(cell);
    }
  }
}
