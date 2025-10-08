const PDFDocument = require("pdfkit");
const fs = require("fs");

function generateSalesReport(sales, title, outputPath, logoPath) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: "A4" });
      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      const blue = "#1E3A8A";

      // HEADER
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 50, 40, { width: 60 });
      }
      doc
        .fontSize(18)
        .fillColor(blue)
        .text(title, 120, 50)
        .moveDown(1)
        .fontSize(12)
        .fillColor("black")
        .text(`Fecha de generación: ${new Date().toLocaleString("es-MX")}`, {
          align: "right",
        });

      doc.moveDown(2);

      // TABLE
      const headers = ["Producto", "Cantidad", "Precio", "Fecha", "Total"];
      const colX = [50, 200, 300, 380, 470];
      let y = 150;

      doc.fontSize(12).fillColor(blue);
      headers.forEach((h, i) => doc.text(h, colX[i], y));
      doc
        .moveTo(50, y + 15)
        .lineTo(550, y + 15)
        .strokeColor(blue)
        .stroke();
      y += 25;

      let total = 0;
      sales.forEach((s) => {
        doc.fontSize(10).fillColor("black");
        doc.text(s.product || "", colX[0], y);
        doc.text(s.quantity || "", colX[1]);
        doc.text(`$${s.price?.toFixed(2) || "0.00"}`, colX[2]);
        doc.text(new Date(s.date).toLocaleDateString(), colX[3]);
        doc.text(`$${s.total?.toFixed(2) || "0.00"}`, colX[4]);
        total += s.total || 0;
        y += 18;
        if (y > 750) {
          doc.addPage();
          y = 60;
        }
      });

      doc.moveDown(2);
      doc
        .fontSize(14)
        .fillColor(blue)
        .text(`Total general: $${total.toFixed(2)}`, { align: "right" });

      //doc.pipe(stream);
      doc.end();

      stream.on("finish", () => resolve(outputPath));
      stream.on("error", reject);
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { generateSalesReport };
