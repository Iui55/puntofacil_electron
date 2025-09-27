import db from "./database/db.js";

export class ProductsRepo {
  getAllProducts() {
    return db.prepare("SELECT * FROM products").all();
  }

  addProduct(product, userId) {
    const info = db
      .prepare(
        "INSERT INTO products (name, description, stock, cost, price) VALUES (?, ?, ?, ?, ?)"
      )
      .run(
        product.name,
        product.description || "",
        product.stock,
        product.cost,
        product.price
      );

    if (info.changes === 0) {
      throw new Error("Failed to add product");
    }

    const auditInfo = db
      .prepare(
        "INSERT INTO audit_products (product_id, user_id, action) VALUES (?, ?, ?)"
      )
      .run(info.lastInsertRowid, userId, "create");

    return info.lastInsertRowid;
  }
}
