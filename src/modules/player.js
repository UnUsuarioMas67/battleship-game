import { Ship } from "./ship.js";
import { Gameboard } from "./gameboard.js";

export class Player {
  gameboard = new Gameboard();

  availableShips = [
    new Ship(5),
    new Ship(4),
    new Ship(3),
    new Ship(3),
    new Ship(2),
  ];

  get placedShips() {
    return this.gameboard.shipList.map((value) => value.ship);
  }

  placeShip() {}

  getBoardCellsData() {}
}
