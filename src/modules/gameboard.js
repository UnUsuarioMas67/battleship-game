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

    const [x, y] = coords;

    this.#forEachShipCell(ship, x, y, (px, py) => {
      if (!this.#isValidCell(px, py)) throw new Error("Position is invalid");
      if (this.isCellOccupied(px, py))
        throw new Error("Position overlaps with another ship");
    });

    this.shipsData.push({ ship, pos: { x, y } });
  }

  isPlacementValid(ship, x, y) {
    let result = true;

    this.#forEachShipCell(ship, x, y, (px, py) => {
      if (!this.#isValidCell(px, py) || this.isCellOccupied(px, py))
        result = false;
    });

    return result;
  }

  isCellOccupied(x, y) {
    if (!this.#isValidCell(x, y)) return null;

    for (let { ship, pos } of this.shipsData) {
      let result = null;

      this.#forEachShipCell(ship, pos.x, pos.y, (px, py) => {
        if (px === x && py === y) {
          result = ship;
        }
      });

      if (result) return result;
    }

    return null;
  }

  receiveAttack(x, y) {
    if (this.isCellAttacked(x, y))
      throw new Error("Attempted to hit the same coordinate twice");

    if (!this.#isValidCell(x, y)) return;

    const ship = this.isCellOccupied(x, y);
    if (ship) ship.hit();

    this.shotsReceived.push({ x, y });
  }

  isCellAttacked(x, y) {
    for (let coords of this.shotsReceived) {
      if (coords.x === x && coords.y === y) {
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

  #isValidCell(x, y) {
    const validX = x >= 0 && x < this.#size;
    const validY = y >= 0 && y < this.#size;
    return validX && validY;
  }

  #forEachShipCell(ship, x, y, fn) {
    if (ship.vertical) {
      for (let i = y; i < ship.length + y; i++) {
        fn(x, i);
      }
    } else {
      for (let i = x; i < ship.length + x; i++) {
        fn(i, y);
      }
    }
  }
}
