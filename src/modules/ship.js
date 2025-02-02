export class Ship {
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
