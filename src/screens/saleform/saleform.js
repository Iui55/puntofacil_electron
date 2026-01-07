(() => {
  const { ipcRenderer } = require("electron");
  const { sendNotification, formatMoney } = require("../utils/utils.js");
  let saleItems = [];

  // ----- Helpers -----
  const $ = (sel) => document.querySelector(sel);

  // ----- Elements UI -----
  const saleNumberInput = $("#saleNumber");
  const saleItemsList = $("#saleItemsList");
  const totalValueEl = $("#totalValue");
  const cashInput = $("#cashInput");
  const changeInput = $("#changeInput");
  const registerBtn = $("#registerSale");

  // ----- Componentes -----
  const SearchBar = require("../components/searchBar/searchBar.js");
  const TableData = require("../components/tableData/tableData.js");

  // Components state
  const cartTable = new TableData({
    container: document.getElementById("saleProductsTable"),
    tableBoxClass: "cart-table",
    pathAnimation: "../../assets/animations/empty-car.json",
    showPagination: false,
    showHeaders: false,
    headers: [
      { label: "Producto", key: "name", flex: 4 },
      { label: "Cantidad", key: "lot", flex: 1, class: "cart-col center" },
      { label: "Precio", key: "price", flex: 2, class: "cart-col center" },
    ],
    actions: [
      {
        label: "Eliminar",
        class: "delete",
        icon: "fa fa-trash",
        onClick: (row) => {},
      },
    ],
    rowClass: "cart-row",
    colClass: "cart-col",
    mapRow: (data) => {
      return {
        ...data,
        price: formatMoney(data.price),
      };
    },
    loadData: (page, pageSize) => {
      loadCart(cartTable);
    },
    data: [],
  });

  const productsTable = new TableData({
    container: document.getElementById("productsTable"),
    headers: [{ label: "Catálogo", key: "id" }],
    renderRow: renderCatalogRow,
    data: [],
    loadData: (page, pageSize) => {
      loadProducts(productsTable, page, pageSize);
    },
  });

  const sbProducts = new SearchBar({
    container: document.querySelector(".search-products"),
    placeholder: "Buscar productos",
    onSearch: async (toSearch) => {
      loadProducts(productsTable, 1, productsTable.pageSize, toSearch);
    },
    onClear: () => {
      loadProducts(productsTable, (pageSize = productsTable.pageSize));
    },
  });

  /* ==== Logic ==== */

  // ----- Sale number logic (persistente) -----
  function renderSaleNumber() {
    ipcRenderer.invoke("sales:getNextSaleNumber").then((nextId) => {
      saleNumberInput.value = String(nextId).padStart(10, "0");
    });
  }

  // ---- Add new product to sale logic -----
  // function renderSaleItems() {
  //   saleItemsList.innerHTML = "";
  //   if (saleItems.length === 0) {
  //     saleItemsList.innerHTML = `<div style="color:#6a7a9a">No hay productos agregados.</div>`;
  //     updateTotal();
  //     return;
  //   }

  //   saleItems.forEach((it, idx) => {
  //     const row = document.createElement("div");
  //     row.className = "sale-item";

  //     const nameEl = document.createElement("div");
  //     nameEl.className = "item-name";
  //     nameEl.textContent = it.name;

  //     const priceEl = document.createElement("div");
  //     priceEl.className = "item-price";
  //     priceEl.textContent = "$ " + formatCurrency(it.price);

  //     const trashBtn = document.createElement("button");
  //     trashBtn.className = "item-trash";
  //     trashBtn.title = "Eliminar";
  //     trashBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;
  //     trashBtn.addEventListener("click", () => {
  //       // Remove product
  //       saleItems.splice(idx, 1);
  //       renderSaleItems();
  //       const found = productsTable.data.findIndex(
  //         (product) => it.id === product.id
  //       );

  //       if (found >= 0) {
  //         productsTable.data[found].stock++;
  //         productsTable.setData(productsTable.data, productsTable.data.length);
  //       }
  //     });

  //     row.appendChild(nameEl);
  //     row.appendChild(priceEl);
  //     row.appendChild(trashBtn);
  //     saleItemsList.appendChild(row);
  //   });
  //   updateTotal();
  // }

  function updateTotal() {
    const total = saleItems.reduce((s, it) => s + Number(it.price || 0), 0);
    totalValueEl.textContent = formatMoney(total);

    // Update UI
    const cash = parseFloat(cashInput.value || 0);
    const change = Math.max(0, cash - total);
    changeInput.value = formatMoney(change);
  }

  // ----- Cart rendering -----
  // Load products from main process
  async function loadCart(table) {
    ipcRenderer.invoke("sales:getCart").then((res) => {
      console.log("Cart data:", res);
      let data = res || [];
      table.setData(data, data.length);
    });
  }

  // ----- Catalog rendering (pagination + filtering) -----
  function renderCatalogRow(rowData, index) {
    const row = document.createElement("div");
    row.className = "catalog-row";

    const name = document.createElement("div");
    name.className = "catalog-name";
    name.textContent = rowData.name;

    const stock = document.createElement("div");
    stock.className = "catalog-stock";
    stock.textContent = rowData.stock;

    const addBtn = document.createElement("button");
    addBtn.className = "catalog-add";
    addBtn.textContent = "Agregar";
    addBtn.addEventListener("click", () => {
      if (rowData.stock === 0) {
        sendNotification(`${rowData.name} no disponible`);
        return;
      }
      rowData.stock -= 1;
      stock.textContent = rowData.stock;
      addSaleProduct({ ...rowData });
    });

    row.appendChild(name);
    row.appendChild(stock);
    row.appendChild(addBtn);
    return row;
  }
  // Load products from main process
  async function loadProducts(
    table,
    page = 1,
    pageSize = 10,
    toSearch = sbProducts.lastSearch || ""
  ) {
    const response = await ipcRenderer.invoke("products:get", {
      page,
      pageSize,
      toSearch,
    });

    table.currentPage = page;
    table.setData(response.data, response.total);
  }

  // ----- Save sale -----
  async function addSale(sale) {
    return await ipcRenderer.invoke("sales:add", { ...sale });
  }

  /* ==== Eventos UI ==== */
  cashInput.addEventListener("input", () => {
    // ensure numeric format
    const v = parseFloat(cashInput.value || 0) || 0;
    cashInput.value = Number(v).toFixed(2);
    updateTotal();
  });

  //
  function addSaleProduct(product) {
    ipcRenderer.invoke("sales:addToCart", product).then(() => {
      loadCart(cartTable);
    });
  }

  registerBtn.addEventListener("click", () => {
    if (saleItems.length === 0) {
      sendNotification("No hay productos seleccionados");
      return;
    }

    const total = saleItems.reduce((s, it) => s + Number(it.price || 0), 0);
    if (parseFloat(cashInput.value || 0) < total) {
      sendNotification("El efectivo no alcanza el monto total", "error");
      return;
    }

    const saleRecord = {
      id: Number(saleNumberInput.value), // devuelve el nuevo número guardado
      date: new Date().toISOString(),
      products: saleItems.slice(),
      total: total,
      cash: parseFloat(cashInput.value || 0),
      change: parseFloat(changeInput.value || 0),
    };

    addSale(saleRecord)
      .then((response) => {
        // Clear sale data
        if (response === false) throw Error("Sale no registered");

        saleItems = [];
        renderSaleItems();
        cashInput.value = "0.00";
        changeInput.value = "0.00";

        renderSaleNumber();
      })
      .catch(() => {
        sendNotification("Venta no registrada", "error");
      });
  });

  // ---- Init Process ----
  renderSaleNumber();
})();
