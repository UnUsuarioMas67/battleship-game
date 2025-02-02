import { test, expect } from "@jest/globals";
import { Ship } from "../modules/ship.js";

const ship1 = new Ship(3);
const ship2 = new Ship(5, true);

test("returns the correct length", () => {
  expect(ship1.length).toBe(3);
  expect(ship2.length).toBe(5);
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
