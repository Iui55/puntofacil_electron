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

function getProducts(toSearch) {
    try {
        return productsRepo.getProducts(toSearch);
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
        throw error;
    }
}

module.exports = {
  getAllProducts, getProducts,
  addProduct
};