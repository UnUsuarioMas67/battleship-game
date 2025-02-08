import { test, describe, expect, beforeEach } from "@jest/globals";
import { Ship } from "../modules/ship.js";
import { Player } from "../modules/player.js";

let player;

beforeEach(() => {
  player = new Player();
});

test("availableShips: contains exactly five ships with the expected values", () => {
  const expected = [
    new Ship(5),
    new Ship(4),
    new Ship(3),
    new Ship(3),
    new Ship(2),
  ];

  for (let i in player.availableShips) {
    const receivedShip = player.availableShips[i];
    const expectedShip = expected[i];
    expect(receivedShip.length).toBe(expectedShip.length);
  }
});

describe("placeShip() & placedShips", () => {
  test("placedShips: is initially empty", () => {
    expect(player.placedShips).toEqual([]);
  });

  test("can place a ship from the availableShips list", () => {
    player.placeShip(0, [0, 0]);
    expect(player.placedShips).toContainEqual(player.availableShips[0]);

    player.placeShip(1, [0, 2]);
    expect(player.placedShips).toContainEqual(player.availableShips[1]);

    player.placeShip(2, [0, 4]);
    expect(player.placedShips).toContainEqual(player.availableShips[2]);
  });

  test("doesn't throw if the coordinates are invalid", () => {
    expect(() => player.placeShip(3, [5, -1])).not.toThrow();
  });

  test("returns true if the ship is successfully placed", () => {
    expect(player.placeShip(3, [5, 1])).toBe(true);
  });

  test("returns false if the placement is invalid", () => {
    expect(player.placeShip(3, [5, -1])).toBe(false);
  });

  test("returns false if shipIndex is out of range", () => {
    expect(player.placeShip(5, [5, 1])).toBe(false);
  });

  test("doesn't allow indexes outside of range (0-4)", () => {
    const result = player.placeShip(7, [0, 0]);
    expect(result).toBe(false);
  });
});

test("placeShipRandom: places all available ships on the gameboard", () => {
  player.placeShipsRandom();
  for (let ship of player.availableShips) {
    expect(player.placedShips).toContain(ship);
  }
});

describe("recieveAttack()", () => {
  test("attacks the given coordinates", () => {
    const attackCoords = [
      [0, 0],
      [5, 5],
      [7, 6],
    ];
    attackCoords.forEach((c) => player.receiveAttack(c));

    const map = player.getBoardMap();
    attackCoords.forEach((c) => {
      const value = map.get(c.join(","));
      expect(value.isShot).toBe(true);
    });
  });

  test("doesn't throw if the coordinates are invalid", () => {
    const attackCoords = [
      [4, 4],
      [6, -7],
      [4, 4], // duplicate coordinates are also invalid
    ];

    attackCoords.forEach((c) => {
      expect(() => player.receiveAttack(c)).not.toThrow();
    });
  });

  test("returns the ship it hits", () => {
    player.placeShip(0, [0, 0], false);
    expect(player.receiveAttack([2, 0])).toBe(player.availableShips[0]);
  });

  test("returns null if it doesn't hit any ship", () => {
    player.placeShip(0, [0, 0], false);
    expect(player.receiveAttack([0, 2])).toBe(null);
  });

  test("returns null if the coordinates are invalid", () => {
    player.receiveAttack([1, 1]);
    expect(player.receiveAttack([1, 1])).toBe(null); // duplicate coordinates are also invalid
    expect(player.receiveAttack([-1, -1])).toBe(null);
  });
});
