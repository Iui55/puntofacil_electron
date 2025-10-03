const { ProductsRepo } = require("../data/productsRepo");

productsRepo = new ProductsRepo();

function getAllProducts() {
  try {
    return productsRepo.getAllProducts();
  } catch (error) {
    console.error("Error fetching products:", error);
    return false;
  }
}

function getProducts(toSearch, page, pageSize) {
  try {
    return productsRepo.getProducts(toSearch, page, pageSize);
  } catch (error) {
    console.error("Error fetching products by name:", error);
    return false;
  }
}

function addProduct(product, userId) {
  try {
    return productsRepo.addProduct(product, userId);
  } catch (error) {
    console.error("Error adding product:", error);
    return false;
  }
}

function updateProduct(product, userId) {
  try {
    return productsRepo.updateProduct(product, userId);
  } catch (error) {
    console.error("Error updating product:", error);
    return false;
  }
}

function deleteProduct(product, userId) {
  try {
    return productsRepo.deleteProduct(product, userId);
  } catch (error) {
    console.error("Error deleting product:", error);
    return false;
  }
}

module.exports = {
  getAllProducts,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct
};
