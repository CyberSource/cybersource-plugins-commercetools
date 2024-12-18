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
  let paymentId = '';
  const urlInstance = new URL(window.location.href);
  if (validateWhiteListEndPoints(urlInstance?.pathname)) {
    paymentId = urlInstance.searchParams.get('id');
  }
  return paymentId;
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

// Regular expression validation for validating paymentId
export function validatePaymentId(paymentId) {
  let validatedId = ''
  const paymentIdRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (paymentIdRegex.test(paymentId)) {
    validatedId = paymentId;
  }
  return validatedId;
}

export function validateAmountValue(amount) {
  let validatedAmount;
  if ('number' === typeof amount) {
    validatedAmount = amount;
  }
  return validatedAmount;
}

export const validateWhiteListEndPoints = (url) => {
  const whiteListEndpoints = ['/api/extension/payment/create', '/api/extension/payment/update',
    '/api/extension/customer/update', '/netTokenNotification', '/captureContext', '/orders', '/orderData',
    '/capture', '/refund', '/authReversal', '/paymentDetails', '/paymentData', '/payerAuthReturnUrl',
    '/sync', '/decisionSync', '/configureExtension', '/generateHeader', '/favicon.ico'];
  let urlValidated = false;
  if (whiteListEndpoints.includes(url)) {
    urlValidated = true;
  }
  return urlValidated;
}

export const validPathRegex = /^\/paymentDetails\?id=[a-fA-F0-9\-]{36}$/;
;
