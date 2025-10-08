const SalesReportGenerator = require("../data/reports/SalesReportGenerator");

class ReportService {
    async generateSalesReport(sales) {
        const generator = new SalesReportGenerator("sales.pdf");
        return generator.generate(sales);
    }
}

module.exports = ReportService;