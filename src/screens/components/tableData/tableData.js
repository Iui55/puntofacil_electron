class TableData {
  constructor(options) {
    this.container = options.container;

    this.headers = options.headers || []; // Array of { label: "Header", key: "dataKey" }
    this.actions = options.actions || []; // Array of { label: "Action", class: "CSS class", onClick: (row) => {} }

    if (this.actions.length > 0)
      this.headers.push({ label: "Acciones", key: "__actions" });

    this.onSelect = options.onSelect || ((item) => {});
    this.renderRow = options.renderRow || this.buildRow;
    
    this.loadData = options.loadData || (() => {}); // async function (page, pageSize) => { data: [], totalRecords: number }
    this.data = options.data || []; // Array of data objects
    this.totalRecords = options.totalRecords || 0;
    this.pageSize = options.pageSize || 10;
    this.currentPage = 1;

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
    // Render empty body
    this.container.querySelector(".table-body").innerHTML = `
      <div style="color:#6a7a9a">Cargando datos...</div>
    `;

    // Pagination elements
    this.pagesContainer = this.container.querySelector("#pagesContainer");
    this.prevPageBtn = this.container.querySelector("#prevPage");
    this.nextPageBtn = this.container.querySelector("#nextPage");

    this.prevPageBtn.addEventListener("click", async () => {
      if (this.currentPage <= 1) return;
      this.currentPage--;
      await this.loadData(this.currentPage, this.pageSize);
    });

    this.nextPageBtn.addEventListener("click", async () => {
      this.currentPage++;
      await this.loadData(this.currentPage, this.pageSize);
    });

    this.loadData(1, this.pageSize);
  }

  _buildPagination() {
    const totalPages = Math.ceil(this.totalRecords / this.pageSize) || 1;
    this.pagesContainer.innerHTML = "";

    // Disable/enable buttons
    this.prevPageBtn.disabled = this.currentPage <= 1;
    this.prevPageBtn.classList.toggle("disabled", this.prevPageBtn.disabled);

    this.nextPageBtn.disabled = this.currentPage >= totalPages;
    this.nextPageBtn.classList.toggle("disabled", this.nextPageBtn.disabled);

    // Create page buttons
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.className = "page-number";
      if (i === this.currentPage) btn.classList.add("active");

      btn.textContent = String(i);
      btn.addEventListener("click", async () => {
        if (i === this.currentPage) return;

        this.currentPage = i;
        await this.loadData(this.currentPage, this.pageSize);
        // this._buildPagination();
      });

      this.pagesContainer.appendChild(btn);
    }
  }

  setData(data, totalRecords = 0) {
    const bodyEl = this.container.querySelector(".table-body");
    this.data = data || [];
    this.totalRecords = totalRecords;

    bodyEl.innerHTML = "";
    this._buildPagination();
    if (this.data.length === 0) {
      bodyEl.innerHTML = `<div style="color:#6a7a9a">No hay datos para mostrar.</div>`;
      return;
    }

    this.data.forEach((rowData, rowIndex) => {
      const row = this.renderRow(rowData, rowIndex);

      bodyEl.appendChild(row);
    });
  }

  buildRow(data, index) {
    const row = document.createElement("div");
    row.className = "table-row";
    row.addEventListener("click", () => {
      this.onSelect(data);
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
            action.onClick(data, index);
          });
          col.appendChild(btn);
        });
      } else {
        col.textContent = data[h.key] || "";
      }
      row.appendChild(col);
    });
    return row;
  }
}

module.exports = TableData;
