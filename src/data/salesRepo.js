import db from "./database/db.js";

export class SalesRepo {
  getAllSales() {
    return db.prepare("SELECT * FROM sales").all();
  }

  getSales(toSearch, page, pageSize) {
    const offset = (page - 1) * pageSize;
    return {
      data: db
        .prepare("SELECT * FROM sales LIMIT ? OFFSET ?")
        .all(pageSize, offset),
      total: db.prepare("SELECT COUNT(*) as count FROM sales").get().count,
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
        detailQuery.run(
          saleInfo.lastInsertRowid,
          product.id,
          product.lot,
          product.cost,
          product.price,
        );
      });
    });

    makeSale();
    return saleInfo.lastInsertRowid;
  }
}
