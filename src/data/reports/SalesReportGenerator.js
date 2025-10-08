const path = require("path");
const { COLORS } = require("./config/pdfConstants");
const PdfBaseGenerator = require("./PDFBaseGenerator");

class SalesReportGenerator extends PdfBaseGenerator {
  async generate(sales) {
    const streamPromise = this.initStream();
    this.addHeader(
      "Reporte de Ventas",
      // path.join(__dirname, "../..", "assets/images/puntofacil.jpg")
    );

    // Table headers
    const headers = ["Producto", "Cantidad", "Precio", "Fecha", "Total"];
    const colX = [50, 200, 300, 380, 470];
    let y = 150;

    this.doc.fontSize(12).fillColor(COLORS.primary);
    headers.forEach((h, i) => this.doc.text(h, colX[i], y));
    this.doc
      .moveTo(50, y + 15)
      .lineTo(550, y + 15)
      .strokeColor(COLORS.primary)
      .stroke();
    y += 25;

    let total = 0;
    sales.forEach((s) => {
      this.doc.fontSize(10).fillColor("black");
      this.doc.text(s.product || "", colX[0], y);
      this.doc.text(s.quantity || "", colX[1]);
      this.doc.text(`$${s.price?.toFixed(2) || "0.00"}`, colX[2]);
      this.doc.text(new Date(s.date).toLocaleDateString(), colX[3]);
      this.doc.text(`$${s.total?.toFixed(2) || "0.00"}`, colX[4]);
      total += s.total || 0;
      y += 18;
      if (y > 750) {
        this.doc.addPage();
        y = 60;
      }
    });

    this.doc.moveDown(2);
    this.doc
      .fontSize(14)
      .fillColor(COLORS.primary)
      .text(`Total general: $${total.toFixed(2)}`, { align: "right" });
    
    this.finish();
    return await streamPromise;
  }
}

module.exports = SalesReportGenerator;
