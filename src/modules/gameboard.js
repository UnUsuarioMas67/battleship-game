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

  placeShip(ship, coords, vertical = false) {
    if (ship.length > this.size) {
      throw new Error("Ship too large");
    }

    if (this.shipsData.some((data) => data.ship === ship))
      throw new Error("Ship is already placed");

    this.#forCellsInRange(
      (cellCoords) => {
        if (!this.#isValidCell(cellCoords))
          throw new Error("Position is invalid");
        if (this.isCellOccupied(cellCoords))
          throw new Error("Position overlaps with another ship");
      },
      ship.length,
      coords,
      vertical,
    );

    this.shipsData.push({ ship, coords, vertical });
  }

  placeShipRandom(ship) {
    const availableSpots = this.#findAvailableSpots(ship);
    if (availableSpots.length === 0) return;

    const index = Math.floor(Math.random() * availableSpots.length);
    const { coords, vertical } = availableSpots[index];
    this.placeShip(ship, coords, vertical);
  }

  #findAvailableSpots(ship) {
    const result = [];

    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        if (this.isPlacementValid(ship, [x, y], false))
          result.push({ coords: [x, y], vertical: false });
        if (this.isPlacementValid(ship, [x, y], true))
          result.push({ coords: [x, y], vertical: true });
      }
    }

    return result;
  }

  isPlacementValid(ship, coords, vertical = false) {
    if (this.shipsData.some((data) => data.ship === ship)) return false;

    let result = true;

    this.#forCellsInRange(
      (cellCoords) => {
        if (!this.#isValidCell(cellCoords) || this.isCellOccupied(cellCoords))
          result = false;
      },
      ship.length,
      coords,
      vertical,
    );

    return result;
  }

  isCellOccupied(coords) {
    if (!this.#isValidCell(coords)) return null;

    const [x, y] = coords;

    for (let { ship, coords, vertical } of this.shipsData) {
      let result = null;

      this.#forCellsInRange(
        ([cellX, cellY]) => {
          if (cellX === x && cellY === y) {
            result = ship;
          }
        },
        ship.length,
        coords,
        vertical,
      );

      if (result) return result;
    }

    return null;
  }

  receiveAttack(coords) {
    if (this.isCellAttacked(coords))
      throw new Error("Attempted to hit the same coordinate twice");

    if (!this.#isValidCell(coords)) return; // TODO - Change this to throw an error instead

    const ship = this.isCellOccupied(coords);
    if (ship) ship.hit();

    this.shotsReceived.push(coords);
  }

  isAttackValid(coords) {
    if (this.isCellAttacked(coords) || !this.#isValidCell(coords)) return false;

    return true;
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

  getMap() {
    const cells = new Map();

    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        const data = {
          ship: this.isCellOccupied([x, y]),
          isShot: this.isCellAttacked([x, y]),
        };

        cells.set(`${x},${y}`, data);
      }
    }

    return cells;
  }

  #isValidCell(coords) {
    const [x, y] = coords;
    const validX = x >= 0 && x < this.#size;
    const validY = y >= 0 && y < this.#size;
    return validX && validY;
  }

  #forCellsInRange(fn, length, coords, vertical = false) {
    const [x, y] = coords;

    if (vertical) {
      for (let i = y; i < length + y; i++) {
        fn([x, i]);
      }
    } else {
      for (let i = x; i < length + x; i++) {
        fn([i, y]);
      }
    }
  }
}
