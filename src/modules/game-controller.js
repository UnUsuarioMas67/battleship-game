import { Player } from "./player.js";

export class GameController {
  started = false;
  #currentTurn = "none";

  constructor(humanSelector, computerSelector, gameTextSelector) {
    this.humanElem = document.querySelector(humanSelector);
    this.computerElem = document.querySelector(computerSelector);
    this.gameText = document.querySelector(gameTextSelector);

    this.domManager = new DOMHelper();

    this.#initialize();
  }

  get currentTurn() {
    return this.#currentTurn;
  }

  // options: "human", "computer"
  set currentTurn(who) {
    if (who !== "human" && who !== "computer") return;

    this.#currentTurn = who;
    this.#setHoverEffect(who === "human");
  }

  startGame() {
    if (this.started) return;

    this.human.placeShipsRandom();
    this.computer.placeShipsRandom();
    this.#updateGameboard("both");

    this.started = true;
    this.currentTurn = "human";
    this.domManager.addMessage("Game Started", this.gameText);
  }

  reset() {
    if (this.timeout) clearTimeout(this.timeout);

    this.#initialize();
  }

  #initialize() {
    this.started = false;

    this.gameText.textContent = "";

    this.human = new Player();
    this.computer = new Player();

    this.#updateGameboard("both");
    this.#setHoverEffect(false);
  }

  #endGame() {
    this.started = false;
    this.#setHoverEffect(false);
  }

  #onCellClick(event) {
    if (this.currentTurn !== "human" || !this.started) return;

    const cell = event.target;
    if (cell.classList.contains("attacked")) return;

    const coords = cell.dataset.coords.split(",");

    if (
      this.#playTurn(
        this.currentTurn,
        coords.map((value) => parseInt(value)),
      )
    ) {
      this.#endGame();
      return;
    }

    this.currentTurn = "computer";

    this.timeout = setTimeout(() => {
      if (this.#playTurn(this.currentTurn)) {
        this.#endGame();
        return;
      }

      this.currentTurn = "human";
    }, 1000);
  }

  // options: "human", "computer"
  #playTurn(who, coords = null) {
    let target;
    if (who === "human") target = this.computer;
    else if (who === "computer") target = this.human;
    else return;

    const turn = new GameTurn(target);
    const turnResult = turn.play(coords);

    this.#updateGameboard(who === "human" ? "computer" : "human");
    this.domManager.addMessage(
      this.#generateTurnMessage(turnResult, who === "human"),
      this.gameText,
    );

    if (turnResult.noShipsLeft) {
      return true;
    }

    return false;
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

  #setHoverEffect(enabled) {
    const gameboard = this.computerElem.querySelector(".gameboard");

    if (enabled) gameboard.classList.add("clickable");
    else gameboard.classList.remove("clickable");
  }

  // options: "human", "computer", "both"
  #updateGameboard(who) {
    if (who === "human" || who === "both")
      this.domManager.renderBoard(this.human, this.humanElem);

    if (who === "computer" || who === "both")
      this.domManager.renderBoard(this.computer, this.computerElem, {
        controller: this,
        callback: this.#onCellClick,
      });
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

  addMessage(message, gameText) {
    const p = document.createElement("p");
    p.classList.add("message");
    p.textContent = message;

    gameText.append(p);
    gameText.scrollTo({
      top: gameText.scrollHeight,
      behavior: "instant",
    });
  }
}
