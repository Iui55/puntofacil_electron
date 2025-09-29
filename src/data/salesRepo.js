import db from "./database/db.js";

export class SalesRepo {
  getAllSales() {
    return db.prepare("SELECT * FROM sales").all();
  }

  // getSales(toSearch, page, pageSize) {
  //   const offset = (page - 1) * pageSize;
  //   const baseQuery = `SELECT * FROM products
  //                      WHERE CAST(id AS TEXT) LIKE '%' || ? || '%'
  //                            OR name LIKE '%' || ? || '%' COLLATE NOCASE
  //                            OR description LIKE '%' || ? || '%' COLLATE NOCASE`;

  //   // Get total records for pagination
  //   const totalRecords = db
  //     .prepare(`SELECT COUNT(*) as count FROM (${baseQuery})`)
  //     .get(toSearch, toSearch, toSearch).count;
  //   if (page && pageSize) {
  //     return {
  //       data: db
  //         .prepare(`${baseQuery} LIMIT ? OFFSET ?`)
  //         .all(toSearch, toSearch, toSearch, pageSize, offset),
  //       total: totalRecords,
  //     };
  //   }

  //   return {
  //     data: db.prepare(baseQuery).all(toSearch, toSearch, toSearch),
  //     total: totalRecords,
  //   };
  // }

  addSale(sale, userId) {
    const saleQuery = db.prepare(
      "INSERT INTO sales (user_id, total_price, state) VALUES (?, ?, ?)"
    );
    const detailQuery = db.prepare(
      "INSERT INTO detail_sales (sale_id, product_id, cost, price) VALUES (?, ?, ?, ?)"
    );

    const makeSale = db.transaction(() => {
      const saleInfo = saleQuery.run(sale.total_price, product.state, userId);
      sale.products.forEach((element) => {
        detailQuery.run(
          saleInfo.lastInsertRowid,
          product.id,
          product.cost,
          product.price
        );
      });
    });

    makeSale();
    return true;
  }
}
