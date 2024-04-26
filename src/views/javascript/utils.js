export function amountConversion(amount, fractionDigits) {
  if (amount && 'number' === typeof amount) {
    amount = Number((amount / Math.pow(10, fractionDigits)).toFixed(fractionDigits)) * 1;
  }
  return amount;
}

export function roundOff(amount, fractionDigits) {
  let value = 0;
  if (amount && 'number' === typeof amount) {
    value = Math.round(amount * Math.pow(10, fractionDigits)) / Math.pow(10, fractionDigits);
  }
  return value;
}

export function dateConversion(dateString) {
  if (dateString) {
    const date = new Date(dateString);
    const options = { hour12: false };
    const readableDate = date.toLocaleString('en-US', options);
    return readableDate.replace(/,/g, '');
  }
}

export function getPaymentId() {
  const url = new URL(window.location.href);
  const paymentId = url.searchParams.get('id');
  return paymentId;
}

export function createElement(tag, html = '', className = '') {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  element.innerHTML = html;
  return element;
}

export function createTableRow(tableBody, cellsData) {
  if (tableBody && cellsData) {
    const row = tableBody.insertRow();
    cellsData.forEach((data) => {
      const cell = row.insertCell();
      cell.innerHTML = data;
    });
  }
}

export function formatCurrency(amount, currencyCode) {
  return `${currencyCode} ${amount}`;
}
