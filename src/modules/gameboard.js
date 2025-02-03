export class Gameboard {
  #size = 10;

  shipsData = [];
  shotsReceived = [];

  constructor(size = 10) {
    this.#size = size;
  }

  get size() {
    return this.#size;
  }

  placeShip(ship, coords) {
    if (ship.length > this.size) {
      throw new Error("Ship too large");
    }

    this.#forEachShipCell(ship, coords, (cellCoords) => {
      if (!this.#isValidCell(cellCoords))
        throw new Error("Position is invalid");
      if (this.isCellOccupied(cellCoords))
        throw new Error("Position overlaps with another ship");
    });

    this.shipsData.push({ ship, coords });
  }

  isPlacementValid(ship, coords) {
    let result = true;

    this.#forEachShipCell(ship, coords, (cellCoords) => {
      if (!this.#isValidCell(cellCoords) || this.isCellOccupied(cellCoords))
        result = false;
    });

    return result;
  }

  isCellOccupied(coords) {
    if (!this.#isValidCell(coords)) return null;

    const [x, y] = coords;

    for (let { ship, coords } of this.shipsData) {
      let result = null;

      this.#forEachShipCell(ship, coords, ([cellX, cellY]) => {
        if (cellX === x && cellY === y) {
          result = ship;
        }
      });

      if (result) return result;
    }

    return null;
  }

  receiveAttack(coords) {
    if (this.isCellAttacked(coords))
      throw new Error("Attempted to hit the same coordinate twice");

    if (!this.#isValidCell(coords)) return;

    const ship = this.isCellOccupied(coords);
    if (ship) ship.hit();

    this.shotsReceived.push(coords);
  }

  isCellAttacked(coords) {
    const [x, y] = coords;

    for (let [shotX, shotY] of this.shotsReceived) {
      if (shotX === x && shotY === y) {
        return true;
      }
    }

    return false;
  }

  allShipsSunk() {
    if (this.shipsData.length === 0) return false;

    for (let { ship } of this.shipsData) {
      if (!ship.isSunk()) return false;
    }

    return true;
  }

  #isValidCell(coords) {
    const [x, y] = coords;
    const validX = x >= 0 && x < this.#size;
    const validY = y >= 0 && y < this.#size;
    return validX && validY;
  }

  #forEachShipCell(ship, coords, fn) {
    const [x, y] = coords;

    if (ship.vertical) {
      for (let i = y; i < ship.length + y; i++) {
        fn([x, i]);
      }
    } else {
      for (let i = x; i < ship.length + x; i++) {
        fn([i, y]);
      }
    }
  }
}
