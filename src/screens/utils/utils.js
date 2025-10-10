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

function formatDate(value) {
  const date = new Date(value * 1000);
  return date.toLocaleString(value);
}

function saleState(stateId) {
  return { 1: "Completada" }[stateId];
}

function buildDatePicker(component, mode = "range") {
  return flatpickr(component, {
    mode,
    dateFormat: "Y-m-d",
    altInput: true,
    altFormat: "F j, Y",
    locale: {
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
  });
}

module.exports = {
  sendNotification,
  formatMoney,
  formatDate,
  saleState,
  buildDatePicker,
};
