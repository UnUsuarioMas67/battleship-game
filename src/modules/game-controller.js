import { Player } from "./player.js";

export class GameController {
  #canPlay = false;

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
    if (this.#canPlay) return;

    this.human.placeShipsRandom();
    this.computer.placeShipsRandom();
    this.#updateGameboard();
    this.#canPlay = true;
  }

  playTurn(event) {
    if (!this.#canPlay) return;

    const cell = event.target;
    if (cell.classList.contains("attacked")) return;

    const coords = cell.dataset.coords.split(",");
    this.computer.receiveAttack(
      coords.map((value) => parseInt(value)),
    );

    this.#computerPlay();
    this.#updateGameboard();
  }

  #computerPlay() {
    this.human.receiveAttackRandom();
  }

  #updateGameboard() {
    this.domManager.renderBoard(this.human, this.humanElem);
    this.domManager.renderBoard(this.computer, this.computerElem, {
      controller: this,
      callback: this.playTurn,
    });
  }
}

class DOMHelper {
  renderBoard(player, playerElem, onClickParams = null) {
    const gameboard = playerElem.querySelector(`.gameboard`);
    const boardMap = player.getBoardMap();

    gameboard.textContent = "";

    for (let [key, value] of boardMap.entries()) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      if (value.ship) cell.classList.add("occupied");
      if (value.isShot) cell.classList.add("attacked");

      cell.dataset.coords = key;

      if (onClickParams && !value.isShot) {
        cell.addEventListener(
          "click",
          onClickParams.callback.bind(onClickParams.controller),
        );
      }

      gameboard.append(cell);
    }
  }
}
