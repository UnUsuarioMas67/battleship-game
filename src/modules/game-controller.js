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

  playTurn(event) {
    const cell = event.target;
    if (!cell.classList.contains("attacked")) {
      const coords = cell.dataset.coords.split(",");
      this.computer.receiveAttack(coords);
      this.#updateGameboard();
    }
  }

  #updateGameboard() {
    this.domManager.renderBoard(this.human, this.humanElem, this);
    this.domManager.renderBoard(
      this.computer,
      this.computerElem,
      this,
      this.playTurn,
    );
  }
}

class DOMHelper {
  renderBoard(player, playerElem, controller, onClick = null) {
    const gameboard = playerElem.querySelector(`.gameboard`);
    const boardMap = player.getBoardMap();

    gameboard.textContent = "";

    for (let [key, value] of boardMap.entries()) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      if (value.ship) cell.classList.add("occupied");
      if (value.isShot) cell.classList.add("attacked");

      cell.dataset.coords = key;

      if (onClick && !value.isShot) {
        cell.addEventListener("click", onClick.bind(controller));
      }

      gameboard.append(cell);
    }
  }
}
