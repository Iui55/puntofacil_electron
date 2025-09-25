// src/js/ventas.js
(() => {
  // ----- Datos de ejemplo (puedes reemplazar por tu BD) -----
  const SAMPLE_PRODUCTS = [];
  // Generar 60 productos de prueba
  for (let i = 1; i <= 60; i++) {
    SAMPLE_PRODUCTS.push({
      id: i,
      name: i % 4 === 0 ? `Refresco 600 ml. ${i}` : `Producto ${i}`,
      price: i % 5 === 0 ? 12.5 + (i % 3) * 5 : 25.0,
      stock: Math.floor(5 + (i % 10) * 3),
    });
  }

  // ----- Estado -----
  let products = SAMPLE_PRODUCTS.slice();
  let filtered = products.slice();
  let pageSize = 10;
  let currentPage = 1;
  let saleItems = [];
  const STORAGE_KEY_LAST_SALE = "pf_last_sale_number";
  const STORAGE_KEY_SALES = "pf_sales_records";

  // ----- Helpers -----
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));
  const formatCurrency = (v) => Number(v).toFixed(2);

  // ----- Elementos -----
  const saleNumberInput = $("#saleNumber");
  const saleItemsList = $("#saleItemsList");
  const totalValueEl = $("#totalValue");
  const cashInput = $("#cashInput");
  const changeInput = $("#changeInput");
  const registerBtn = $("#registerSale");

  const catalogList = $("#catalogList");
  const pageSizeSelect = $("#pageSize");
  const searchInput = $("#searchInput");
  const clearSearch = $("#clearSearch");
  const prevPageBtn = $("#prevPage");
  const nextPageBtn = $("#nextPage");
  const pagesContainer = $("#pagesContainer");

  // ----- Sale number logic (persistente) -----
  function getNextSaleNumberPreview() {
    let last = parseInt(
      localStorage.getItem(STORAGE_KEY_LAST_SALE) || "1000000",
      10
    );
    return last + 1;
  }
  function incrementSaleNumber() {
    let last = parseInt(
      localStorage.getItem(STORAGE_KEY_LAST_SALE) || "1000000",
      10
    );
    last++;
    localStorage.setItem(STORAGE_KEY_LAST_SALE, String(last));
    return last;
  }

  // ----- Renderers -----
  function renderSaleNumber() {
    saleNumberInput.value = String(getNextSaleNumberPreview());
  }

  function renderSaleItems() {
    saleItemsList.innerHTML = "";
    if (saleItems.length === 0) {
      saleItemsList.innerHTML = `<div style="color:#6a7a9a">No hay productos agregados.</div>`;
      updateTotal();
      return;
    }
    saleItems.forEach((it, idx) => {
      const row = document.createElement("div");
      row.className = "sale-item";

      const nameEl = document.createElement("div");
      nameEl.className = "item-name";
      nameEl.textContent = it.name;

      const priceEl = document.createElement("div");
      priceEl.className = "item-price";
      priceEl.textContent = "$ " + formatCurrency(it.price);

      const trashBtn = document.createElement("button");
      trashBtn.className = "item-trash";
      trashBtn.title = "Eliminar";
      trashBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;
      trashBtn.addEventListener("click", () => {
        // eliminar sin confirmación
        saleItems.splice(idx, 1);
        renderSaleItems();
      });

      row.appendChild(nameEl);
      row.appendChild(priceEl);
      row.appendChild(trashBtn);
      saleItemsList.appendChild(row);
    });
    updateTotal();
  }

  function updateTotal() {
    const total = saleItems.reduce((s, it) => s + Number(it.price || 0), 0);
    totalValueEl.textContent = formatCurrency(total);
    // actualizar cambio automáticamente
    const cash = parseFloat(cashInput.value || 0);
    const change = Math.max(0, cash - total);
    changeInput.value = formatCurrency(change);
  }

  // ----- Catalog rendering (paginado + búsqueda) -----
  function getFilteredProducts() {
    const q = (searchInput.value || "").trim().toLowerCase();
    if (!q) return products.slice();
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }

  function renderCatalog() {
    filtered = getFilteredProducts();
    const total = filtered.length;
    const pages = Math.max(1, Math.ceil(total / pageSize));
    if (currentPage > pages) currentPage = pages;

    const start = (currentPage - 1) * pageSize;
    const pageItems = filtered.slice(start, start + pageSize);

    // render list
    catalogList.innerHTML = "";
    if (pageItems.length === 0) {
      catalogList.innerHTML = `<div style="color:#6a7a9a">No hay productos.</div>`;
    } else {
      pageItems.forEach((p) => {
        const row = document.createElement("div");
        row.className = "catalog-row";

        const name = document.createElement("div");
        name.className = "catalog-name";
        name.textContent = p.name;

        const stock = document.createElement("div");
        stock.className = "catalog-stock";
        stock.textContent = p.stock;

        const addBtn = document.createElement("button");
        addBtn.className = "catalog-add";
        addBtn.textContent = "Agregar";
        addBtn.addEventListener("click", () => {
          // agregar simple: hace push al arreglo de la venta
          saleItems.push({ id: p.id, name: p.name, price: Number(p.price) });
          renderSaleItems();
          // opcional: decrementar stock visualmente si lo deseas
        });

        row.appendChild(name);
        row.appendChild(stock);
        row.appendChild(addBtn);

        catalogList.appendChild(row);
      });
    }

    // render paginador
    renderPaginator(total, pages);
  }

  function renderPaginator(totalItems, pages) {
    pagesContainer.innerHTML = "";
    // Mostrar números de página (hasta 7 botones para no saturar)
    const maxButtons = 7;
    let start = 1,
      end = pages;
    if (pages > maxButtons) {
      const mid = Math.floor(maxButtons / 2);
      start = Math.max(1, currentPage - mid);
      end = start + maxButtons - 1;
      if (end > pages) {
        end = pages;
        start = pages - maxButtons + 1;
      }
    }
    for (let p = start; p <= end; p++) {
      const btn = document.createElement("div");
      btn.className = "page-number" + (p === currentPage ? " active" : "");
      btn.textContent = p;
      btn.addEventListener("click", () => {
        currentPage = p;
        renderCatalog();
      });
      pagesContainer.appendChild(btn);
    }

    // activar/desactivar previous/next
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === pages;
    prevPageBtn.style.opacity = prevPageBtn.disabled ? "0.6" : "1";
    nextPageBtn.style.opacity = nextPageBtn.disabled ? "0.6" : "1";
  }

  // ----- Eventos UI -----
  pageSizeSelect.addEventListener("change", (e) => {
    pageSize = parseInt(e.target.value, 10);
    currentPage = 1;
    renderCatalog();
  });

  searchInput.addEventListener("input", () => {
    currentPage = 1;
    renderCatalog();
  });
  clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    currentPage = 1;
    renderCatalog();
  });

  prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderCatalog();
    }
  });
  nextPageBtn.addEventListener("click", () => {
    const filteredCount = getFilteredProducts().length;
    const maxPage = Math.max(1, Math.ceil(filteredCount / pageSize));
    if (currentPage < maxPage) {
      currentPage++;
      renderCatalog();
    }
  });

  cashInput.addEventListener("input", () => {
    // asegurar formato numérico
    const v = parseFloat(cashInput.value || 0) || 0;
    cashInput.value = Number(v).toFixed(2);
    updateTotal();
  });

  registerBtn.addEventListener("click", () => {
    const total = saleItems.reduce((s, it) => s + Number(it.price || 0), 0);
    if (saleItems.length === 0) {
      alert("No hay productos para registrar.");
      return;
    }
    // puedes validar efectivo si lo deseas
    // guardar venta en localStorage
    const saleRecord = {
      id: incrementSaleNumber(), // devuelve el nuevo número guardado
      date: new Date().toISOString(),
      items: saleItems.slice(),
      total: total,
      cash: parseFloat(cashInput.value || 0),
      change: parseFloat(changeInput.value || 0),
    };
    const existing = JSON.parse(
      localStorage.getItem(STORAGE_KEY_SALES) || "[]"
    );
    existing.push(saleRecord);
    localStorage.setItem(STORAGE_KEY_SALES, JSON.stringify(existing));

    // limpiar venta actual
    saleItems = [];
    renderSaleItems();
    cashInput.value = "0.00";
    changeInput.value = "0.00";
    // actualizar número mostrado (ahora next será +1)
    renderSaleNumber();

    alert(`Venta registrada (folio: ${saleRecord.id}).`);
  });

  // ----- Inicialización -----
  function init() {
    // page size inicial desde select
    pageSize = parseInt(pageSizeSelect.value, 10);
    renderSaleNumber();
    renderSaleItems();
    renderCatalog();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
