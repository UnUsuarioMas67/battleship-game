export class Ship {
  #hits = 0;
  #length;

  constructor(length) {
    this.#length = length;
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
