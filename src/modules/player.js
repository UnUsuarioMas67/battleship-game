import { Ship } from "./ship.js";
import { Gameboard } from "./gameboard.js";

export class Player {
  #gameboard = new Gameboard();

  availableShips = [
    new Ship(5, "Carrier", "indigo"),
    new Ship(4, "Battleship", "darkolivegreen"),
    new Ship(3, "Destroyer", "darkred"),
    new Ship(3, "Submarine", "goldenrod"),
    new Ship(2, "Patrol Boat", "deepskyblue"),
  ];

  get placedShips() {
    return this.#gameboard.shipsData.map((value) => value.ship);
  }

  placeShip(shipIndex, coords, vertical) {
    if (shipIndex < 0 || shipIndex > 4) return false;

    const ship = this.availableShips[shipIndex];

    if (!this.#gameboard.isPlacementValid(ship, coords, vertical)) {
      return false;
    }

    try {
      this.#gameboard.placeShip(ship, coords, vertical);
    } catch {
      return false;
    }

    return true;
  }

  placeShipsRandom() {
    for (let ship of this.availableShips) {
      this.#gameboard.placeShipRandom(ship);
    }
  }

  receiveAttack(coords) {
    if (!this.#gameboard.isAttackValid(coords)) return null;

    try {
      return this.#gameboard.receiveAttack(coords);
    } catch {
      return null;
    }
  }

  receiveAttackRandom() {
    return this.#gameboard.receiveAttackRandom();
  }

  getBoardMap() {
    return this.#gameboard.getMap();
  }

  allShipsSunk() {
    return this.#gameboard.allShipsSunk();
  }
}
