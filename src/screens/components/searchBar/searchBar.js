class SearchBar {
  constructor(options) {
    this.container = options.container;
    this.data = options.data || [];
    this.placeholder = options.placeholder || "Buscar";
    this.onSearch = options.onSearch || ((term) => {});
    this.onClear = options.onClear || ((term) => {});

    this._build();
  }

  async _build() {
    // Load Searchbar HTML
    const res = await fetch("../components/searchBar/searchBar.html");
    const html = await res.text();
    this.container.innerHTML = html.trim();

    // Setup elements
    const searchInput = this.container.querySelector(".search-input");
    searchInput.placeholder = this.placeholder;

    // Setup events
    searchInput.addEventListener(
      "input",
      this.debounce((event) => {
        const value = (event.target.value || "").trim().toLowerCase();
        this.onSearch(value);
      }, 400)
    );

    this.container.querySelector(".clear-btn").addEventListener("click", () => {
      searchInput.value = "";
      this.onClear();
    });
  }
  
  // Simple debounce (waits until user stops typing for `delay` ms)
  debounce(fn, delay) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  }
}

module.exports = SearchBar;
