import { test, expect } from "@jest/globals";
import { Ship } from "../modules/ship.js";

test("has name", () => {
  const ship1 = new Ship(5, "Destroyer");
  const ship2 = new Ship(2, "Patrol Boat");

  expect(ship1.name).toBe("Destroyer");
  expect(ship2.name).toBe("Patrol Boat");
});

test("has color", () => {
  const ship = new Ship(3, "Carrier", "black");
  expect(ship.color).toBe("black");
});

test("name and color are optional", () => {
  const ship = new Ship(3);
  expect(ship).not.toBeUndefined();
});

test("defaults values", () => {
  const ship = new Ship(4);
  expect(ship.name).toBe("Ship");
  expect(ship.color).toBe("white");
});

test("returns the correct length", () => {
  const ship1 = new Ship(3);
  const ship2 = new Ship(5);

  expect(ship1.length).toBe(3);
  expect(ship2.length).toBe(5);
});

test("takes damage and is sunk when the amount of hits equals length", () => {
  const ship = new Ship(3);

  // takes 3 hits to sink
  ship.hit();
  expect(ship.isSunk()).toBe(false);

  ship.hit();
  expect(ship.isSunk()).toBe(false);

  ship.hit();
  expect(ship.isSunk()).toBe(true);
});
