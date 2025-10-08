// src/reports/date-filters.js

function isSameDay(dateA, dateB) {
  return (
    dateA.getDate() === dateB.getDate() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getFullYear() === dateB.getFullYear()
  );
}

function filterSalesByOption(sales, option, start, end) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (option) {
    case "today":
      return sales.filter((s) => isSameDay(new Date(s.date), today));

    case "yesterday":
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      return sales.filter((s) => isSameDay(new Date(s.date), yesterday));

    case "week":
      const startWeek = new Date(today);
      startWeek.setDate(today.getDate() - today.getDay());
      return sales.filter((s) => new Date(s.date) >= startWeek);

    case "month":
      return sales.filter(
        (s) =>
          new Date(s.date).getMonth() === today.getMonth() &&
          new Date(s.date).getFullYear() === today.getFullYear()
      );

    case "range":
      const startDate = new Date(start);
      const endDate = new Date(end);
      return sales.filter((s) => {
        const d = new Date(s.date);
        return d >= startDate && d <= endDate;
      });

    default:
      return sales;
  }
}

module.exports = { filterSalesByOption };
