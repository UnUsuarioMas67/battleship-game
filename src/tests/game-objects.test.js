import { describe, test, expect } from "@jest/globals";
import { Ship } from "../modules/game-objects.js";

describe("Ship class", () => {
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
    let hits = 0;

    ship1.hit();
    console.log(`${++hits} hit${hits === 1 ? "" : "s"} taken`);
    expect(ship1.isSunk()).toBe(false);

    ship1.hit();
    console.log(`${++hits} hit${hits === 1 ? "" : "s"} taken`);
    expect(ship1.isSunk()).toBe(false);

    ship1.hit();
    console.log(`${++hits} hit${hits === 1 ? "" : "s"} taken`);
    expect(ship1.isSunk()).toBe(true);
  });
});
