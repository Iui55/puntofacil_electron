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

function getSales(toSearch, page, pageSize) {
  try {
    return salesRepo.getSales(toSearch, page, pageSize);
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
