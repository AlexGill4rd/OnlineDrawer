class Popup {
  #popup = document.createElement("div");
  constructor(severity, title, message) {
    this.severity = severity;
    this.title = title;
    this.message = message;
    this.#init();
  }
  #init() {
    this.#popup.classList.add("popup");
    const image = document.createElement("img");
    switch (this.severity.toLowerCase()) {
      case "success":
        this.#popup.style.backgroundColor = "#4e9a51";
        image.src = "https://www.svgrepo.com/show/86058/check-mark.svg";
        break;
      case "error":
        this.#popup.style.backgroundColor = "#d84646";
        image.src =
          "https://icons-for-free.com/download-icon-error+outline+24px-131985189102283993_512.png";
        break;
      case "warning":
        this.#popup.style.backgroundColor = "#f68a1c";
        image.src = "https://cdn-icons-png.flaticon.com/512/1199/1199619.png";
        break;
      case "info":
        this.#popup.style.backgroundColor = "#1e95d6";
        image.src = "https://cdn-icons-png.flaticon.com/512/0/472.png";
        break;
    }
    this.#popup.appendChild(image);
    const infoContainer = document.createElement("div");
    infoContainer.classList.add("popup-container");

    const title = document.createElement("h2");
    title.classList.add("popup-title");
    title.innerHTML = this.title;
    infoContainer.appendChild(title);

    const message = document.createElement("p");
    message.classList.add("popup-message");
    message.innerHTML = this.message;
    infoContainer.appendChild(message);

    this.#popup.appendChild(infoContainer);
  }
  show() {
    document.body.appendChild(this.#popup);
    this.#popup.style.animation = "popup 2s ease-in-out";
    setTimeout(() => {
      this.#popup.remove();
    }, 2000);
  }
}
