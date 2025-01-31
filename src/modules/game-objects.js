class Ship {
  #hits = 0;
  #length;

  constructor(length, vertical = false) {
    this.#length = length;
    this.vertical = vertical;
  }

  get length() {
    return this.#length;
  }

  hit() {
    this.#hits++;
  }

  isSunk() {
    return this.#hits >= this.#length;
  }
}

class Gameboard {
  #size = 10;

  #shipList = [];
  #hitCoords = [];

  constructor(size = 10) {
    this.#size = size;
  }

  get size() {
    return this.#size;
  }

  get shipList() {
    // returns a deep copy of ships
    return structuredClone(this.#shipList);
  }

  get hitCoords() {
    return this.#hitCoords;
  }

  placeShip(ship, x, y) {
    if (ship.length > this.size) {
      throw new Error("Ship too large");
    }

    this.#forEachShipCell(ship, x, y, (px, py) => {
      if (!this.#isValidCell(px, py)) throw new Error("Position is invalid");
      if (this.isCellOccupied(px, py))
        throw new Error("Position overlaps with another ship");
    });

    this.#shipList.push({ ship, pos: { x, y } });
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

    for (let { ship, pos } of this.#shipList) {
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

    this.#hitCoords.push({ x, y });
  }

  isCellAttacked(x, y) {
    for (let coords of this.#hitCoords) {
      if (coords.x === x && coords.y === y) {
        return true;
      }
    }

    return false;
  }

  allShipsSunk() {
    if (this.#shipList.length === 0) return false;

    for (let { ship } of this.#shipList) {
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

class Player {
  #gameboard = new Gameboard();

  get gameboard() {
    return this.#gameboard;
  }
}

export { Ship, Gameboard, Player };
