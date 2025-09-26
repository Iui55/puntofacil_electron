class SearchBar {
  constructor(options) {
    this.container = options.container;
    this.data = options.data || [];
    // this.getLabel = options.getLabel || ((x) => x.toString());
    // this.onSelect = options.onSelect || ((item) => {});
    
    this.placeholder = options.placeholder || "Buscar";
    this.onSearch = options.onSearch || ((term) => {});
    this.onClear = options.onSearch || ((term) => {});
    
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
    searchInput.addEventListener("input", (e) => {
        const value = (e.target.value || "").trim().toLowerCase();
        this.onSearch(value);
    });

    this.container
      .querySelector(".clear-btn")
      .addEventListener("click", () => {
        searchInput.value = "";
        this.onClear();
      });
  }
}

module.exports = SearchBar;
