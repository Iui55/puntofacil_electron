import db from "./database/db.js";

export class SalesRepo {
  getAllSales() {
    return db.prepare("SELECT * FROM sales").all();
  }

  getSales(page, pageSize, filter) {
    const offset = (page - 1) * pageSize;
    const baseQuery = `SELECT * FROM sales WHERE created_at BETWEEN ? AND ? 
                       AND (CAST(id AS TEXT) LIKE '%' || ? || '%')`

    return {
      data: db
        .prepare(`${baseQuery} LIMIT ? OFFSET ?`)
        .all(
          filter.fromDate,
          filter.toDate,
          filter.toSearch || "",
          pageSize,
          offset
        ),
      total: db
        .prepare(`SELECT COUNT(*) as count FROM (${baseQuery})`)
        .get(
          filter.fromDate,
          filter.toDate,
          filter.toSearch || "",
        ).count,
    };
  }

  getLastSale() {
    const info = db
      .prepare("SELECT * FROM sales ORDER BY id DESC LIMIT 1")
      .get();
    return info;
  }

  addSale(sale, userId) {
    let saleInfo;
    const saleQuery = db.prepare(
      "INSERT INTO sales (user_id, total_price, state) VALUES (?, ?, ?)"
    );
    const detailQuery = db.prepare(
      "INSERT INTO detail_sales (sale_id, product_id, lot, cost, price) VALUES (?, ?, ?, ?, ?)"
    );
    const makeSale = db.transaction(() => {
      saleInfo = saleQuery.run(userId, sale.total, 1);

      sale.products.forEach((product) => {
        db.prepare(`UPDATE products SET stock = stock - ? WHERE id = ?`).run(
          product.lot,
          product.id
        );

        detailQuery.run(
          saleInfo.lastInsertRowid,
          product.id,
          product.lot,
          product.cost,
          product.price
        );
      });
    });

    makeSale();
    return saleInfo.lastInsertRowid;
  }

  // addTempSale(product) {
  //   const tempTableSale = db
  //     .prepare(
  //       `CREATE TABLE IF NOT EXISTS temp_sales (
  //       id INTEGER PRIMARY KEY AUTOINCREMENT,
  //       product_id INTEGER NOT NULL,
  //       lot INTEGER NOT NULL,
  //       date INTEGER DEFAULT (strftime('%s','now'))
  //     );`
  //     )
  //     .run();

  //   const saleTemp = db
  //     .prepare("INSERT INTO temp_sales (product_id, lot) VALUES (?, ?)")
  //     .run(product.id, product.lot);

  //   return saleTemp.lastInsertRowid;
  // }
}
