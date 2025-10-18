const db = require("../data/database/db");
const SalesReportGenerator = require("../data/reports/SalesReportGenerator");

class ReportService {
  async generateSalesReport() {
    try {
      // Obtener todas las ventas con datos de usuario
      const sales = db
        .prepare(
          `
        SELECT 
          s.id AS sale_id,
          u.name AS user_name,
          s.total_price,
          s.state,
          s.created_at
        FROM sales s
        JOIN users u ON s.user_id = u.id
        ORDER BY s.created_at DESC;
      `
        )
        .all();

      // Obtener los productos por cada venta
      const detailStmt = db.prepare(`
        SELECT 
          ds.sale_id,
          p.name AS product_name,
          ds.lot AS quantity,
          ds.price AS price,
          (ds.price * ds.lot) AS subtotal
        FROM detail_sales ds
        JOIN products p ON p.id = ds.product_id
        ORDER BY ds.sale_id;
      `);

      const details = detailStmt.all();

      // Agrupar los detalles por ID de venta
      const salesWithDetails = sales.map((sale) => ({
        ...sale,
        details: details.filter((d) => d.sale_id === sale.sale_id),
      }));

      // Generar el PDF
      const generator = new SalesReportGenerator("sales.pdf");
      const pdfPath = await generator.generate(salesWithDetails);
      return pdfPath;
    } catch (error) {
      console.error("❌ Error generando reporte PDF:", error);
      throw error;
    }
  }
}

module.exports = ReportService;
