class Tile {
  #tileElement = document.createElement("div");
  #previousColor;
  #colorSet = false;

  constructor(color) {
    if (color !== undefined) this.#tileElement.style.backgroundColor = color;
  }

  getElement() {
    this.#tileElement.classList.add("grid-tiles-tile");
    this.#tileElement.style.width = `${DrawingGrid.tileSize}px`;
    this.#tileElement.style.height = `${DrawingGrid.tileSize}px`;

    this.#tileElement.addEventListener("mouseenter", () => this.#mouseEnter());
    this.#tileElement.addEventListener("mouseleave", () => this.#mouseLeave());

    this.#tileElement.addEventListener("mousedown", () =>
      this.#onTileClick(true)
    );
    this.#tileElement.addEventListener("mouseover", () => this.#onTileClick());

    return this.#tileElement;
  }
  #mouseEnter() {
    this.#previousColor = this.#tileElement.style.backgroundColor;
    if (!DrawingGrid.mouseIsDown && !DrawingGrid.colorPickerOpen) {
      this.#tileElement.style.backgroundColor = DrawingGrid.color;
    }
  }
  #mouseLeave() {
    if (!this.#colorSet && !DrawingGrid.mouseIsDown)
      this.#tileElement.style.backgroundColor = this.#previousColor;

    this.#colorSet = false;
  }
  #onTileClick(clicked) {
    if (clicked) DrawingGrid.tileHistory = [];
    else {
      this.#previousColor = this.#tileElement.style.backgroundColor;
    }

    if (
      (DrawingGrid.mouseIsDown || clicked) &&
      !this.#historyContainsElement(this.#tileElement) &&
      !DrawingGrid.colorPickerOpen
    ) {
      const data = {
        element: this.#tileElement,
        from: this.#previousColor,
        to: DrawingGrid.color,
      };

      this.#tileElement.style.backgroundColor = DrawingGrid.color;
      this.#colorSet = true;
      DrawingGrid.tileHistory.push(data);
    }
  }
  #historyContainsElement(element) {
    for (let item of DrawingGrid.tileHistory) {
      if (item.element === element) return true;
    }
    return false;
  }
}
