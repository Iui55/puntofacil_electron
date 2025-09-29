import db from "./database/db.js";

export class ProductsRepo {
  getAllProducts() {
    return db.prepare("SELECT * FROM products").all();
  }

  getProducts(toSearch, page, pageSize) {
    const offset = (page - 1) * pageSize;
    const baseQuery = `SELECT * FROM products
                       WHERE CAST(id AS TEXT) LIKE '%' || ? || '%'
                             OR name LIKE '%' || ? || '%' COLLATE NOCASE
                             OR description LIKE '%' || ? || '%' COLLATE NOCASE`;

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
      .run(info.lastInsertRowid, userId, "created");

    return info.lastInsertRowid;
  }
}
