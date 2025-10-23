const { ipcRenderer } = require("electron");
const flatpickr = require("flatpickr");

function sendNotification(message, type = "warning") {
  ipcRenderer.send("notifications:push", {
    message: message,
    type: type,
  });
}

function formatMoney(value) {
  return `$${value.toFixed(2)}`;
}

function formatDateTime(value) {
  const date = new Date(value * 1000);
  return date.toLocaleString();
}

function formatDate(date) {
  // Adjust to local timezone
  const offsetMs = date.getTimezoneOffset() * 60000;
  const local = new Date(date.getTime() - offsetMs);
  return local.toISOString().split("T")[0];
}

function saleState(stateId) {
  return { 1: "Completada" }[stateId];
}

function buildDatePicker(component, defaultMode = "range", onChange = null) {
  const today = formatDate(new Date());
  const config = {
    mode: defaultMode,
    dateFormat: "Y-m-d",
    conjunction: " - ",
    altInput: true,
    altFormat: "F j, Y",
    locale: {
      rangeSeparator: " a ",
      firstDayOfWeek: 1,
      weekdays: {
        shorthand: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
        longhand: [
          "Domingo",
          "Lunes",
          "Martes",
          "Miércoles",
          "Jueves",
          "Viernes",
          "Sábado",
        ],
      },
      months: {
        shorthand: [
          "Ene",
          "Feb",
          "Mar",
          "Abr",
          "May",
          "Jun",
          "Jul",
          "Ago",
          "Sep",
          "Оct",
          "Nov",
          "Dic",
        ],
        longhand: [
          "Enero",
          "Febreo",
          "Мarzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre",
        ],
      },
    },

    defaultDate: [today, today],
  };

  if (onChange) {
    config["onChange"] = onChange;
  }
  return flatpickr(component, config);
}

module.exports = {
  sendNotification,
  formatMoney,
  formatDateTime,
  formatDate,
  saleState,
  buildDatePicker,
};
