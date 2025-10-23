// src/data/reports/SalesReportGenerator.js
const path = require("path");
const { COLORS } = require("./config/pdfConstants");
const PdfBaseGenerator = require("./PDFBaseGenerator");

function getVal(obj, ...keys) {
  for (const k of keys) {
    if (obj && obj[k] !== undefined) return obj[k];
  }
  return undefined;
}

class SalesReportGenerator extends PdfBaseGenerator {
  async generate(sales) {
    const streamPromise = this.initStream();
    this.addHeader(
      "Reporte de Ventas",
      path.join(__dirname, "../..", "assets/images/puntofacil.png")
    );

    let y = 130;
    this.doc.fontSize(12);

    sales.forEach((sale, index) => {
      if (y > 700) {
        this.doc.addPage();
        y = 80;
      }

      // === Encabezado de la venta ===
      this.doc
        .fillColor("#1E3A8A")
        .fontSize(13)
        .text(`Venta #${sale.sale_id}`, 50, y);
      this.doc
        .fontSize(10)
        .fillColor("black")
        .text(`Vendedor: ${sale.user_name}`, 150, y)
        .text(
          `Fecha: ${new Date(sale.created_at * 1000).toLocaleString("es-MX")}`,
          320,
          y
        )
        .text(`Total: $${sale.total_price.toFixed(2)}`, 500, y, {
          align: "right",
        });

      y += 20;

      // === Detalles de productos ===
      const headers = ["Producto", "Cant.", "Precio", "Subtotal"];
      const colX = [60, 280, 360, 450];
      this.doc.fontSize(10).fillColor("#1E3A8A");
      headers.forEach((h, i) => this.doc.text(h, colX[i], y));
      y += 15;

      this.doc.fillColor("black");
      sale.details.forEach((detail) => {
        this.doc.text(detail.product_name, colX[0], y, { width: 200 });
        this.doc.text(detail.quantity.toString(), colX[1], y);
        this.doc.text(`$${detail.price.toFixed(2)}`, colX[2], y);
        this.doc.text(`$${detail.subtotal.toFixed(2)}`, colX[3], y);
        y += 15;

        if (y > 720) {
          this.doc.addPage();
          y = 80;
        }
      });

      // Línea separadora
      this.doc
        .moveTo(50, y + 5)
        .lineTo(550, y + 5)
        .strokeColor("#1E3A8A")
        .stroke();

      y += 25;
    });

    this.finish();
    return await streamPromise;
  }
}

module.exports = SalesReportGenerator;
