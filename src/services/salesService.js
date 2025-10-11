const { SalesRepo } = require("../data/salesRepo");

salesRepo = new SalesRepo();

function getAllSales() {
  try {
    return salesRepo.getAllSales();
  } catch (error) {
    console.error("Error fetching sales:", error);
    throw error;
  }
}

function getSales(page, pageSize, filter) {
  try {
    return salesRepo.getSales(page, pageSize, filter);
  } catch (error) {
    console.error("Error fetching sales:", error);
    throw error;
  }
}

function getLastSale() {
    try {
        return salesRepo.getLastSale() || {id: 0};
    } catch (error) {
        console.error("Error get sale:", error);
        return false;
    }
}

function addSale(sale, userId) {
  try {
    const group_products = sale.products.reduce((acc, product) => {
      if (!acc[product.id]) {
        acc[product.id] = { ...product, lot: 1 };
      } else {
        acc[product.id].lot++;
      }
      return acc;
    }, {});

    sale.products = Object.values(group_products);
    return salesRepo.addSale(sale, userId);
  } catch (error) {
    console.error("Error adding sale:", error);
    return false;
  }
}

module.exports = {
    getAllSales,
    getSales,
    getLastSale,
    addSale
};
