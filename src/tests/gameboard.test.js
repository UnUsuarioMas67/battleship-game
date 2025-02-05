import { describe, test, expect, beforeEach } from "@jest/globals";
import { Ship } from "../modules/ship.js";
import { Gameboard } from "../modules/gameboard.js";

let gameboard;
beforeEach(() => (gameboard = new Gameboard()));

describe("placeShip()", () => {
  test("can place a ship on specific coordinates", () => {
    const ship = new Ship(3);

    gameboard.placeShip(ship, [3, 5], false);

    expect(gameboard.shipsData).toContainEqual({
      ship: ship,
      coords: [3, 5],
      vertical: false,
    });
  });

  test("works with vertical ships", () => {
    const ship = new Ship(5);
    gameboard.placeShip(ship, [0, 2], true);
    expect(gameboard.shipsData).toContainEqual({
      ship: ship,
      coords: [0, 2],
      vertical: true,
    });
  });

  test("allow vertical argument to be omitted", () => {
    const ship = new Ship(3);

    gameboard.placeShip(ship, [3, 5]);

    expect(gameboard.shipsData).toContainEqual({
      ship: ship,
      coords: [3, 5],
      vertical: false,
    });
  });

  test("x and y cannot be lesser than 0 or, equal or greater than gameboard size", () => {
    const ship = new Ship(2);
    expect(() => gameboard.placeShip(ship, [11, -5])).toThrow(
      "Position is invalid",
    );
  });

  test("not allow position where the ship's length extends outside the board", () => {
    // horizontal ship
    const ship1 = new Ship(3);
    expect(() => gameboard.placeShip(ship1, [8, 6])).toThrow(
      "Position is invalid",
    );

    // vertical ship
    const ship2 = new Ship(5);
    expect(() => gameboard.placeShip(ship2, [3, 7], true)).toThrow(
      "Position is invalid",
    );
  });

  test("cannot place ships with length value larger than the board's size", () => {
    const ship = new Ship(11);
    expect(() => gameboard.placeShip(ship, [0, 7])).toThrow("Ship too large");
  });

  test("doesn't allow to place the same ship twice", () => {
    const ship = new Ship(4);
    gameboard.placeShip(ship, [0, 7]);
    expect(() => gameboard.placeShip(ship, [2, 5], true)).toThrow(
      "Ship is already placed",
    );
  });
});

describe("placeShipRandom()", () => {
  test("places a ship on a random position of the board", () => {
    const ship = new Ship(4);
    gameboard.placeShipRandom(ship);
    expect(
      gameboard.shipsData.find((data) => data.ship === ship),
    ).not.toBeUndefined();
  });

  test("doesn't get stuck if it can't find a spot to place the ship", () => {
    for (let i = 0; i <= 20; i++) {
      const ship = new Ship(5);
      gameboard.placeShipRandom(ship);

      if (!gameboard.shipsData.find((data) => data.ship === ship)) break;
    }
  });
});

describe("isPlacementValid()", () => {
  test("returns true is the placement is legal", () => {
    const ship = new Ship(3);
    expect(gameboard.isPlacementValid(ship, [3, 5])).toBe(true);
  });

  test("works with vertical ships", () => {
    const ship = new Ship(5);
    expect(gameboard.isPlacementValid(ship, [0, 2], true)).toBe(true);
  });

  test("returns false is the position is invalid", () => {
    const ship = new Ship(2);
    expect(gameboard.isPlacementValid(ship, [11, -5])).toBe(false);
  });

  test("returns false if the ship's length would extends outside the board", () => {
    // horizontal ship
    const ship1 = new Ship(3);
    expect(gameboard.isPlacementValid(ship1, [8, 6])).toBe(false);

    // vertical ship
    const ship2 = new Ship(5);
    expect(gameboard.isPlacementValid(ship2, [3, 7], true)).toBe(false);
  });

  test("returns false if the ship's length is larger than the board's size", () => {
    const ship = new Ship(11);
    expect(gameboard.isPlacementValid(ship, [0, 7])).toBe(false);
  });

  test("doesn't allow to place the same ship twice", () => {
    const ship = new Ship(4);
    gameboard.placeShip(ship, [0, 7]);
    expect(gameboard.isPlacementValid(ship, [2, 5], true)).toBe(false);
  });
});

describe("isCellOccupied()", () => {
  test("returns the ship at the given coordinates", () => {
    const ship = new Ship(3);
    gameboard.placeShip(ship, [4, 4]);

    expect(gameboard.isCellOccupied([4, 4])).toBe(ship);
    expect(gameboard.isCellOccupied([5, 4])).toBe(ship);
    expect(gameboard.isCellOccupied([6, 4])).toBe(ship);
  });

  test("returns null if coordinates are vacant", () => {
    const ship = new Ship(3);
    gameboard.placeShip(ship, [4, 4]);

    expect(gameboard.isCellOccupied([6, 4])).toBe(ship);
    expect(gameboard.isCellOccupied([7, 4])).toBeNull();
  });

  test("works with vertical ships", () => {
    const ship = new Ship(3);
    gameboard.placeShip(ship, [6, 2], true);

    expect(gameboard.isCellOccupied([6, 2])).toBe(ship);
    expect(gameboard.isCellOccupied([6, 3])).toBe(ship);
    expect(gameboard.isCellOccupied([6, 4])).toBe(ship);
    expect(gameboard.isCellOccupied([6, 5])).toBeNull();
  });

  test("works with any length", () => {
    const ship1 = new Ship(2);
    gameboard.placeShip(ship1, [3, 4], true);

    expect(gameboard.isCellOccupied([3, 4])).toBe(ship1);
    expect(gameboard.isCellOccupied([3, 5])).toBe(ship1);

    const ship2 = new Ship(3);
    gameboard.placeShip(ship2, [2, 2]);

    expect(gameboard.isCellOccupied([2, 2])).toBe(ship2);
    expect(gameboard.isCellOccupied([3, 2])).toBe(ship2);
    expect(gameboard.isCellOccupied([4, 2])).toBe(ship2);

    const ship3 = new Ship(4);
    gameboard.placeShip(ship3, [5, 7]);

    expect(gameboard.isCellOccupied([5, 7])).toBe(ship3);
    expect(gameboard.isCellOccupied([6, 7])).toBe(ship3);
    expect(gameboard.isCellOccupied([7, 7])).toBe(ship3);
    expect(gameboard.isCellOccupied([8, 7])).toBe(ship3);
  });
});

test("cannot place ships on occupied positions", () => {
  const ship1 = new Ship(3);
  gameboard.placeShip(ship1, [5, 5]);

  const ship2 = new Ship(5);
  expect(() => gameboard.placeShip(ship2, [6, 3], true)).toThrow(
    "Position overlaps with another ship",
  );
});

describe("receiveAttack()", () => {
  test("records attack coordinates", () => {
    gameboard.receiveAttack([0, 0]);
    expect(gameboard.shotsReceived).toContainEqual([0, 0]);

    gameboard.receiveAttack([3, 3]);
    expect(gameboard.shotsReceived).toContainEqual([3, 3]);

    gameboard.receiveAttack([6, 6]);
    expect(gameboard.shotsReceived).toContainEqual([6, 6]);
  });

  test("cannot attack the same coordinates twice", () => {
    gameboard.receiveAttack([3, 8]);
    expect(() => gameboard.receiveAttack([3, 8])).toThrow(
      "Attempted to hit the same coordinate twice",
    );
  });

  test("ignores invalid coordinates", () => {
    gameboard.receiveAttack([-5, 3]);
    expect(gameboard.shotsReceived).not.toContainEqual([-5, 3]);
  });

  test("can attack ships and sink them if all cells are hit", () => {
    const ship = new Ship(3);

    gameboard.placeShip(ship, [0, 0], true);
    gameboard.receiveAttack([0, 0]);
    gameboard.receiveAttack([0, 1]);
    gameboard.receiveAttack([0, 2]);

    expect(ship.isSunk()).toBe(true);
  });
});

describe("allShipsSunk()", () => {
  test("returns true if all ships are sunk", () => {
    const ship1 = new Ship(3);
    gameboard.placeShip(ship1, [0, 0], true);
    const ship2 = new Ship(3);
    gameboard.placeShip(ship2, [4, 2]);

    gameboard.receiveAttack([0, 0]);
    gameboard.receiveAttack([0, 1]);
    gameboard.receiveAttack([0, 2]);
    expect(gameboard.allShipsSunk()).toBe(false);

    gameboard.receiveAttack([4, 2]);
    gameboard.receiveAttack([5, 2]);
    gameboard.receiveAttack([6, 2]);
    expect(gameboard.allShipsSunk()).toBe(true);
  });

  test("returns false if there are no ships", () => {
    expect(gameboard.allShipsSunk()).toBe(false);
  });
});

describe("getMap()", () => {
  test("returns a map containing the cell data", () => {
    const map = gameboard.getMap();

    expect(map.get("0, 0")).toEqual({ ship: null, isShot: false });
    expect(map.get("4, 7")).toEqual({ ship: null, isShot: false });
    expect(map.get("9, 9")).toEqual({ ship: null, isShot: false });
  });

  describe("works with placed ships", () => {
    const ship = new Ship(3);

    test("horizontal ships", () => {
      gameboard.placeShip(ship, [0, 0]);

      const map = gameboard.getMap();
      expect(map.get("0, 0")).toEqual({ ship, isShot: false });
      expect(map.get("1, 0")).toEqual({ ship, isShot: false });
      expect(map.get("2, 0")).toEqual({ ship, isShot: false });
    });

    test("vertical ships", () => {
      gameboard.placeShip(ship, [0, 0], true);

      const map = gameboard.getMap();
      expect(map.get("0, 0")).toEqual({ ship, isShot: false });
      expect(map.get("0, 1")).toEqual({ ship, isShot: false });
      expect(map.get("0, 2")).toEqual({ ship, isShot: false });
    });
  });

  test("works with attacks", () => {
    gameboard.receiveAttack([0, 0]);
    gameboard.receiveAttack([9, 9]);

    const map = gameboard.getMap();
    expect(map.get("0, 0")).toEqual({ ship: null, isShot: true });
    expect(map.get("9, 9")).toEqual({ ship: null, isShot: true });
  });

  test("works with attacks on ships", () => {
    const ship = new Ship(3);

    gameboard.placeShip(ship, [1, 3]);

    gameboard.receiveAttack([1, 3]);
    gameboard.receiveAttack([2, 3]);
    gameboard.receiveAttack([2, 4]);

    const map = gameboard.getMap();
    expect(map.get("1, 3")).toEqual({ ship, isShot: true });
    expect(map.get("2, 3")).toEqual({ ship, isShot: true });
    expect(map.get("3, 3")).toEqual({ ship, isShot: false });
    expect(map.get("2, 4")).toEqual({ ship: null, isShot: true });
  });

  test("entries are in expected order when iterated through", () => {
    const map = gameboard.getMap();
    const iterator = map.keys();

    for (let y = 0; y < gameboard.size; y++) {
      for (let x = 0; x < gameboard.size; x++) {
        const key = iterator.next().value;
        expect(key).toBe(`${x}, ${y}`);
      }
    }
  });
});
