import { describe, test, expect, beforeEach } from "@jest/globals";
import { Ship, Gameboard } from "../modules/game-objects.js";

describe("Ship", () => {
  const ship1 = new Ship(3);
  const ship2 = new Ship(5, true);

  test("returns the correct length", () => {
    expect(ship1.length).toBe(3);
    expect(ship2.length).toBe(5);
  });

  test("isVertical returns the proper value", () => {
    expect(ship1.isVertical).toBe(false);
    expect(ship2.isVertical).toBe(true);
  });

  test("takes damage and is sunk when the amount of hits equals length", () => {
    // takes 3 hits to sink
    ship1.hit();
    expect(ship1.isSunk()).toBe(false);

    ship1.hit();
    expect(ship1.isSunk()).toBe(false);

    ship1.hit();
    expect(ship1.isSunk()).toBe(true);
  });
});

describe("Gameboard", () => {
  let gameboard;
  beforeEach(() => (gameboard = new Gameboard()));

  describe("placeShip()", () => {
    test("can place a ship on specific coordinates", () => {
      const ship1 = new Ship(3);
      const ship2 = new Ship(5, true);

      gameboard.placeShip(ship1, 3, 5);
      expect(gameboard.shipList).toContainEqual({
        ship: ship1,
        pos: { x: 3, y: 5 },
      });

      gameboard.placeShip(ship2, 0, 2);
      expect(gameboard.shipList).toContainEqual({
        ship: ship2,
        pos: { x: 0, y: 2 },
      });
    });

    test("x and y cannot be lesser than 0 or, equal or greater than gameboard size", () => {
      const ship = new Ship(2);
      expect(() => gameboard.placeShip(ship, 11, -5)).toThrow(
        "Position is invalid",
      );
    });

    test("not allow position where the ship's length extends outside the board", () => {
      // horizontal ship
      const ship1 = new Ship(3);
      expect(() => gameboard.placeShip(ship1, 8, 6)).toThrow(
        "Position is invalid",
      );

      // vertical ship
      const ship2 = new Ship(5, true);
      expect(() => gameboard.placeShip(ship2, 3, 7)).toThrow(
        "Position is invalid",
      );
    });

    test("cannot place ships with length value larger than the board's size", () => {
      const ship = new Ship(11);
      expect(() => gameboard.placeShip(ship, 0, 7)).toThrow("Ship too large");
    });
  });

  describe("isOccupied()", () => {
    test("returns the ship at the given coordinates", () => {
      const ship = new Ship(3);
      gameboard.placeShip(ship, 4, 4);

      expect(gameboard.isOccupied(4, 4)).toBe(ship);
      expect(gameboard.isOccupied(5, 4)).toBe(ship);
      expect(gameboard.isOccupied(6, 4)).toBe(ship);
    });

    test("returns null if coordinates are vacant", () => {
      const ship = new Ship(3);
      gameboard.placeShip(ship, 4, 4);

      expect(gameboard.isOccupied(6, 4)).toBe(ship);
      expect(gameboard.isOccupied(7, 4)).toBeNull();
    });

    test("works with vertical ships", () => {
      const ship = new Ship(3, true);
      gameboard.placeShip(ship, 6, 2);

      expect(gameboard.isOccupied(6, 2)).toBe(ship);
      expect(gameboard.isOccupied(6, 3)).toBe(ship);
      expect(gameboard.isOccupied(6, 4)).toBe(ship);
      expect(gameboard.isOccupied(6, 5)).toBeNull();
    });

    test("works with any length", () => {
      const ship1 = new Ship(2, true);
      gameboard.placeShip(ship1, 3, 4);

      expect(gameboard.isOccupied(3, 4)).toBe(ship1);
      expect(gameboard.isOccupied(3, 5)).toBe(ship1);

      const ship2 = new Ship(3);
      gameboard.placeShip(ship2, 2, 2);

      expect(gameboard.isOccupied(2, 2)).toBe(ship2);
      expect(gameboard.isOccupied(3, 2)).toBe(ship2);
      expect(gameboard.isOccupied(4, 2)).toBe(ship2);

      const ship3 = new Ship(4);
      gameboard.placeShip(ship3, 5, 7);

      expect(gameboard.isOccupied(5, 7)).toBe(ship3);
      expect(gameboard.isOccupied(6, 7)).toBe(ship3);
      expect(gameboard.isOccupied(7, 7)).toBe(ship3);
      expect(gameboard.isOccupied(8, 7)).toBe(ship3);
    });
  });

  test("cannot place ships on occupied positions", () => {
    const ship1 = new Ship(3);
    gameboard.placeShip(ship1, 5, 5);

    const ship2 = new Ship(5, true);
    expect(() => gameboard.placeShip(ship2, 6, 3)).toThrow(
      "Position overlaps with another ship",
    );
  });

  describe("receiveAttack()", () => {
    test("records attack coordinates", () => {
      gameboard.receiveAttack(0, 0);
      expect(gameboard.hitCoords).toContainEqual({ x: 0, y: 0 });

      gameboard.receiveAttack(3, 3);
      expect(gameboard.hitCoords).toContainEqual({ x: 3, y: 3 });

      gameboard.receiveAttack(6, 6);
      expect(gameboard.hitCoords).toContainEqual({ x: 6, y: 6 });
    });

    test("cannot attack the same coordinates twice", () => {
      gameboard.receiveAttack(3, 8);
      expect(() => gameboard.receiveAttack(3, 8)).toThrow(
        "Attempted to hit the same coordinate twice",
      );
    });

    test("ignores invalid coordinates", () => {
      gameboard.receiveAttack(-5, 3);
      expect(gameboard.hitCoords).not.toContainEqual({ x: -5, y: 3 });
    });

    test("can attack ships and sink them if all cells are hit", () => {
      const ship = new Ship(3, true);

      gameboard.placeShip(ship, 0, 0);
      gameboard.receiveAttack(0, 0);
      gameboard.receiveAttack(0, 1);
      gameboard.receiveAttack(0, 2);

      expect(ship.isSunk()).toBe(true);
    });
  });

  describe("allShipsSunk()", () => {
    test("returns true if all ships are sunk", () => {
      const ship1 = new Ship(3, true);
      gameboard.placeShip(ship1, 0, 0);
      const ship2 = new Ship(3);
      gameboard.placeShip(ship2, 4, 2);

      gameboard.receiveAttack(0, 0);
      gameboard.receiveAttack(0, 1);
      gameboard.receiveAttack(0, 2);
      expect(gameboard.allShipsSunk()).toBe(false);

      gameboard.receiveAttack(4, 2);
      gameboard.receiveAttack(5, 2);
      gameboard.receiveAttack(6, 2);
      expect(gameboard.allShipsSunk()).toBe(true);
    });

    test("returns false if there are no ships", () => {
      expect(gameboard.allShipsSunk()).toBe(false);
    });
  });
});
