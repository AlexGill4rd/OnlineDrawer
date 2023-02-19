class Tool {
  #element = document.createElement("div");
  constructor(onClick, imageURL) {
    this.onClick = onClick;
    this.imageURL = imageURL;
  }
  getElement() {
    this.#element.classList.add("toolbar-tool");
    this.#element.addEventListener("click", () => this.onClick());
    const image = document.createElement("img");
    image.classList.add("tool");
    image.alt("tool for drawing");
    image.src = this.imageURL;
    this.#element.appendChild(image);

    return this.#element;
  }
}
