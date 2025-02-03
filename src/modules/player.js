import { Ship } from "./ship.js";
import { Gameboard } from "./gameboard.js";

export class Player {
  #gameboard = new Gameboard();

  availableShips = [
    new Ship(5),
    new Ship(4),
    new Ship(3),
    new Ship(3),
    new Ship(2),
  ];

  get placedShips() {
    return this.#gameboard.shipsData.map((value) => value.ship);
  }

  placeShip(shipIndex, coords) {
    if (shipIndex < 0 || shipIndex > 4) return false;

    const ship = this.availableShips[shipIndex];
    const [x, y] = coords;

    if (this.placedShips.includes(ship)) {
      return false;
    }

    try {
      this.#gameboard.placeShip(ship, x, y);
    } catch {
      return false;
    }

    return true;
  }

  placeShipsRandom() {}

  getBoardCellsData() {}
}
