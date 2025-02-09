export class Ship {
  #hits = 0;

  constructor(length, name = "Ship", color = "white") {
    this.length = length;
    this.name = name;
    this.color = color; // must be a valid css color
  }

  hit() {
    this.#hits++;
  }

  isSunk() {
    return this.#hits >= this.length;
  }
}
