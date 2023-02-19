class DrawingGrid {
  #screen = document.createElement("div");
  #history = document.createElement("div");
  #tileHistory = [];
  #colorPickerElement = document.createElement("input");
  static tileSize = 20;
  static color = "black";
  static colorPickerOpen = false;

  #toolbar = document.createElement("div");

  static mouseIsDown = false;
  #tiles = [];
  #colors = [];

  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.#initialise();
  }
  get colors() {
    return this.#colors;
  }
  #initialise() {
    document.onmousedown = this.docOnMousedown;
    document.onmouseup = this.docOnMouseup;

    this.#screen.classList.add("grid");

    this.#toolbar.style.display = "flex";
    this.#toolbar.classList.add("toolbar");

    const tools = document.createElement("div");
    tools.classList.add("toolbar-tools");

    tools.appendChild(
      new Tool(
        this.clearDrawing,
        "http://cdn.onlinewebfonts.com/svg/img_398870.png"
      ).getElement()
    );
    tools.appendChild(
      new Tool(
        this.undo,
        "https://cdn-icons-png.flaticon.com/512/60/60690.png"
      ).getElement()
    );
    tools.appendChild(
      new Tool(
        () => DrawingGrid.save(this),
        "https://www.seekpng.com/png/full/77-770209_png-file-save-icon-white-png.png"
      ).getElement()
    );
    tools.appendChild(
      new Tool(
        () => this.gum(),
        "https://cdn-icons-png.flaticon.com/512/1827/1827954.png"
      ).getElement()
    );
    this.#toolbar.appendChild(tools);

    //COLOR SIDE
    const colorList = document.createElement("div");
    colorList.classList.add("toolbar-colors");

    this.#history.classList.add("toolbar-color-history");

    this.#colorPickerElement.type = "color";
    this.#colorPickerElement.id = "colorpicker";
    this.#colorPickerElement.value = "#000000";

    this.#colorPickerElement.addEventListener("click", () => {
      DrawingGrid.colorPickerOpen = true;
    });
    this.#colorPickerElement.addEventListener("change", () => {
      this.#onColorChange(this.#colorPickerElement);
      DrawingGrid.colorPickerOpen = false;
    });
    this.#colorPickerElement.ariaLabel = "colorpicker";

    colorList.appendChild(this.#history);
    colorList.appendChild(this.#colorPickerElement);

    this.#toolbar.appendChild(colorList);

    this.load();
  }
  #updateColorHistory() {
    if (this.#colors.length > 20) this.#colors.shift();
    if (this.#history === null) return;

    this.#history.innerHTML = "";

    for (let prevColor of this.#colors) {
      const colorElement = document.createElement("div");
      colorElement.classList.add("color-previous");
      colorElement.style.backgroundColor = prevColor;
      colorElement.addEventListener("click", () => {
        this.setColor(prevColor);
      });

      this.#history.appendChild(colorElement);
    }
  }
  gum() {
    this.setColor("#FFFFFF");
  }
  setColor(color) {
    DrawingGrid.color = color;
    this.setColorPickerColor(color);
  }
  setColorPickerColor(color) {
    if (this.#colorPickerElement !== null)
      this.#colorPickerElement.value = color;
  }
  static save(grid) {
    let list = [];
    let counter = 0;
    for (let element of document.querySelectorAll(".grid-tiles-tile")) {
      if (
        element.style.backgroundColor !== "" &&
        element.style.backgroundColor !== "white"
      ) {
        let data = {
          index: counter,
          color: element.style.backgroundColor,
        };
        list.push(data);
      }
      counter++;
    }
    localStorage.setItem("drawing", JSON.stringify(list));
    localStorage.setItem("colors", grid.colors.toString());
    localStorage.setItem("lastcolor", DrawingGrid.color);

    const popup = new Popup(
      "success",
      "Drawing Saved",
      "Jouw tekening is opgeslagen!"
    );
    popup.show();
  }
  load() {
    //Load the drawing from before into the list
    const data = JSON.parse(localStorage.getItem("drawing"));
    if (data !== undefined) {
      this.#tiles = data;
    }

    //Load color history from local storage
    if (
      localStorage.getItem("colors") != null &&
      localStorage.getItem("colors") !== undefined &&
      localStorage.getItem("colors") !== "undefined"
    ) {
      this.#colors = localStorage.getItem("colors").split(",");
      this.#updateColorHistory();
    }
    //Load last color used from previous session
    if (localStorage.getItem("lastcolor") !== null) {
      const lastcolor = localStorage.getItem("lastcolor");
      this.setColor(lastcolor);
    }

    //Show popup that data has been loaded
    const popup = new Popup(
      "info",
      "Drawing Loaded",
      "Jouw tekening is geladen!"
    );
    popup.show();
  }
  undo() {
    for (let historyItem of DrawingGrid.tileHistory) {
      let color;
      if (historyItem.from === undefined || historyItem.from == "")
        color = "white";
      else color = historyItem.from;

      historyItem.element.style.backgroundColor = color;
    }
    DrawingGrid.tileHistory = [];

    const popup = new Popup(
      "success",
      "Undo Succesfull",
      "Je bent een stap terug gegaan!"
    );
    popup.show();
  }
  #onColorChange(colorpicker) {
    this.#colors.push(DrawingGrid.color);
    this.#updateColorHistory();

    DrawingGrid.color = colorpicker.value;
  }
  clearDrawing() {
    for (const element of document.querySelectorAll(".grid-tiles-tile")) {
      element.style.backgroundColor = "white";
    }
    const popup = new Popup(
      "warning",
      "Drawing Cleared",
      "Je hebt je tekening verwijderd"
    );
    popup.show();
  }
  showToolbar() {
    this.#toolbar.style.display = "flex";
  }
  hideToolbar() {
    this.#toolbar.style.display = "none";
  }
  draw() {
    const tiles = document.createElement("div");
    tiles.classList.add("grid-tiles");

    const tileAmount =
      (this.width / DrawingGrid.tileSize) *
      (this.height / DrawingGrid.tileSize);

    const tilesX = this.width + (this.width / DrawingGrid.tileSize) * 2;
    const tilesY = this.height + (this.height / DrawingGrid.tileSize) * 2;

    tiles.style.width = `${tilesX}px`;
    tiles.style.height = `${tilesY}px`;

    this.width = tilesX;
    this.height = tilesY;

    if (this.#tiles !== null && this.#tiles.length > 0) {
      let counter = 0;
      for (let i = 0; i < tileAmount; i++) {
        if (
          this.#tiles[counter] !== undefined &&
          this.#tiles[counter].index === i
        ) {
          const tile = new Tile(this.#tiles[counter].color);
          tiles.appendChild(tile.getElement());
          counter++;
        } else {
          const tile = new Tile();
          tiles.appendChild(tile.getElement());
        }
      }
    } else {
      for (let i = 0; i < tileAmount; i++) {
        const tile = new Tile();
        tiles.appendChild(tile.getElement());
      }
    }

    this.#screen.appendChild(tiles);
    this.#toolbar.style.width = `${this.width}px`;

    document.body.appendChild(this.#toolbar);
    document.body.appendChild(this.#screen);
  }
  drawTile() {}

  docOnMousedown(e) {
    e.preventDefault();

    DrawingGrid.mouseIsDown = true;
  }
  docOnMouseup(e) {
    e.preventDefault();
    DrawingGrid.mouseIsDown = false;
  }
}
