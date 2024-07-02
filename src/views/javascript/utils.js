
/**
 * Converts an amount to a specified number of decimal places.
 * 
 * @param {number} amount - The amount to be converted.
 * @param {number} fractionDigits - The number of decimal places.
 * @returns {number} - The converted amount.
 */
export function amountConversion(amount, fractionDigits) {
  if (amount && 'number' === typeof amount) {
    amount = Number((amount / Math.pow(10, fractionDigits)).toFixed(fractionDigits)) * 1;
  }
  return amount;
}

/**
 * Rounds off an amount to a specified number of decimal places.
 * 
 * @param {number} amount - The amount to be rounded off.
 * @param {number} fractionDigits - The number of decimal places.
 * @returns {number} - The rounded off value.
 */
export function roundOff(amount, fractionDigits) {
  let value = 0;
  if (amount && 'number' === typeof amount) {
    value = Math.round(amount * Math.pow(10, fractionDigits)) / Math.pow(10, fractionDigits);
  }
  return value;
}

/**
 * Converts a date string to a readable date format.
 * 
 * @param {string} dateString - The date string to be converted.
 * @returns {string} - The converted readable date.
 */
export function dateConversion(dateString) {
  if (dateString) {
    const date = new Date(dateString);
    const options = { hour12: false };
    const readableDate = date.toLocaleString('en-US', options);
    return readableDate.replace(/,/g, '');
  }
}

/**
 * Extracts the payment ID from the URL query parameters.
 * 
 * @returns {string|null} - The payment ID if found, otherwise null.
 */
export function getPaymentId() {
  const url = new URL(window.location.href);
  const paymentId = url.searchParams.get('id');
  return paymentId;
}

/**
 * Creates a new HTML element with optional content and class name.
 * 
 * @param {string} tag - The HTML tag name of the element to create.
 * @param {string} html - The HTML content to insert into the element (default is empty).
 * @param {string} className - The class name to assign to the element (default is empty).
 * @returns {HTMLElement} - The created HTML element.
 */
export function createElement(tag, html = '', className = '') {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  if (html) {
    const range = document.createRange();
    const documentFragment = range.createContextualFragment(html);
    element.appendChild(documentFragment);
  }
  return element;
}

/**
 * Adds a new row to a table body with cells containing the specified data.
 * 
 * @param {HTMLTableSectionElement} tableBody - The table body element where the row will be added.
 * @param {Array<string>} cellsData - An array of data to be inserted into the row cells.
 */
export function createTableRow(tableBody, cellsData) {
  if (tableBody && cellsData) {
    const row = tableBody.insertRow();
    cellsData.forEach((data) => {
      const cell = row.insertCell();
      const range = document.createRange();
      const documentFragment = range.createContextualFragment(data);
      cell.appendChild(documentFragment);
    });
  }
}

export function createAndSetAttributes(type, attributes, textContent) {
  const element = document.createElement(type);
  for (const key in attributes) {
    if (attributes.hasOwnProperty(key)) {
      element[key] = attributes[key];
    }
  }
  if (textContent) {
    element.textContent = textContent;
  }
  return element;
}


/**
 * Formats an amount with a currency code.
 * 
 * @param {number} amount - The amount to be formatted.
 * @param {string} currencyCode - The currency code.
 * @returns {string} - The formatted currency string.
 */
export function formatCurrency(amount, currencyCode) {
  return `${currencyCode} ${amount}`;
}
