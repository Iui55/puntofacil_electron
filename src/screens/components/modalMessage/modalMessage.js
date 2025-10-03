class ModalMessage {
    constructor(options) {
        this.container = options.container;
        this.title = options.title;
        this.message = options.message;
        this.onClickOption = options.onClickOption || ((option) => {}); // receive true or false to aggre or cancel operation
        this._build();
    }

    async _build() {
        // Set modal in container
        const res = await fetch("../components/modalMessage/modalMessage.html");
        const html = await res.text();
        this.container.innerHTML = html.trim();
        
        // ---- UI Components ----
        this.modalEl = this.container.querySelector(".modal");
        this.titleEl = this.container.querySelector("h2");
        this.messageEl = this.container.querySelector("p");
        this.agreeBtn = this.container.querySelector(".modal-actions > button:first-child");
        this.cancelBtn = this.container.querySelector(".modal-actions > button:last-child");
        this._setting({title: this.title, message: this.message, onClickOption: this.onClickOption})
    }

    _setting(options) {
      // Setting
      this.titleEl.textContent = options.title;
      this.messageEl.textContent = options.message;

      this.agreeBtn.addEventListener("click", () => {
        options.onClickOption(true);
        this.modalEl.style.display = "none";
      });
      this.cancelBtn.addEventListener("click", () => {
        options.onClickOption(false);
        this.modalEl.style.display = "none";
      });
    }

    show(options=null) {
        if (options !== null) {
            this._setting(options);
        }

        this.modalEl.style.display = "flex";
    }
}

module.exports = ModalMessage;
