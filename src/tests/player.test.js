import { test, expect, beforeEach } from "@jest/globals";
import { Ship } from "../modules/ship.js";
import { Player } from "../modules/player.js";

let player;

beforeEach(() => {
  player = new Player();
});

test("availableShips should contain exactly five ships with the expected values", () => {
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
