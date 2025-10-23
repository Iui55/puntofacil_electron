import db from "./database/db.js";

export class SalesRepo {
  getAllSales() {
    return db.prepare("SELECT * FROM sales").all();
  }

  getSales(page, pageSize, filter, includeDetails = false) {
    const baseQuery = `SELECT * FROM sales WHERE created_at BETWEEN ? AND ? 
    AND (CAST(id AS TEXT) LIKE '%' || ? || '%')`;

    let query = baseQuery;
    const params = [filter.fromDate, filter.toDate, filter.toSearch || ""];
    const total = db
      .prepare(`SELECT COUNT(*) as count FROM (${baseQuery})`)
      .get(...params).count;

    if (pageSize > 0) {
      // With pagination
      const offset = (page - 1) * pageSize;
      params.push(pageSize, offset);
      query += " LIMIT ? OFFSET ?";
    }

    const sales = db.prepare(query).all(...params);

    if (!includeDetails || sales.length === 0) return { data: sales, total };

    const ids = sales.map((s) => s.id).join(",");
    const detailsQuery = `
        SELECT
          ds.sale_id,
          p.name AS product_name,
          ds.lot AS quantity,
          ds.price AS price,
          (ds.price * ds.lot) AS subtotal
        FROM detail_sales ds
        LEFT JOIN products p ON p.id = ds.product_id
        WHERE ds.sale_id IN (${ids})`;

    const details = db.prepare(detailsQuery).all();

    const mappedSales = new Map(
      sales.map((sale) => [sale.id, { ...sale, details: [] }])
    );

    for (const detail of details) {
      mappedSales.get(detail.sale_id)?.details.push(detail);
    }

    return {
      data: Array.from(mappedSales.values()),
      total,
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
