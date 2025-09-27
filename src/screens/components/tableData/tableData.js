class TableData {
  constructor(options) {
    this.container = options.container;

    this.headers = options.headers || []; // Array of { label: "Header", key: "dataKey" }
    this.actions = options.actions || []; // Array of { label: "Action", class: "CSS class", onClick: (row) => {} }

    if (this.actions.length > 0)
      this.headers.push({ label: "Acciones", key: "__actions" });

    //
    this.onSelect = options.onSelect || ((item) => {});
    this.data = options.data || []; // Array of data objects

    this._build();
  }

  async _build() {
    // Load Searchbar HTML
    const res = await fetch("../components/tableData/tableData.html");
    const html = await res.text();
    this.container.innerHTML = html.trim();

    // Setup elements
    const headerEl = this.container.querySelector(".table-header");

    // Render headers
    headerEl.innerHTML = "";
    this.headers.forEach((h) => {
      const col = document.createElement("div");
      col.className = "col";
      col.textContent = h.label;
      headerEl.appendChild(col);
    });
    this.setData(this.data || []);
  }

  setData(data) {
    const bodyEl = this.container.querySelector(".table-body");
    this.data = data || [];

    bodyEl.innerHTML = "";
    if (this.data.length === 0) {
      bodyEl.innerHTML = `<div style="color:#6a7a9a">No hay datos para mostrar.</div>`;
      return;
    }

    this.data.forEach((rowData, rowIndex) => {
      const row = document.createElement("div");
      row.className = "table-row";
      row.addEventListener("click", () => {
        this.onSelect(rowData);
      });

      this.headers.forEach((h) => {
        const col = document.createElement("div");
        col.className = "col";
        if (h.key === "__actions") {
          // Render action buttons
          this.actions.forEach((action) => {
            const btn = document.createElement("button");
            btn.className = `action-btn ${action.class || ""}`;
            btn.textContent = action.label || "Action";
            btn.addEventListener("click", (e) => {
              e.stopPropagation(); // to avoid triggering row click
              action.onClick(rowData, rowIndex);
            });
            col.appendChild(btn);
          });
        } else {
          col.textContent = rowData[h.key] || "";
        }
        row.appendChild(col);
      });

      bodyEl.appendChild(row);
    });
  }
}

module.exports = TableData;
