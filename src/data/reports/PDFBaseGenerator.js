const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const os = require("os");

const { COLORS } = require("./config/pdfConstants");

class PdfBaseGenerator {
  constructor(filename) {
    this.filename = filename; 
    this.doc = new PDFDocument({ margin: 40 });
  }

  initStream() {
    let stream;
    try {
      this.filePath = path.join(os.homedir(), "Downloads", this.filename);
      stream = fs.createWriteStream(this.filePath);
    } catch(error) {
      this.filePath = path.join(os.homedir(), "Descargas", this.filename);
      stream = fs.createWriteStream(this.filePath);
    }

    this.doc.pipe(stream);
    return new Promise((resolve, reject) => {
      this.doc.on("end", () => resolve(this.filePath));
      stream.on("finish", () => resolve(this.filePath));
      stream.on("error", reject);
    });
  }

  addHeader(title, logoPath = null) {
    if (logoPath) this.doc.image(logoPath, 50, 40, { width: 60 });
    this.doc
      .fontSize(18)
      .fillColor(COLORS.primary)
      .text(title, 120, 50)
      .moveDown(1)
      .fontSize(12)
      .fillColor("black")
      .text(`Fecha de generación: ${new Date().toLocaleString("es-MX")}`, {
        align: "right",
      });

    this.doc.moveDown(2);
  }

  addFooter() {}

  finish() {
    this.doc.end();
  }
}

module.exports = PdfBaseGenerator;
