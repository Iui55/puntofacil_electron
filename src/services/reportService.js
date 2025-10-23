const SalesReportGenerator = require("../data/reports/SalesReportGenerator");

class ReportService {
  async generateSalesReport(sales) {
    const generator = new SalesReportGenerator("sales.pdf");
    const pdfPath = await generator.generate(sales);
    return pdfPath;
  }
}

module.exports = new ReportService();
