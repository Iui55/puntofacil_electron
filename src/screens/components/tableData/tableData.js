const lottie = require("lottie-web");
const { table } = require("pdfkit");

class TableData {
  constructor(options) {
    this.emptyAnimation = null;

    this.container = options.container;
    this.tableBoxClass =
      options.tableBoxClass !== undefined ? ` ${options.tableBoxClass}` : "";

    this.pathAnimation =
      options.pathAnimation || "../../assets/animations/empty-state.json";

    this.is_headers_enabled =
      options.showHeaders !== undefined ? options.showHeaders : true;

    this.headers = options.headers || []; // Array of { label: string, key: string, flex: number }
    this.is_actions_label_enabled = options.actions_label_enabled || false;
    this.actions_label = this.is_actions_label_enabled
      ? options.actions_label || "Acciones"
      : "";
    this.actions = options.actions || []; // Array of { label: "Action", class: "CSS class", onClick: (row) => {} }

    if (this.actions.length > 0)
      this.headers.push({ label: this.actions_label, key: "__actions" });

    this.renderRow = options.renderRow || this._renderRow; // Function to render a row
    this.rowClass = options.rowClass || "table-row"; // Default CSS class for rows
    this.colClass = options.colClass || "col"; // Default CSS class for columns
    this.mapRow = options.mapRow || null; // Function to map data before rendering

    this.onSelect = options.onSelect || ((item) => {}); // TODO: Function when row is selected

    this.data = options.data || []; // Array of data objects
    this.totalRecords = options.totalRecords || 0;
    this.loadData = options.loadData || (() => {}); // async function (page, pageSize) => { data: [], totalRecords: number }

    this.is_pagination_enabled =
      options.showPagination !== undefined ? options.showPagination : true;
    this.pageSize = this.is_pagination_enabled
      ? options.pageSize || 10
      : Number.MAX_VALUE; // Max number of records per page

    this.currentPage = 1;
    this._build();
  }

  async _build() {
    // Load Searchbar HTML
    const res = await fetch("../components/tableData/tableData.html");
    const html = await res.text();
    this.container.innerHTML = html.trim();

    // Setup elements
    this.container.querySelector(".table-box").className += this.tableBoxClass;
    const headerEl = this.container.querySelector(".table-header");

    // Render headers
    headerEl.innerHTML = "";
    if (this.is_headers_enabled) {
      this.headers.forEach((h) => {
        const col = document.createElement("div");
        col.className = "col";
        col.textContent = h.label;
        col.style.flex = h.flex || 1;
        headerEl.appendChild(col);
      });
    } else {
      headerEl.style.display = "none";
    }

    // Render empty body
    if (!this.data.length) this._emptyState();

    // Pagination elements
    if (this.is_pagination_enabled) {
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
    } else {
      this.container.querySelector(".paginator").style.display = "none";
    }
    // Initial data load
    this.loadData(1, this.pageSize);
  }

  _renderRow(originData, presenterData) {
    const row = document.createElement("div");
    row.className = this.rowClass;
    row.addEventListener("click", () => {
      this.onSelect(presenterData);
    });

    this.headers.forEach((h) => {
      const col = document.createElement("div");
      col.className = h.class || this.colClass;
      col.style.flex = h.flex || 1;
      if (h.key === "__actions") {
        col.className = `${this.colClass} actions`;
        col.style.flex = h.flex || 1;

        // Render action buttons
        this.actions.forEach((action) => {
          const btn = document.createElement("button");
          btn.title = action.label || "";
          btn.className = `action-btn ${action.class || ""}`;

          const icon = document.createElement("i");
          icon.className = action.icon || "";

          btn.appendChild(icon);
          btn.addEventListener("click", (e) => {
            e.stopPropagation(); // to avoid triggering row click
            action.onClick(originData);
          });
          col.appendChild(btn);
        });
      } else {
        col.textContent = presenterData[h.key];
      }
      row.appendChild(col);
    });
    return row;
  }

  _buildPagination() {
    if (!this.is_pagination_enabled) return;

    const totalPages = Math.ceil(this.totalRecords / this.pageSize) || 1;
    const showPages = 5;

    this.pagesContainer.innerHTML = "";

    // Disable/enable buttons
    this.prevPageBtn.disabled = this.currentPage <= 1;
    this.prevPageBtn.classList.toggle("disabled", this.prevPageBtn.disabled);

    this.nextPageBtn.disabled = this.currentPage >= totalPages;
    this.nextPageBtn.classList.toggle("disabled", this.nextPageBtn.disabled);

    // Create page buttons
    const buildTo =
      totalPages >= showPages + this.currentPage
        ? showPages + this.currentPage
        : totalPages;

    const buildFrom =
      totalPages - showPages <= 0
        ? 1
        : Math.min(totalPages - showPages, this.currentPage);

    for (let i = buildFrom; i <= buildTo; i++) {
      this.pagesContainer.appendChild(this._buildBtnPage(i));
    }

    if (buildTo != totalPages) {
      const btn = document.createElement("button");
      btn.classList.disabled = true;
      btn.className = "page-number";
      btn.textContent = "...";
      this.pagesContainer.appendChild(btn);
      this.pagesContainer.appendChild(this._buildBtnPage(totalPages));
    }
  }

  _buildBtnPage(numberPage) {
    const btn = document.createElement("button");
    btn.className = "page-number";
    if (numberPage === this.currentPage) btn.classList.add("active");

    btn.textContent = String(numberPage);
    btn.addEventListener("click", async () => {
      if (numberPage === this.currentPage) return;

      this.currentPage = numberPage;
      await this.loadData(this.currentPage, this.pageSize);
    });
    return btn;
  }

  _emptyState() {
    // Placeholder for empty state handling if needed in future
    this.container.querySelector(".table").classList.add("hide");
    this.container.querySelector(".empty-state").classList.remove("hide");
    if (!this.emptyAnimation) {
      this.emptyAnimation = lottie.loadAnimation({
        container: this.container.querySelector(".empty-state"), // The container element
        renderer: "svg", // Render as SVG
        loop: true, // Loop the animation
        autoplay: true, // Start playing automatically
        path: this.pathAnimation, // Path to the Lottie JSON file
      });
    }
  }

  _showTable() {
    if (this.emptyAnimation) {
      this.emptyAnimation.destroy();
      this.emptyAnimation = null;
    }
    this.container.querySelector(".table").classList.remove("hide");
    this.container.querySelector(".empty-state").classList.add("hide");
  }

  setData(data, totalRecords = 0) {
    const bodyEl = this.container.querySelector(".table-body");
    this.data = data || [];
    this.totalRecords = totalRecords;

    bodyEl.innerHTML = "";
    this._buildPagination();
    if (this.data.length === 0) {
      this._emptyState();
      return;
    }

    this._showTable();

    this.data.forEach((rowData, rowIndex) => {
      bodyEl.appendChild(this.buildRow(rowData, rowIndex));
    });
  }

  buildRow(data, index) {
    let presenterData =
      this.mapRow !== undefined && this.mapRow !== null
        ? this.mapRow(data)
        : data;

    return this.renderRow(data, presenterData);
  }
}

module.exports = TableData;
