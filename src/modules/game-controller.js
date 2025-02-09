import { Player } from "./player.js";

export class GameController {
  #playing = false;
  started = false;
  ended = false;

  constructor(humanSelector, computerSelector, gameTextSelector) {
    this.humanElem = document.querySelector(humanSelector);
    this.computerElem = document.querySelector(computerSelector);

    const gameTextElem = document.querySelector(gameTextSelector);
    this.statusText = gameTextElem.querySelector(".status");

    this.statusText.textContent = "";

    this.domManager = new DOMHelper();
    this.human = new Player();
    this.computer = new Player();

    this.#updateAllGameboards();
  }

  startGame() {
    if (this.started) return;

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

    const turn = new GameTurn(this.computer);
    const turnResult = turn.play(coords.map((value) => parseInt(value)));
    this.#updateComputerGameboard();
    this.statusText.textContent = this.#generateTurnMessage(turnResult);

    if (turnResult.noShipsLeft) {
      this.ended = true;
      return;
    }

    this.#setComputerTurn();

    setTimeout(() => {
      const turn = new GameTurn(this.human);
      const turnResult = turn.play();
      this.#updateHumanGameboard();
      this.statusText.textContent = this.#generateTurnMessage(
        turnResult,
        false,
      );

      if (turnResult.noShipsLeft) {
        this.ended = true;
        return;
      }

      this.#setHumanTurn();
    }, 1000);
  }

  #generateTurnMessage(turnResult, human = true) {
    if (turnResult.noShipsLeft) {
      return human ? "You Won" : "Enemy Won";
    }
    if (turnResult.shipSunk) {
      return human
        ? `You sank the ${turnResult.attackedShip.name}`
        : `Enemy sank your ${turnResult.attackedShip.name}`;
    }
    if (turnResult.attackedShip) {
      return human ? "You hit a ship" : "Enemy hit a ship";
    }

    const randNumber = Math.floor(Math.random() * 15); // Random number between 0 and 15
    if (randNumber < 1) {
      return human ? "You hit a bunch of water" : "Enemy hit a fist, maybe";
    }

    return human ? "You missed" : "Enemy missed";
  }

  #setHumanTurn() {
    this.#playing = true;
  }

  #setComputerTurn() {
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

class GameTurn {
  constructor(targetPlayer) {
    this.targetPlayer = targetPlayer;
  }

  play(coords = null) {
    let attackedShip;

    if (coords) attackedShip = this.targetPlayer.receiveAttack(coords);
    else attackedShip = this.targetPlayer.receiveAttackRandom();

    return new GameTurnResult(this.targetPlayer, attackedShip);
  }
}

class GameTurnResult {
  constructor(player, attackedShip) {
    this.attackedShip = attackedShip;
    this.shipSunk = !!this.attackedShip && this.attackedShip.isSunk();
    this.noShipsLeft = player.allShipsSunk();
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

      if (value.ship) {
        cell.classList.add("occupied");
        if (!gameboard.classList.contains("hide") || value.ship.isSunk())
          cell.style.backgroundColor = value.ship.color;
      }

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
