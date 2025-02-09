import { Player } from "./player.js";

export class GameController {
  #playing = false;
  gameStarted = false;

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

    this.#updateAllGameboards();
  }

  startGame() {
    if (this.gameStarted) return;

    this.human.placeShipsRandom();
    this.computer.placeShipsRandom();
    this.#updateAllGameboards();

    this.gameStarted = true;
    this.#setHumanTurn();
  }

  playTurn(event) {
    if (!this.#playing) return;

    const cell = event.target;
    if (cell.classList.contains("attacked")) return;

    const coords = cell.dataset.coords.split(",");
    const ship = this.computer.receiveAttack(
      coords.map((value) => parseInt(value)),
    );

    this.#updateComputerGameboard();
    if (this.computer.allShipsSunk()) {
      this.statusText.textContent = "You Won";
      this.#playing = false;
      return;
    } else if (ship) {
      this.statusText.textContent = ship.isSunk()
        ? "You sunk a ship"
        : "You hit a ship";
    } else {
      this.statusText.textContent = "You missed";
    }

    this.#setComputerTurn();

    setTimeout(() => {
      const ship = this.human.receiveAttackRandom();

      this.#updateHumanGameboard();
      if (this.computer.allShipsSunk()) {
        this.statusText.textContent = "You Lost";
        this.#playing = false;
        return;
      } else if (ship) {
        this.statusText.textContent = ship.isSunk()
          ? "Enemy sunk your ships"
          : "Enemy hit your ship";
      } else {
        this.statusText.textContent = "Enemy missed";
      }

      this.#setHumanTurn();
    }, 1000);
  }

  #setHumanTurn() {
    this.turnIndicator.textContent = "Your turn";
    this.#playing = true;
  }

  #setComputerTurn() {
    this.turnIndicator.textContent = "Enemy turn";
    this.#playing = false;
  }

  #updateAllGameboards() {
    this.domManager.renderBoard(this.human, this.humanElem);
    this.domManager.renderBoard(this.computer, this.computerElem, {
      controller: this,
      callback: this.playTurn,
    });
  }

  #updateComputerGameboard() {
    this.domManager.renderBoard(this.computer, this.computerElem, {
      controller: this,
      callback: this.playTurn,
    });
  }

  #updateHumanGameboard() {
    this.domManager.renderBoard(this.human, this.humanElem);
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
