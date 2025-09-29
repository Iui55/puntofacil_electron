const { ProductsRepo } = require("../data/productsRepo");

productsRepo = new ProductsRepo();

function getAllProducts() {
  try {
    return productsRepo.getAllProducts();
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

function getProducts(toSearch, page, pageSize) {
  try {
    return productsRepo.getProducts(toSearch, page, pageSize);
  } catch (error) {
    console.error("Error fetching products by name:", error);
    throw error;
  }
}

function addProduct(product, userId) {
  try {
    return productsRepo.addProduct(product, userId);
  } catch (error) {
    console.error("Error adding product:", error);
    return false;
    // throw error;
  }
}

module.exports = {
  getAllProducts,
  getProducts,
  addProduct,
};
