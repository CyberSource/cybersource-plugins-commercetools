import { amountConversion, dateConversion, validPathRegex } from './utils.js';

if (window.location.pathname.includes('orders')) {
  document.addEventListener('DOMContentLoaded', async function () {
    let runScript = document.getElementById('runScript');
    let decisionSync = document.getElementById('decisionSync');
    let sync = document.getElementById('sync');
    let collection = Object.values(document.getElementsByClassName('row'));
    let auth = document.getElementById('auth');
    let createSubscription = document.getElementById('webhookSubscription');
    const orders = await fetchOrdersInfo();

    switch (true) {
      case !!runScript:
        addEventListener(runScript);
        break;
      case !!createSubscription:
        addEventListener(createSubscription);
        break;
      case !!decisionSync:
        addEventListener(decisionSync);
        break;
      case !!sync:
        addEventListener(sync);
        break;
      case !!auth:
        addEventListener(auth);
        break;
      default:
        console.log('No valid element found.');
        break;
    }

    if (collection && 0 < collection.length) {
      collection.forEach((item) => {
        item.addEventListener('click', function (e) {
          window.location = item.getAttribute('data-href');
          document.getElementById('loading').style.display = 'flex';
        });
      });
    }
    if (orders?.orderSuccessMessage) {
      await displaySuccessMessage(orders.orderSuccessMessage);
    }
    if (orders?.orderErrorMessage) {
      await displayErrorMessage(orders.orderErrorMessage);
    }

    try {
      await renderOrders(orders.orderList);
    } catch (error) {
      console.log('error', error);
      await displayErrorMessage('Error fetching orders');
    }
  });
}

/**
 * Renders a list of orders in a table format.
 * 
 * @param {Array} orderList - List of orders to render.
 */
async function renderOrders(orderList) {
  const paymentDetailsBody = document.getElementById('paymentDetailsBody');
  paymentDetailsBody.textContent = '';

  if (orderList && 0 < orderList.length) {
    await Promise.all(
      orderList.map(async (order, index) => {
        if (order.transactions.length) {
          const fractionDigits = order?.amountPlanned?.fractionDigits;
          const newRow = createTableRow(index, order.id, order.amountPlanned.currencyCode,
            amountConversion(order?.amountPlanned?.centAmount, fractionDigits),
            order.paymentMethodInfo.name ? order?.paymentMethodInfo?.name?.en : order?.paymentMethodInfo?.method,
            dateConversion(order.createdAt),
            dateConversion(order.lastModifiedAt),
            `/paymentDetails?id=${encodeURIComponent(order.id)}`);
          newRow.addEventListener('click', () => {
            const url = newRow.getAttribute('data-href');
            if (validPathRegex.test(url)) {
              window.location.href = encodeURI(url);
            }
          });
          paymentDetailsBody.appendChild(newRow);
        }
      })
    );
  } else {
    const newRow = createTableRowEmpty();
    paymentDetailsBody.appendChild(newRow);
  }
}

/**
 * Creates a table row with order details.
 * 
 * @param {number} index - The index of the row.
 * @param {string} orderId - The order ID.
 * @param {string} currencyCode - The currency code.
 * @param {number} amount - The amount.
 * @param {string} paymentMethod - The payment method.
 * @param {string} createdAt - The creation date of the order.
 * @param {string} lastModifiedAt - The last modified date of the order.
 * @param {string} url - The URL associated with the row.
 * @returns {HTMLTableRowElement} - The created table row element.
 */
function createTableRow(index, orderId, currencyCode, amount, paymentMethod, createdAt, lastModifiedAt, url) {
  const newRow = document.createElement('tr');
  newRow.id = `cell-${index}`;
  newRow.classList.add('row');
  newRow.setAttribute('data-href', url);
  newRow.setAttribute('data-url', url);

  const orderCell = document.createElement('td');
  orderCell.textContent = orderId;
  newRow.appendChild(orderCell);

  const amountCell = document.createElement('td');
  amountCell.textContent = `${currencyCode} ${amount}`;
  newRow.appendChild(amountCell);

  const paymentCell = document.createElement('td');
  paymentCell.textContent = paymentMethod;
  newRow.appendChild(paymentCell);

  const createdAtCell = document.createElement('td');
  createdAtCell.textContent = createdAt;
  newRow.appendChild(createdAtCell);

  const lastModifiedAtCell = document.createElement('td');
  lastModifiedAtCell.textContent = lastModifiedAt;
  newRow.appendChild(lastModifiedAtCell);

  return newRow;
}

/**
 * Creates an empty table row indicating that there are no orders.
 * 
 * @returns {HTMLTableRowElement} - The created empty table row element.
 */
function createTableRowEmpty() {
  const newRow = document.createElement('tr');
  const cell = document.createElement('td');
  cell.setAttribute('colspan', '5');
  cell.classList.add('text-align');
  cell.textContent = 'There are no orders';
  newRow.appendChild(cell);
  return newRow;
}

/**
 * Displays an error message on the page.
 * 
 * @param {string} message - The error message to be displayed.
 * @returns {Promise<void>} - A Promise that resolves once the message is displayed.
 */
async function displayErrorMessage(message) {
  const orderErrorMessage = document.getElementById('orderErrorMessage');
  const emElement = orderErrorMessage.querySelector('em');
  emElement.classList.add('mark', 'error');
  orderErrorMessage.classList.add('alert', 'alert-error', 'alert-dismissible');
  orderErrorMessage.textContent = message;
}

/**
 * Displays a success message on the page.
 * 
 * @param {string} message - The success message to be displayed.
 * @returns {Promise<void>} - A Promise that resolves once the message is displayed.
 */
async function displaySuccessMessage(message) {
  const orderSuccessMessage = document.getElementById('orderSuccessMessage');
  orderSuccessMessage.classList.add('alert', 'alert-success', 'alert-dismissible');
  orderSuccessMessage.textContent = message;
}

/**
 * Fetches order information from the server.
 * 
 * @returns {Promise<any>} A Promise that resolves with the fetched order information.
 */
async function fetchOrdersInfo() {
  const loadingIndicator = document.getElementById('loading');
  try {
    loadingIndicator.style.display = 'flex';
    const response = await fetch('/orderData', {
      method: 'GET',
    });
    const ordersData = await response.text();
    const jsonData = JSON.parse(ordersData);
    return jsonData;
  } catch (error) {
    console.log('error', error);
    await displayErrorMessage('Error in fetching orders');
    loadingIndicator.style.display = 'none';
  } finally {
    loadingIndicator.style.display = 'none';
  }
}

/**
 * Adds a click event listener to the provided element.
 * 
 * @param {HTMLElement} element - The HTML element to attach the event listener to.
 */
function addEventListener(element) {
  element.addEventListener('click', showDiv);
}

/**
 * Displays the loading div by setting its display style to 'flex'.
 */
function showDiv() {
  document.getElementById('loading').style.display = 'flex';
}
