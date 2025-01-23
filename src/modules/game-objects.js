class Ship {
  #hits = 0;
  #vertical;
  #length;

  constructor(length, vertical = false) {
    this.#length = length;
    this.#vertical = vertical;
  }

  get length() {
    return this.#length;
  }

  get isVertical() {
    return this.#vertical;
  }

  hit() {
    this.#hits++;
  }

  isSunk() {
    return this.#hits >= this.#length;
  }
}

export { Ship };
