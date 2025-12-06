import db from "./database/db.js";

export class ProductsRepo {
  getAllProducts() {
    return db.prepare("SELECT * FROM products").all();
  }

  getProducts(toSearch, page, pageSize) {
    const offset = (page - 1) * pageSize;
    const baseQuery = `SELECT * FROM products
                       WHERE enabled = 1 
                             AND (CAST(id AS TEXT) LIKE '%' || ? || '%'
                             OR name LIKE '%' || ? || '%' COLLATE NOCASE
                             OR description LIKE '%' || ? || '%' COLLATE NOCASE)`;

    // Get total records for pagination
    const totalRecords = db
      .prepare(`SELECT COUNT(*) as count FROM (${baseQuery})`)
      .get(toSearch, toSearch, toSearch).count;

    if (page && pageSize) {
      return {
        data: db
          .prepare(`${baseQuery} LIMIT ? OFFSET ?`)
          .all(toSearch, toSearch, toSearch, pageSize, offset),
        total: totalRecords,
      };
    }

    return {
      data: db.prepare(baseQuery).all(toSearch, toSearch, toSearch),
      total: totalRecords,
    };
  }

  addProduct(product, userId) {
    let productInfo;
    const makeProduct = db.transaction(() => {
      productInfo = db
        .prepare(
          "INSERT INTO products (id, name, description, min_stock, stock, cost, price) VALUES (?, ?, ?, ?, ?, ?, ?)"
        )
        .run(
          product.id,
          product.name,
          product.description || "",
          product.min_stock,
          product.stock,
          product.cost,
          product.price
        );

      this._addAudit(product.id, userId, "created");
    });

    makeProduct();
    return product;
  }

  updateProduct(product, userId) {
    let productInfo;
    const makeProduct = db.transaction(() => {
      productInfo = db
        .prepare(
          `UPDATE products SET name = ?, description = ?, min_stock = ?, stock = ?, cost = ?, price = ?
           WHERE id = ?`
        )
        .run(
          product.name,
          product.description || "",
          product.min_stock,
          product.stock,
          product.cost,
          product.price,
          product.id
        );

      this._addAudit(product.id, userId, "updated");
    });

    makeProduct();
    return product;
  }

  deleteProduct(productId, userId) {
    let productInfo;
    const makeProduct = db.transaction(() => {
      productInfo = db
        .prepare("UPDATE products SET enabled = False WHERE id = ?")
        .run(productId);

      this._addAudit(productId, userId, "deleted");
    });

    makeProduct();
    return true;
  }

  _addAudit(productId, userId, action) {
    return db
      .prepare(
        "INSERT INTO audit_products (product_id, user_id, action) VALUES (?, ?, ?)"
      )
      .run(productId, userId, action);
  }
}
